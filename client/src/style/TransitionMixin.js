import { styled, useTheme } from '@mui/material/styles';

export const stateTransitionMixin = ({ component, transition, onOpen, onClose, extra }) =>
    styled(component, { shouldForwardProp: (prop) => prop !== 'state' })(({ theme, state }) => ({
        ...extra?.(theme, state),
        ...openCloseTransitionMixin(theme, state, transition, onOpen, onClose)
    }))
export const openCloseTransitionMixin = (theme, open, thing, onOpen, onClose) => ({
    ...(!open && {
        ...closedTransitionMixin(theme, thing),
        ...onClose
    }),
    ...(open && {
        ...openedTransitionMixin(theme, thing),
        ...onOpen
    }),
})
export const openedTransitionMixin = (theme, thing) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
});
export const closedTransitionMixin = (theme, thing) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
});