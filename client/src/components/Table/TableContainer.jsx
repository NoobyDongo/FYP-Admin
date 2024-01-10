import Box from '@mui/material/Box';

export default function TableContainer({ children }) {

    return (
        <Box className="tableContainer" sx={{ pb: 1, maxWidth: "100%" }}>
            {children}
        </Box>
    )
}