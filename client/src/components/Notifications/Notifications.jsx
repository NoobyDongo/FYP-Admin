'use client'
//https://github.com/iamhosseindhv/notistack
//amazing, helped me to save a lot of time
import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@mui/material/Button';

function MyApp() {
    const { enqueueSnackbar } = useSnackbar();
    const { closeSnackbar } = useSnackbar();

    const action = key => {
        return (
            <>
                <Button
                    onClick={() => closeSnackbar(key)}
                    style={{
                        height: '100%',
                        left: 0,
                        position: 'absolute',
                        top: 0,
                        width: '100%'
                    }}
                />
            </>
        )
    };

    React.useEffect(() => {
        const handleNewNotification = (e) => {
            // variant could be success, error, warning, info, or default
            enqueueSnackbar(e.detail.message || "", {
                variant: e.detail.variant || "default",
                autoHideDuration: e.detail.duration ?? 5000,
                key: e.detail.message,
                preventDuplicate: true,
                action: action,
            });
        };
        window.addEventListener("newNotification", handleNewNotification)
        return () => {
            window.removeEventListener("newNotification", handleNewNotification)
        }
    }, [])
}

export default function Notifications() {

    return (
        <SnackbarProvider
            maxSnack={3}
            classes={{
               variantSuccess: "alert success",
               variantError: "alert error",
               variantInfo: "alert info",
               variantWarning: "alert warning",
               containerAnchorOriginTopRight: "z-alert"
            }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
            <MyApp />
        </SnackbarProvider>
    );
}