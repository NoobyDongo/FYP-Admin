'use client'
import Themed from "@/components/theme";
import Container from '@mui/material/Container';
import FadeWrapper from '@/components/wrapper'
import { useEffect, useState } from "react";
import LoginForm from "@/components/login";

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
import DashboardIcon from '@mui/icons-material/Dashboard';
import BadgeIcon from '@mui/icons-material/Badge';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter } from 'next/navigation';
import { Box, lighten } from "@mui/material";
import { alpha } from '@material-ui/core/styles/colorManipulator';


export default function Wrapper({ children, token }) {


    useEffect(() => {
        // Add listener to update styles
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setDarkmode(e.matches));
      
        // Setup dark/light mode for the first time
        setDarkmode(window.matchMedia('(prefers-color-scheme: dark)').matches)
      
        // Remove listener
        return () => {
          window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => {
          });
        }
      }, []);

    const [darkmode, setDarkmode] = useState(true)
    const toggleDarkMode = (e) => {
        setDarkmode(!darkmode)
    }
    const [open, setOpen] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Themed darkmode={darkmode}>

            <CustomAppbar open={open} whenOpen={handleDrawerOpen} whenClose={handleDrawerClose} />
            <CustomDrawer toggleDarkMode={toggleDarkMode} open={open} />

            <Box sx={{
                flexShrink: 1,
            }}width={`calc(100% - ${open? drawerOpenedWidth : drawerClosedWidth}px)`}>
                <Box sx={{px:4}}>
                    <DrawerHeader />
                    <FadeWrapper>
                        {children}
                    </FadeWrapper>
                </Box>
            </Box>
        </Themed>
    )
}

const drawerOpenedWidth = 220;
const drawerClosedWidth = 65;

const openedMixin = (theme) => ({
    width: drawerOpenedWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    ...closedWidthMixin(theme)
});
const closedWidthMixin = (theme) => ({
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
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
const DrawerHeader = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // necessary for content to be below app bar
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
        zIndex: theme.zIndex.drawer - 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(theme.palette.mode == 'dark' && {
            backdropFilter: "blur(15px) saturate(150%) brightness(90%)",
            background: alpha(lighten(theme.palette.background.default, .1), .4),
        }),
        ...(open && {
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            }),
        }),
    })
);
const AppBarIcon = styled('div')(({ theme }) => ({
    color: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...closedWidthMixin(theme),
}));

function ListOption(props) {
    const { e, open, ...others } = props

    return (
        <ListItem disablePadding sx={{ display: 'block' }} {...others}>
            <ListItemButton
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
                onClick={e.func}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    {e.icon}
                </ListItemIcon>
                <ListItemText sx={{
                    ml: open ? 'auto' : 3,
                    mr: -3,
                    textTransform: "capitalize",
                }}
                    primary={e.name} />
            </ListItemButton>
        </ListItem>
    )
}

function CustomAppbar(props) {
    const { open, whenOpen, whenClose } = props

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar style={{ padding: 0 }}>

                <DrawerHeader open={open} />
                <AppBarIcon>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{
                            margin: "auto",
                        }}
                        onClick={open ? whenClose : whenOpen}
                    >
                        {open ? <MenuIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </AppBarIcon>

                <Typography variant="h6" noWrap component="div">
                    {"{Placeholder}"}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}
function CustomDrawer(props) {
    const { open, toggleDarkMode } = props

    const theme = useTheme();
    const Router = useRouter();


    const GoTo = (e) => {
        Router.push("/" + e)
    }

    const ViewEmployees = (e) => {
        Router.push("/employee")
    }
    const OpenProfile = (e) => {
        Router.push("/profile")
    }
    const GoToDashboard = (e) => {
        Router.push("/")
    }

    const options1 = [
        {
            name: "dashboard",
            func: () => GoTo(""),
            icon: <DashboardIcon />
        },
        {
            name: "account",
            func: () => GoTo(""),
            icon: <ManageAccountsIcon />
        },
    ]
    const options2 = [
        {
            name: "employee",
            func: () => GoTo("employee"),
            icon: <EngineeringIcon />
        },
        {
            name: "product",
            func: () => GoTo("product"),
            icon: <CategoryIcon />
        }
    ]

    var key = 0

    return (
        <Drawer variant="permanent" open={open} PaperProps={{ elevation: 5 }}>
            <List>
                {options1.map((e, index) => (
                    <ListOption key={key++} open={open} e={e} />
                ))}
            </List>
            <Divider />
            <List>
                {options2.map((e, index) => (
                    <ListOption key={key++} open={open} e={e} />
                ))}
            </List>

            <Divider sx={{ marginTop: "auto" }} />

            <ListOption key={key++} open={open} e={{
                name: theme.palette.mode == 'dark' ? "To Light Mode" : "To Dark Mode",
                func: toggleDarkMode,
                icon: theme.palette.mode == 'dark' ? <DarkModeIcon /> : <LightModeIcon />
            }} />
        </Drawer>
    )
}
