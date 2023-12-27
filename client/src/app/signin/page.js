'use client'

import { useTheme } from "@emotion/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Divider, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useCookies } from 'next-client-cookies';
import { useRouter } from "next/navigation";

export default function LoginForm(props) {
    const theme = useTheme()

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const cookies = useCookies()
    const router = useRouter()
    const signin = async() => {
        cookies.set("token", "value")
        router.push("/")
    }

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


                        <TextField
                            label="Username/Email"
                            variant="outlined"
                            type="text"
                            onChange={(e) => setValue(e)}
                            fullWidth

                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <TextField
                            label="Username/Email"
                            variant="outlined"
                            type="text"
                            onChange={(e) => setValue(e)}
                            fullWidth

                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>

                            }}
                        />

                    </Stack>
                    <Stack direction="row" gap={2}>
                        <Link href="#" underline="hover">Forgot Password?</Link>
                        <Link href="#" underline="hover">New User?</Link>
                    </Stack>
                    <Stack direction="row" gap={2} sx={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginTop: 10,
                    }}>
                        <Button> Cancel</Button>
                        <Button variant="contained" onClick={signin}>Login</Button>
                    </Stack>
                </Stack>

            </Paper>
        </Box>
    )
}