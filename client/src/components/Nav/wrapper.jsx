'use client'
import Themed from "@/components/theme";
import FadeWrapper from '@/components/FadeWrapper'

import * as React from 'react';
import useDarkMode from "@/hooks/useDarkmode";
import { Body, CustomDrawer, DrawerHeader, CustomAppbar } from "./CustomAppbar";


import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import { Box } from "@mui/material";

export default function Wrapper({ children, token }) {

    const [open, setOpen] = React.useState(false);
    const onDrawerOpen = () => {
        setOpen(true);
    };
    const onDrawerClose = () => {
        setOpen(false);
    };
    const { darkmode, toggleDarkMode } = useDarkMode()

    console.log(CustomAppbar)

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

    return (
        <Themed darkmode={darkmode}>

            <CustomAppbar open={open} onOpen={onDrawerClose} onClose={onDrawerOpen}/>
            <CustomDrawer optionLists={optionLists} toggleDarkMode={toggleDarkMode} open={open} />

            <Body open={open} className="test-body">
                <DrawerHeader />
                <Box id="pageContainer" sx={{ px: 4, }}>
                    <FadeWrapper>
                        {children}
                    </FadeWrapper>
                </Box>
            </Body>
        </Themed>
    )
}