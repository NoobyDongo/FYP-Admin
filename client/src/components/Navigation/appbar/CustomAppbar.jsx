import styled from '@mui/material/styles/styled'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import openCloseTransitionMixin from "@/utils/styles/openCloseTransitionMixin"
import React from 'react'
import Stack from '@mui/material/Stack'
import UserCorner from '../UserCorner'
import DrawerHeader from '../drawer/CustomDrawerHeader'
import { closedWidthMixin } from '../mixin'
import DynamicText from '../../DynamicText'


const CustomAppbar = React.forwardRef(({ open, onOpen, onClose }, ref) => {

    return (
        <AppBar ref={ref} elevation={0} position="sticky" open={open}>
            <Toolbar style={{ padding: 0, paddingRight: 16 }}>
                <AppBarIcon>
                    <IconButton
                        color="primary"
                        edge="start"
                        sx={{
                            height: 40,
                            width: 40,
                            margin: "auto",
                            stroke: "currentcolor", strokeWidth: 1,
                        }}
                        onClick={open ? onOpen : onClose}
                    >
                        {open ? <MenuIcon /> : <ChevronRightIcon fontSize="large" />}
                    </IconButton>
                </AppBarIcon>

                <Typography variant="h6" color="primary" textTransform="uppercase" fontWeight={600} noWrap component="div">
                    <DynamicText event="changeLocation" />
                </Typography>

                <Stack direction="row" gap={3} sx={{
                    flex: 1,
                    pl: 3,
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}>
                    <UserCorner></UserCorner>
                </Stack>
            </Toolbar>
        </AppBar>
    )
})
CustomAppbar.displayName = "CustomAppbar"
export default CustomAppbar

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })(
    ({ theme, open }) => ({
        paddingTop: theme.spacing(.5),
        zIndex: theme.zIndex.drawer - 1,
        ...(theme.palette.mode == 'dark' && {
            backdropFilter: "blur(50px) saturate(150%) brightness(100%)"
        }),
        ...openCloseTransitionMixin({ theme, open, transition: ['width', 'margin'] })
    })
)
const AppBarIcon = styled('div')(({ theme }) => ({
    color: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: -10,
    ...closedWidthMixin(theme),
}))