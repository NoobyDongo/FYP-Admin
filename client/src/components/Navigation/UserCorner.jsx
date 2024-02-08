'use client';
import MuiDrawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import axios from 'axios';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Stack from '@mui/material/Stack';
import NavOption from './NavOption';
import useWsConnection from './useWsConnection';
import { toolSize } from './appbar/customAppbarConfig';
import CustomTooltip from '../ToolTip/CustomTooltip';
import link from '@/app/admin/link';

export default function UserCorner(props) {

    const username = "admin";
    const size = toolSize - 5
    const textAlignment = "left";

    const router = useRouter();
    const signout = async () => {
        await axios.get('/api/logout');
        router.push(link.signin); // redirect the user to the sign-in page
    };

    const [open, setOpen] = useState(false);

    const connected = useWsConnection();

    return (
        <>
            <CustomTooltip title="open user menu">
                <IconButton
                    aria-label="sign out"
                    edge="start"
                    sx={{
                        borderColor: "input.border.main",
                        height: size,
                        width: size,
                        display: "flex",
                        alignItems: "center",
                        justifyItems: "center",
                        outline: 2,
                        outlineColor: connected? "primary.main" : "error.main",
                    }}
                    onClick={() => setOpen(true)}
                >
                    <AccountCircleIcon sx={{ height: size, width: size }} />
                </IconButton>
            </CustomTooltip>
            <MuiDrawer open={open} anchor='right' onClose={() => setOpen(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setOpen(false)}
                    onKeyDown={() => setOpen(false)}
                >
                    <Stack direction="row" alignItems='center' justifyContent='flex-start' gap={1}
                        sx={{
                            px: 4,
                            py: .5,
                            pt: 1.5,
                        }}
                    >
                        <IconButton
                            aria-label="sign out"
                            edge="start"
                            sx={{
                                border: 1,
                                borderColor: "input.border.main",
                                height: size,
                                width: size,
                                display: "flex",
                                alignItems: "center",
                                justifyItems: "center",
                            }}
                            onClick={() => setOpen(true)}
                        >
                            <AccountCircleIcon sx={{ height: size, width: size }} />
                        </IconButton>
                        <Stack direction='column'>
                            <Typography
                                textTransform="capitalize"
                                textAlign={textAlignment}
                                variant='body2'
                                sx={{
                                    userSelect: "none"
                                }}
                            >
                                {username}
                            </Typography>
                            <CustomTooltip title={`User ${connected ? 'is connected' : 'not connected'} to server`}>
                                <Typography
                                    variant='caption'
                                    fontSize={10}
                                    fontWeight={600}
                                    textTransform="uppercase"
                                    textAlign={textAlignment}
                                    color={connected ? "primary" : "error"}
                                    sx={{
                                        cursor: "help",
                                        userSelect: "none"
                                    }}
                                >
                                    {connected ? "Connected" : "Disconnected"}
                                </Typography>
                            </CustomTooltip>
                        </Stack>
                    </Stack>

                    <List sx={{
                        px: 1,
                    }}>
                        <NavOption open={true} e={{
                            name: "Sign out",
                            func: signout,
                            icon: <LogoutRoundedIcon />
                        }} buttonProps={{
                            sx: {
                                gap: 1
                            }
                        }} />
                    </List>
                </Box>
            </MuiDrawer>
        </>


    );
}
