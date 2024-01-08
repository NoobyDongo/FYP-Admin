'use client'
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import useRecordValidation from '@/utils/hooks/useRecordValidation';
import FormEditField from "@/components/Table/TableColumnEditField";
import ProgressButton from "@/components/Progress/ProgressButton";
import useProgress from "@/utils/hooks/useProgress/useProgress";
import listenToUpload from "@/app/product/listenToUpload";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import useProgressListener from "@/utils/hooks/useProgress/useProgressListener";

const actions = ["Create New", "Edit"]
const gap = 3

export default function Prompt(props) {

    const { columns, name, actioname, onClose, data } = props
    const { saveRecord, ...others } = props

    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setForm] = useState({})
    const [sortedColumns, setColumns] = useState([])
    const validateRecord = useRecordValidation(columns)
    const { startAsync } = useProgress('promptsave')

    const [disabled, setDisabled] = useState(false)
    const { loading } = useProgressListener('promptsave')

    console.log("Prompt rendered")

    const onChange = (fn) => {
        let newForm = fn({ ...formData })
        console.log(newForm)
        setForm(newForm)
    }
    const exitForm = () => {
        if (actioname == 0)
            clearInput()
        else{
            setDisabled(false)
            setForm(data)
        }
        onClose()
    }
    const clearInput = () => {
        setForm({})
        setDisabled(false)
    }

    useEffect(() => {
        if (data)
            setForm({ ...data })
    }, [data])

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

    useEffect(() => {
        console.log("Prompt mounted", columns)
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
        listenToUpload(async (data) => startAsync(() => saveRecord(data)), formData, (res) => {
            console.log("save record result:", res)
            if (!res.error) {
                setDisabled(true)
            }
        })
    }

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
    }

    return (
        <Dialog {...others} onClose={handleClose} fullWidth>
            <DialogTitle variant="h4" sx={{ textTransform: "capitalize" }}>{actions[actioname]} {name || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: gap, overflowX: "hidden" }}
            >
                {
                    sortedColumns.map((col, i) => (
                        <Stack key={i} direction={col.length == 2 ? "row" : "column"} gap={gap}>
                            {
                                col.map((e, ii) => (
                                    <FormEditField key={ii}
                                        disabled={disabled || loading}
                                        col={e}
                                        record={formData}
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
            <DialogActions sx={{ padding: 3, pt: 1, pb: 2 }}>
                {actioname==0 && <Button disabled={loading}
                    variant="outlined"
                    onClick={clearInput}
                    sx={{ mr: gap / 2 }}
                >
                    Clear
                </Button>}
                <Button
                    disabled={loading}
                    color="secondary"
                    variant="outlined"
                    onClick={exitForm}
                    sx={{ ml: gap }}
                >
                    Return
                </Button>
                <Collapse style={{
                    transitionDelay: `${disabled ? 350 : 0}ms`,
                    display: 'flex',
                    justifyContent: "flex-end"
                }}
                    timeout={disabled ? 700 : 200}
                    orientation="horizontal"
                    in={!disabled}
                    unmountOnExit mountOnEnter>
                    <Box sx={{ pl: gap, width: 1 }}>
                        <ProgressButton sx={{ width: 1 }} variant="contained"
                            disabled={disabled || loading}
                            id={'promptsave'}
                            onClick={handleSave}>
                            Save
                        </ProgressButton>
                    </Box>
                </Collapse>
            </DialogActions>
        </Dialog>
    )
}