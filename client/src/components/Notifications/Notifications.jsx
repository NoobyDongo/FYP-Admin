'use client'
//https://github.com/iamhosseindhv/notistack
//amazing, helped me to save a lot of time
import { useEffect } from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

function MyApp() {
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const handleNewNotification = (e) => {
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(e.detail.message || "", { variant: e.detail.variant || "default" });
        };
        window.addEventListener("newNotification", handleNewNotification)
        return () => {
            window.removeEventListener("newNotification", handleNewNotification)
        }
    }, [])
}

export default function Notifications() {

    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "right", vertical: "top" }}>
            <MyApp />
        </SnackbarProvider>
    );
}