'use client'
import { useState, useEffect, useCallback } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
} from '@mui/material';
import { MRT_EditActionButtons } from 'material-react-table';
import useRecordValidation from '@/hooks/useRecordValidation';
import FormEditField from "@/components/Table/TableColumnEditField";
import { ProgressButton, useProgress } from "../../hooks/useProgress";

const actions = ["Create New", "Edit"]

const delay = ms => new Promise(res => setTimeout(res, ms));

export default function Prompt(props) {

    const { columns, name, title, setOpen, data } = props
    const { saveRecord, ...others } = props

    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setForm] = useState({})
    const [images, setImages] = useState([])
    const [sortedColumns, setColumns] = useState([])
    const validateRecord = useRecordValidation(columns)
    const { startAsync } = useProgress(2)

    console.log("Prompt rendered")

    const onChange = (fn) => {

        if (fn) {
            let newForm = fn({ ...formData })
            console.log(newForm)
            setForm(newForm)
        }
    }

    useEffect(() => {
        if (data)
            setForm({ ...data })
    }, [data])

    useEffect(() => {
        console.log("Prompt mounted", columns)

        const sortColumn = () => {
            const list = [];
            const filteredArray = [];

            columns.forEach((col, index) => {
                if (!col.input)
                    return;

                const i = col.input;
                const group = i.group || 0;

                if (!list[group])
                    list[group] = [];

                const place = i.order || index;

                let targetList = list[group];
                let currentIndex = place;

                while (targetList[currentIndex]) {
                    currentIndex++
                }

                if (i.type == "image")
                    images.push({ accessorFn: i.a })

                targetList[currentIndex] = col;
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
        }
        sortColumn()

        return () => {
            console.log("Prompt unmounted")
            setValidationErrors({})
        }
    }, [columns])

    const handleSave = async () => {
        
        console.log("Form data", formData)

        const newValidationErrors = validateRecord(formData);
        console.log("Error", newValidationErrors)
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({})
        await startAsync(() => saveRecord(formData))

        setForm({})
    }

    return (
        <Dialog {...others} fullWidth>
            <DialogTitle variant="h4" sx={{ textTransform: "capitalize" }}>{actions[title]} {name || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {
                    sortedColumns.map((col, i) => (
                        <Stack key={i} direction={col.length == 2 ? "row" : "column"} gap={'1rem'}>
                            {
                                col.map((e, ii) => (
                                    <FormEditField key={ii}
                                        col={e}
                                        value={e.accessorFn?.(formData)}
                                        onComplete={onChange}
                                        validationErrors={validationErrors}
                                        setValidationErrors={setValidationErrors} />
                                ))
                            }
                        </Stack>
                    ))
                }
            </DialogContent>
            <DialogActions sx={{ padding: 3, pt: 1, pb: 2, gap:2 }}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <ProgressButton variant="contained" id={2} onClick={handleSave}>Save</ProgressButton>
            </DialogActions>
        </Dialog>
    )
}