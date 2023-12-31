'use client'
import { useState, useEffect, useCallback } from "react";
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
} from '@mui/material';
import { MRT_EditActionButtons } from 'material-react-table';
import useRecordValidation from '@/hooks/useRecordValidation';
import TableColumnEditField from "@/components/Table/TableColumnEditField";

const actions = ["Create New", "Edit"]

function Form(props) {
    const { columns, action, tableName, table, row } = props
    const { setForm, validationErrors, setValidationErrors } = props
    const [innerFormData, setInnerForm] = useState({}) //avoid rerender, so sad

    console.log("From rendered")

    const onChange = (e) => {
        setInnerForm({ ...innerFormData, [e.target.name]: e.target.value })
    }
    const save = () => { //lol :-))
        setForm({ ...innerFormData })
    }

    useEffect(() => {
        setInnerForm({ ...row.original })
        console.log("Form mounted")
        return () => {
            console.log("Form unmounted")
            setValidationErrors({})
        }
    }, [row])

    return (
        <>
            <DialogTitle variant="h4">{action} {tableName || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {
                    columns.map((col, i) => (
                        <Stack key={i} direction={col.length == 2 ? "row" : "column"} gap={'1rem'}>
                            {
                                col.map((e, ii) => (
                                    <TableColumnEditField key={ii}
                                        col={e}
                                        value={innerFormData[e.accessorKey]}
                                        onChange={onChange}
                                        validationErrors={validationErrors}
                                        setValidationErrors={setValidationErrors} />
                                ))
                            }
                        </Stack>
                    ))
                }
            </DialogContent>
            <DialogActions onClickCapture={save}>
                <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
        </>
    )
}

export default function usePrompt(props) {

    const { columns, tableName, action } = props
    const { saveRecord } = props

    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setForm] = useState({})
    const [sortedColumns, setColumns] = useState([])
    const validateRecord = useRecordValidation(columns)

    useEffect(() => {
        console.log("Prompt rendered")
    })

    useEffect(() => {
        console.log("Prompt mounted", columns)

        const list = [];
        const filteredArray = [];

        columns.forEach((e, index) => {
            if (!e.input)
                return;
            const i = e.input;
            const group = i.group || 0;

            if (!list[group])
                list[group] = [];

            const place = i.order || index;

            let targetList = list[group];
            let currentIndex = place;

            while (targetList[currentIndex]) {
                currentIndex++;
            }

            targetList[currentIndex] = e;
        });

        list.forEach((group) => {
            if (group) {
                const filteredGroup = group.filter((element) => {
                    return element !== undefined && element !== null && element !== '';
                });
                filteredArray.push(filteredGroup);
            }
        });
        console.log("Columns sorted", filteredArray)
        setColumns(filteredArray)

        return () => {
            console.log("Prompt unmounted")
            setValidationErrors({})
        }
    }, [columns])

    const handleSave = async ({ values, table }) => {
        console.log("Form data", formData)

        const newValidationErrors = validateRecord(formData);
        console.log("Error", newValidationErrors)
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await saveRecord(formData);
        
        table.setCreatingRow(null); //exit creating mode
        table.setEditingRow(null); //exit editing mode
        setForm({})
    }

    const form = ({ table, row, internalEditComponents }) => {
        return (
            <Form
                columns={sortedColumns}
                tableName={tableName}
                action={actions[action]}
                table={table}
                row={row}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                setForm={setForm}
            />
        )
    }

    return [form, handleSave]
}