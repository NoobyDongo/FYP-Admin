import styled from '@mui/material/styles/styled';

const withStyle = ({component, props, fn}) => styled(component, props)(props => fn(props))
export default withStyle

/*
export const stateTransitionMixin = ({ component, transition, delay, onOpen, onClose, extra }) =>
    styled(component, props)(({ theme, state }) => ({
        ...extra?.(theme, state),
        ...openCloseTransitionMixin({theme, open: state, transition, delay, onOpen, onClose})
    }))
*/