'use client'
import Box from '@mui/material/Box';

export default function TableContainer({ children }) {

    return (
        <Box className="tableContainer" sx={{ py: 2, maxWidth: "100%" }}>
            {children}
        </Box>
    )
}