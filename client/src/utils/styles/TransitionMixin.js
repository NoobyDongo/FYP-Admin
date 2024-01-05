import { styled, useTheme } from '@mui/material/styles';

export const stateTransitionMixin = ({ component, transition, delay, onOpen, onClose, extra }) =>
    styled(component, { shouldForwardProp: (prop) => prop !== 'state' })(({ theme, state }) => ({
        ...extra?.(theme, state),
        ...openCloseTransitionMixin({theme, open: state, transition, delay, onOpen, onClose})
    }))
export const openCloseTransitionMixin = ({theme, open, transition, delay, onOpen, onClose}) => ({
    ...(!open && {
        ...closedTransitionMixin(theme, transition, delay),
        ...onClose
    }),
    ...(open && {
        ...openedTransitionMixin(theme, transition, delay),
        ...onOpen
    }),
})
export const openedTransitionMixin = (theme, thing, delay) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        delay: `${delay || 0}ms`,
    }),
});
export const closedTransitionMixin = (theme, thing, delay) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        delay: `${delay || 0}ms`,
    }),
});