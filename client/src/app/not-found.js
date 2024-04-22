'use client'

import Themed from "@/components/Theme/Themed"
import useDarkMode from "@/components/Theme/useDarkMode"
import { Box } from "@mui/material"

export default function NotFound() {

  const { darkMode } = useDarkMode()
  return (
    <Themed darkMode={darkMode}>
      <Box sx={theme => ({
        backgroundColor: theme.palette.background.default,
      })}>
      <h1>404 - Page Not Found</h1>

      </Box>
    </Themed>
  )
}