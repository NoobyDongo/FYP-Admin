'use client'
import MiniDrawer from "@/components/sidebar"
import Themed from "@/components/theme";
import Container from '@mui/material/Container';
import FadeWrapper from '@/components/wrapper'
import { useEffect, useState } from "react";
import LoginForm from "@/components/login";

export default function Wrapper({ children, token }) {

    useEffect(() => {
        console.log(token)
    })

    const [darkmode, setDarkmode] = useState(true)
    const toggleDarkMode = (e) => {
        setDarkmode(!darkmode)
    }
    return (
        <Themed darkmode={darkmode}>
            {token && <MiniDrawer toggleDarkMode={toggleDarkMode} />}
            <MiniDrawer toggleDarkMode={toggleDarkMode} />

            <Container maxWidth="xl">
                <FadeWrapper>
                    {children}
                </FadeWrapper>
            </Container>
        </Themed>
    )
}
//{token && children}{!token && <LoginForm/>}