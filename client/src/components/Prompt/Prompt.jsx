'use client'
import React from "react";
import Button from '@mui/material/Button';
import ProgressButton from "@/components/Progress/ProgressButton";
import useProgress from "@/components/Progress/useProgress/useProgress";
import listenToUpload from "@/utils/listenToUpload";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import useProgressListener from "@/components/Progress/useProgress/useProgressListener";
import CustomDialog from "../Dialog/CustomDialog";
import customDialogConfig from "../Dialog/customDialogConfig";
import useForm from "../Form/useForm";
import settings from "@/app/admin/settings";

const actions = ["Create New Record", "Edit Record"]

export default function Prompt(props) {
    const { inputs, action, onClose, data, useUpload, saveRecord, title, context, ...others } = props

    const [disabled, setDisabled] = React.useState(false)
    const { startAsync } = useProgress('promptsave')
    const { loading } = useProgressListener('promptsave')
    const [completed, setCompleted] = React.useState(false)
    const { setFormData, validate, form } = useForm({ data, inputs, mode: action, disabled: disabled || loading })

    const [autoBlock, setAutoBlocks] = React.useState(true)
    const [autoClose, setAutoClose] = React.useState(false)

    React.useEffect(() => {
        setAutoBlocks(localStorage.getItem(
            action == 0 ? settings.autoDisableCreateRecord : settings.autoDisableEditRecord
        ) !== 'false')
        setAutoClose(localStorage.getItem(
            action == 0 ? settings.autoCloseCreatePrompt : settings.autoCloseEditPrompt
        ) === 'true')
    }, [])

    const clearForm = (fromData) => {
        setDisabled(false)
        setCompleted(false)
        setFormData(fromData)
    }
    const exitForm = () => {
        onClose()
    }
    const clearInput = () => {
        clearForm({})
    }

    React.useEffect(() => {
        if (others.open) {
            if (action == 0)
                clearForm({})
            else {
                clearForm({ ...data })
            }
        }
    }, [others?.open])

    const handleAfterSave = () => {
        if (autoClose)
            onClose()
        if (autoBlock) {
            setDisabled(true)
            setCompleted(true)
        }
    }

    //const { startAsync : startAsync2 } = useProgress(1)
    const handleSave = async () => {
        /*
        await startAsync(async () => {
            await startAsync2(async () => {
                await sleep(1000)
                setDisabled(true)
                setCompleted(true)
            })
        })
        */
        //setDisabled(true)
        //return

        validate(async (formData) => {
            if (useUpload)
                listenToUpload(async (data) => startAsync(async () => await saveRecord(data)), formData, (res) => {
                    if (res && !res.error) {
                        handleAfterSave()
                    }
                })
            else {
                let res = await startAsync(async () => await saveRecord(formData))
                if (res && !res.error) {
                    handleAfterSave()
                }
            }
        })

    }

    const handleClose = React.useCallback((event, reason) => {
        onClose()
    }, [onClose])

    return (
        <CustomDialog {...others} handleClose={handleClose}
            header={title || actions[action]}
            content={form}
            context={context}
            actions={
                <>
                    {false && <Button onClick={() => setDisabled(!disabled)}>Disable</Button>}
                    {action == 0 && <Button disabled={loading}
                        variant="outlined"
                        onClick={clearInput}
                        sx={{ mr: customDialogConfig.gap / 2 }}
                    >
                        Clear
                    </Button>}
                    <Button
                        disabled={loading}
                        color="secondary"
                        variant="outlined"
                        onClick={exitForm}
                    >
                        Return
                    </Button>
                    <Collapse style={{
                        transitionDelay: `${disabled ? 350 : 0}ms`,
                        display: 'flex',
                        justifyContent: "flex-end",
                        margin: '0 !important',
                    }}
                        timeout={disabled ? 600 : 200}
                        orientation="horizontal"
                        in={!disabled}
                        unmountOnExit
                        mountOnEnter
                    >
                        <Box sx={{ pl: customDialogConfig.gap * .75 }}>
                            <ProgressButton variant="contained"
                                disabled={disabled || loading}
                                id={'promptsave'}
                                completed={completed}
                                onClick={handleSave}>
                                Save
                            </ProgressButton>
                        </Box>
                    </Collapse>
                </>
            }
        />
    )
}