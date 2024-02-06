import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Box from "@mui/material/Box"
import customDialogConfig from './customDialogConfig'
import DialogContentText from '@mui/material/DialogContentText'
import React from 'react'
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Stack from '@mui/material/Stack';
import IconButtonWithTooltip from '../IconButtonWithTooltip'

export default function CustomDialog(props) {
    const {
        actions, content, context, header, menu, handleClose,
        padding = customDialogConfig.padding, gap = customDialogConfig.gap, divider = true,
        PaperProps, ...others
    } = props
    const { sx: paperSx, ...otherPaperProps } = PaperProps || {}

    const [fullScreen, setFullScreen] = React.useState(false)
    const fullScreenOn = React.useCallback(() => {
        setFullScreen(true)
    }, [])
    const fullScreenOff = React.useCallback(() => {
        setFullScreen(false)
    }, [])

    return (
        <Dialog PaperComponent={Box}
            PaperProps={{
                sx: (theme) => ({
                    border: fullScreen? 0 :1,
                    borderColor: theme.palette.divider,
                    borderRadius: fullScreen? 0 : 1,
                    backgroundColor: theme.palette.background.default,
                    minWidth: customDialogConfig.width,
                    maxHeight: '100vh',
                    ...paperSx,
                }),
                ...otherPaperProps
            }}
            {...others} onClose={handleClose} fullWidth fullScreen={fullScreen}>
            <DialogTitle variant="h6" sx={{ textTransform: "capitalize", userSelect: "none", px: padding, ...(menu && { pb: gap / 2 / 2 }) }}>
                <Stack direction='row' alignItems="center">
                    {header}
                    <Stack direction='row' alignItems="center" sx={{ml: 'auto'}}>
                        <IconButtonWithTooltip label={fullScreen ? 'Full Screen Mode Off' : 'Full Screen Mode On'}
                            onClick={fullScreen ? fullScreenOff : fullScreenOn}>
                            {fullScreen && <FullscreenExitIcon />}
                            {!fullScreen && <FullscreenIcon />}
                        </IconButtonWithTooltip>

                    </Stack>
                </Stack>

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
