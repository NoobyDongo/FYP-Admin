'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';

export default function TableContainer({ children }) {
    const theme = useTheme()

    return (
        <Box className="tableContainer" paddingBlock={theme.spacing(2)} sx={{ maxWidth: "100%" }}>
            {children}
        </Box>
    )
}