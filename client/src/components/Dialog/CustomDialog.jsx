import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Box from "@mui/material/Box"
import customDialogConfig from './customDialogConfig'
import DialogContentText from '@mui/material/DialogContentText'
import React from 'react'

export default function CustomDialog(props) {
    const {
        actions, content, context, header, menu, handleClose,
        padding = customDialogConfig.padding, gap = customDialogConfig.gap, divider = true,
        PaperProps, ...others
    } = props
    const { sx: paperSx, ...otherPaperProps } = PaperProps || {}

    return (
        <Dialog PaperComponent={Box}
            PaperProps={{
                sx: (theme) => ({
                    border: 1,
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.default,
                    width: customDialogConfig.width,
                    minWidth: customDialogConfig.width,
                    maxHeight: customDialogConfig.width * 1.5,
                    ...paperSx,
                }),
                ...otherPaperProps
            }}
            {...others} onClose={handleClose} fullWidth>
            <DialogTitle variant="h6" sx={{ textTransform: "capitalize", userSelect: "none", px: padding, ...(menu && { pb: gap / 2 / 2 }) }}>
                {header}
                {context && <DialogContentText sx={{ fontSize: 12, pt: 1, textTransform: 'none' }}>
                    {context}
                </DialogContentText>}
            </DialogTitle>
            {menu && <Box sx={{ px: gap }}>{menu}</Box>}
            {divider && <Divider sx={{ opacity: .5, mx: gap / 2 }} />}
            <div style={{ overflow: "overlay", scrollbarGutter: 'stable both-edges' }}>
                <DialogContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: gap,
                        overflowX: "hidden",
                        px: padding,
                    }}
                >
                    {content}
                </DialogContent>
            </div>
            <DialogActions sx={{
                padding: padding, pt: 1, pb: 2, height: 60,
                '& > .MuiCollapse-root': {
                    margin: '0px !important',

                }
            }}>
                {actions}
            </DialogActions>
        </Dialog>
    )
}
