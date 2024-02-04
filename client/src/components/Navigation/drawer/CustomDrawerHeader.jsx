import styled from '@mui/material/styles/styled'
import { drawerOpenedWidth } from './customDrawerConfig'
import { closedWidthMixin } from '../mixin'

export default styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // necessary for content to be below app bar
    paddingTop: theme.spacing(1),
    minHeight: 64,
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(!open && {
        ...closedWidthMixin(theme),
    }),
    ...(open && {
        width: drawerOpenedWidth,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
    }),
}))
