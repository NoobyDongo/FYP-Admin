import Box from '@mui/material/Box';

export default function TableContainer({ children, sx }) {

    return (
        <Box className="tableContainer" sx={{ maxWidth: "100%", ...sx }}>
            {children}
        </Box>
    )
}