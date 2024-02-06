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

const actions = ["Create New Record", "Edit Record"]

export default function Prompt(props) {
    const { inputs, action, onClose, data, useUpload, saveRecord, title, context, ...others } = props

    const [disabled, setDisabled] = React.useState(false)
    const { startAsync } = useProgress('promptsave')
    const { loading } = useProgressListener('promptsave')
    const [completed, setCompleted] = React.useState(false)
    const { setFormData, validate, form } = useForm({ data, inputs, mode: action, disabled: disabled || loading })

    console.log("Prompt rendered")

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
            console.log("Form data", formData)
            if (useUpload)
                listenToUpload(async (data) => startAsync(async () => await saveRecord(data)), formData, (res) => {
                    console.log("save record result:", res)
                    if (res && !res.error) {
                        setDisabled(true)
                        setCompleted(true)
                    }
                })
            else {
                let res = await startAsync(async () => await saveRecord(formData))
                console.log("save record result:", res)
                if (res && !res.error) {
                    setDisabled(true)
                    setCompleted(true)
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