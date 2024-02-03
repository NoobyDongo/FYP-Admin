'use client';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter } from "next/navigation";
import NavOption from '../NavOption';
import DrawerHeader from './CustomDrawerHeader';
import MuiDrawer from "@mui/material/Drawer";
import styled from "@mui/material/styles/styled";
import { openedMixin, closedMixin } from '../mixin';
import React from 'react';

export default function CustomDrawer(props) {
    const { open, toggleDarkMode, optionLists } = props;

    const theme = useTheme();

    const header = React.useMemo(() =>
        <DrawerHeader
            open={open}
            sx={{
                display: "flex",
                flexDirection: open ? "row" : "column",
                columnGap: 1.5,
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
            }}>
            <Typography sx={(theme) => ({
                color: theme.palette.logo.secondary,
                fontWeight: 1000,
                fontSize: open ? 30 : 20,
                textAlign: "center"
            })}>
                V#</Typography>
            <Typography sx={(theme) => ({
                color: theme.palette.logo.main,
                fontWeight: 1000,
                fontSize: open ? 20 : 10,
                textTransform: open ? "uppercase" : "capitalize",
                textAlign: "center"
            })}>
                We Shop</Typography>
        </DrawerHeader>, [open])

    const options = React.useMemo(() => optionLists.map((e, i) => (
        <div key={i}>
            <List>
                {e.map((ee, ii) => {
                    return (
                        <NavOption key={ii} open={open} e={ee} />
                    );
                })}
            </List>
            {i !== optionLists.length - 1 && <Divider sx={{ mx: 2 }} />}
        </div>
    )), [open])

    return (
        <Drawer variant="permanent" open={open} PaperProps={{
            elevation: 5,
        }}>
            {header}

            {options}

            <Divider sx={{ mt: "auto", mx: 2 }} />

            <NavOption open={open} e={{
                name: theme.palette.mode == 'dark' ? "To Light Mode" : "To Dark Mode",
                func: toggleDarkMode,
                icon: theme.palette.mode == 'dark' ? <DarkModeIcon /> : <LightModeIcon />
            }} sx={{ my: 0.5 }} />
        </Drawer>
    );
}
export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 0,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                borderWidth: 0,
                ...openedMixin(theme)
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                borderWidth: 0,
                ...closedMixin(theme)
            }
        }),
    })
);

