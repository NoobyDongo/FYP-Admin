'use client'
//https://github.com/iamhosseindhv/notistack
//amazing, helped me to save a lot of time
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useEffect } from 'react';

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

export function Notifications() {

    return (
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "right", vertical: "top" }}>
            <MyApp />
        </SnackbarProvider>
    );
}

export function useNotification() {
    const makeNew = (message, variant) => {
        window.dispatchEvent(
            new CustomEvent("newNotification", {
                detail: {
                    message, variant
                }
            })
        );
    }
    const makeError = (response) => {
        if (response.error?.status) {
            makeNew(`Status: ${error.error.status}, Error: ${error.error.error}`, "error")
            return true
        }else if(response.error){
            makeNew(`Error: ${response.error}`, "error")
            return true
        }
        return false
    }
    return { normal: makeNew, error: makeError }
}