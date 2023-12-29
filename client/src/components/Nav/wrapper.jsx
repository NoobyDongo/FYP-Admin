'use client'
import Themed from "@/components/theme";
import FadeWrapper from '@/components/FadeWrapper'

import * as React from 'react';
import useDarkMode from "@/hooks/useDarkmode";
import { Body, CustomDrawer, DrawerHeader, CustomAppbar } from "./CustomAppbar";

import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import { Box } from "@mui/material";

import ProgressBar from "./ProgressBar";
import { Notifications } from "@/hooks/useNotification";
import useClientLogin from "@/hooks/useClientLogin";


export default function Wrapper({ children }) {
    const [open, setOpen] = React.useState(false)
    const onDrawerOpen = () => setOpen(true)
    const onDrawerClose = () => setOpen(false)
    const { darkmode, toggleDarkMode } = useDarkMode()

    const optionLists = [
        [
            {
                name: "dashboard",
                link: "",
                icon: <DashboardIcon />
            },
            {
                name: "account",
                link: "profile",
                icon: <ManageAccountsIcon />
            },
        ],
        [
            {
                name: "manage products",
                link: "product",
                icon: <CategoryIcon />
            }
        ]
    ]

    const [token, location] = useClientLogin()

    return (
        <Themed darkmode={darkmode}>

            {token && location !== "/signin" && <>
                <Box sx={{ zIndex: 200000, width: 1, height: 10, position: "absolute" }}>
                    <ProgressBar />
                </Box>
                <CustomAppbar open={open} onOpen={onDrawerClose} onClose={onDrawerOpen} />
                <CustomDrawer optionLists={optionLists} toggleDarkMode={toggleDarkMode} open={open} />

                <Notifications />

                <Body open={open} className="test-body">
                    <DrawerHeader />
                    <Box id="pageContainer" sx={{ px: 4, }}>
                        <FadeWrapper>
                            {children}
                        </FadeWrapper>
                    </Box>
                </Body>
            </>}

            {(!token && location === "/signin") &&
                <FadeWrapper>
                    {children}
                </FadeWrapper>}

            {!token && location !== "/signin" &&
                <Box sx={(theme) => ({ backgroundColor: theme.palette.background.default, zIndex: 10000, width: 1, height: 1 })}>

                </Box>
            }
        </Themed>
    )
}