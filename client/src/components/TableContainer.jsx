'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { TabMenu, TabPanel } from '@/components/tabs';

export default function TableContainer({ children }) {
    const theme = useTheme()

    const [value, setValue] = React.useState(0);
    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    return (
        <Box paddingTop={theme.spacing(2)} sx={{ maxWidth: "100%" }}>
            {children}
        </Box>
    )
}