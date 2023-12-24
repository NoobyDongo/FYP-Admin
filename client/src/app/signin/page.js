'use client'

import { useTheme } from "@emotion/react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Divider, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";


export default function LoginForm(props) {
    const theme = useTheme()

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box 
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Paper sx={{ minWidth: 400, minHeight: 500 }}>
                <Typography sx={{ padding: 3 }} variant="h5">Sign in</Typography>
                <Divider sx={{ borderColor: theme.palette.background.default }} />

                <Stack gap={3} sx={{ padding: 3 }}>
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
                </Stack>

            </Paper>
        </Box>
    )
}