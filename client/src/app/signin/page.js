'use client'

import { useTheme } from "@emotion/react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, Divider, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import useProgress from "@/components/Progress/useProgress/useProgress"
import ProgressButton from "@/components/Progress/ProgressButton"
import useRecordValidation from "@/utils/hooks/useRecordValidation"
import FormEditField, { toTableColumns } from "@/components/Table/TableColumnEditField";
import useProgressListener from "@/components/Progress/useProgress/useProgressListener"
import { useNotification } from "@/components/Notifications/useNotification"

export default function LoginForm(props) {
    const theme = useTheme()

    const [form, setForm] = useState({})
    const { startAsync } = useProgress("signin")
    const { loading } = useProgressListener('signin')
    const { error: displayError, normal: displayNotes } = useNotification()

    console.log("Form rendered")

    const onChange = (fn) => {
        let newForm = fn({ ...form })
        console.log(newForm)
        setForm(newForm)
    }
    const router = useRouter()

    const signin = async () => {
        if (validateRecord(form)) {
            await startAsync(async () => {
                try {
                    const response = await axios.post('/api/login', form)
                    console.log("Response:", response)
                    return response.data.valid
                } catch (error) {
                    displayError({ error: "Login Request Failed" })
                    // The request failed, you can handle the error here.
                    console.error(error)
                }
            }).then((valid) => {
                if (valid) {
                    displayNotes("Login Successful", "success")
                    
                    setTimeout(() => {
                        let page = localStorage.getItem('lastVisitedPage') || "/"
                        router.push(page)
                    }, 1000)
                } else {
                    displayError({ error: "Invalid Username or Password" })
                }
            })
        }

    }

    const columns = useMemo(() => toTableColumns([
        {
            header: "Username",
            accessorKey: 'username',
            input: {
                type: "text",
                required: true,
                labelShrink: false,
            }
        },
        {
            header: "Password",
            accessorKey: 'password',
            input: {
                type: "text",
                required: true,
                labelShrink: false,
            }
        },
    ]), [])
    const [validationErrors, setValidationErrors, validateRecord] = useRecordValidation(columns)


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            minWidth="100vw"
        >
            <Paper sx={{ minWidth: 400, minHeight: "fit-content" }}>
                <Typography sx={{ padding: 3 }} variant="h5">Sign in</Typography>
                <Divider sx={{ borderColor: theme.palette.background.default }} />

                <Stack gap={3} sx={{ padding: 3, height: 1 }}>
                    <Stack gap={3}>
                        {
                            columns.map((e, i) => (
                                <FormEditField key={i}
                                    disabled={loading}
                                    col={e}
                                    record={form}
                                    value={e.accessorFn?.(form)}
                                    onComplete={onChange}
                                    validationErrors={validationErrors}
                                    setValidationErrors={setValidationErrors} />
                            ))
                        }
                    </Stack>
                    <Stack direction="row" gap={2} sx={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 10,
                    }}>
                        <ProgressButton id="signin" variant="outlined" onClick={signin}>Login</ProgressButton>
                    </Stack>
                </Stack>

            </Paper>
        </Box>
    )
}