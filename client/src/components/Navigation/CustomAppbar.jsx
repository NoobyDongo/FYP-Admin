'use client'

import styled from '@mui/material/styles/styled';
import useTheme from '@mui/material/styles/useTheme';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import { usePathname, useRouter } from "next/navigation";
import { closedTransitionMixin, openCloseTransitionMixin, openedTransitionMixin } from "@/utils/styles/TransitionMixin";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const changeLocationEvent = (e) => new CustomEvent("changeLocation", { detail: e })

export function DynamicText({event}) {
    const [text, setText] = useState("{Placeholder}")
    
    const handleEvent = (e) => {
        setText(e.detail.text)
        console.log('location.change')
    }

    useEffect(() => {
        window.addEventListener(event, handleEvent)
        return () => {
            window.removeEventListener(event, handleEvent)
        }
    }, [event])

    return <>{text}</>
}

export function CustomAppbar({ open, onOpen, onClose }) {

    const router = useRouter()
    const signout = async () => {
        console.log(Cookies)
        await axios.get('/api/logout');
        router.push('/signin'); // redirect the user to the sign-in page
    }

    return (
        <AppBar elevation={0} position="fixed" open={open}>
            <Toolbar style={{ padding: 0, paddingRight: 16 }}>
                <DrawerHeader open={open} />
                <AppBarIcon>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        sx={{
                            height: 40,
                            width: 40,
                            margin: "auto",
                            stroke: "currentcolor", strokeWidth: 1,
                        }}
                        onClick={open ? onOpen : onClose}
                    >
                        {open ? <MenuIcon /> : <ChevronRightIcon fontSize="large" />}
                    </IconButton>
                </AppBarIcon>

                <Typography variant="h6" color="primary" textTransform="uppercase" fontWeight={600} noWrap component="div">
                    <DynamicText event="changeLocation" />
                </Typography>

                <IconButton
                    aria-label="sign out"
                    edge="start"
                    sx={{
                        height: 40,
                        width: 40,
                        marginLeft: "auto",
                        stroke: "currentcolor", strokeWidth: 1,
                    }}
                    onClick={signout}
                >
                    <ChevronRightIcon fontSize="large" />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export const drawerOpenedWidth = 200;
export const drawerClosedWidth = 65;

const openedMixin = (theme) => ({
    ...openedTransitionMixin(theme, "width"),
    width: drawerOpenedWidth,
    overflowX: 'hidden',
});
const closedMixin = (theme) => ({
    ...closedTransitionMixin(theme, "width"),
    overflowX: 'hidden',
    ...closedWidthMixin(theme)
});
const closedWidthMixin = (theme) => ({
    width: drawerClosedWidth,
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
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
    }),
);
export const DrawerHeader = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // necessary for content to be below app bar
    paddingTop: theme.spacing(1),
    minHeight: 64,
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(!open && {
        ...closedWidthMixin(theme),
    }),
    ...(open && {
        width: drawerOpenedWidth,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
    }),
}));
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })(
    ({ theme, open }) => ({
        paddingTop: theme.spacing(.5),
        zIndex: theme.zIndex.drawer - 1,
        ...(theme.palette.mode == 'dark' && {
            backdropFilter: "blur(50px) saturate(150%) brightness(100%)"
        }),
        ...openCloseTransitionMixin({ theme, open, transition: ['width', 'margin'] })
    })
);
const AppBarIcon = styled('div')(({ theme }) => ({
    color: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: -10,
    ...closedWidthMixin(theme),
}));
export const Body = styled(Box, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexShrink: 1,
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    ...openCloseTransitionMixin({
        theme, open, transition: "width", onOpen: {
            paddingLeft: `calc(100% - ${drawerOpenedWidth}px - 100%)`,
            width: `calc(100vw - ${drawerOpenedWidth}px)`
        }, onClose: {
            paddingLeft: `calc(100% - ${drawerClosedWidth}px - 100%)`,
            width: `calc(100vw - ${drawerClosedWidth}px)`
        }
    })
}))
const CustomListItemIcon = styled(ListItemIcon, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    minWidth: 0,
    justifyContent: 'center',
    ...openCloseTransitionMixin({ theme, open, transition: "margin" })
}))
const CustomListItemText = styled(ListItemText, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    textTransform: "capitalize",
    ...openCloseTransitionMixin({ theme, open, transition: "margin" })
}))
const CustomListItemButton = styled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    justifyContent: open ? 'initial' : 'center',
    ...openCloseTransitionMixin({ theme, open, transition: "padding" })
}))


function ListOption(props) {
    const { e, open, ...others } = props
    const pathname = usePathname()
    const theme = useTheme()

    let active = pathname === e.link

    const onClick = () => {
        if(e.link)
            window.dispatchEvent(changeLocationEvent({ text: e.name }))
        e.func?.()
    }

    useEffect(() => {
        if (active)
            window.dispatchEvent(changeLocationEvent({ text: e.name }))
    }, [])

    return (
        <ListItem disablePadding sx={{ display: 'block' }} {...others}>
            <CustomListItemButton
                sx={{
                    minHeight: 48,
                    px: open ? 1.5 : 2.5,
                }}
                onClick={onClick}
            >
                <CustomListItemIcon
                    sx={{
                        mr: open ? 1 : '0',
                        color: active ? theme.palette.logo.main : ""
                    }}
                >
                    {e.icon}
                </CustomListItemIcon>
                <CustomListItemText
                    sx={{
                        ml: open ? '0' : 3,
                        mr: -3,

                    }}
                    primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: pathname == "/" + e.link ? theme.palette.logo.main : theme.palette.text.secondary
                    }}
                    primary={e.name} />
            </CustomListItemButton>
        </ListItem>
    )
}

export function CustomDrawer(props) {
    const { open, toggleDarkMode, optionLists } = props

    const theme = useTheme();
    const Router = useRouter();

    const GoTo = (e) => {
        Router.push(e.link || "")
    }

    return (
        <Drawer variant="permanent" open={open} PaperProps={{
            elevation: 5,
        }}>

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
                <Typography sx={{
                    color: theme.palette.logo.secondary,
                    fontWeight: 1000,
                    fontSize: open ? 30 : 20,
                    textAlign: "center"
                }}>
                    V#</Typography>
                <Typography sx={{
                    color: theme.palette.logo.main,
                    fontWeight: 1000,
                    fontSize: open ? 20 : 10,
                    textTransform: open ? "uppercase" : "capitalize",
                    textAlign: "center"
                }}>
                    We Shop</Typography>
            </DrawerHeader>


            {
                optionLists.map((e, i) => (
                    <div key={i}>
                        <List>
                            {e.map((ee, ii) => {
                                if (!ee.func)
                                    ee.func = () => GoTo(ee)
                                return (
                                    <ListOption key={ii} open={open} e={ee} />
                                )
                            })}
                        </List>
                        {i !== optionLists.length - 1 && <Divider />}
                    </div>
                ))
            }

            <Divider sx={{ marginTop: "auto" }} />

            <ListOption open={open} e={{
                name: theme.palette.mode == 'dark' ? "To Light Mode" : "To Dark Mode",
                func: toggleDarkMode,
                icon: theme.palette.mode == 'dark' ? <DarkModeIcon /> : <LightModeIcon />
            }} />
        </Drawer>
    )
}
