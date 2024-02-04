import withStyle from "./withStyle";
import openCloseTransitionMixin from "./openCloseTransitionMixin";

export default ({ component, transition, delay, onOpen, onClose, extra }) => withStyle({
    component, props: { shouldForwardProp: (prop) => prop !== 'state' },
    fn: ({ theme, state }) => ({
        ...extra?.(theme, state),
        ...openCloseTransitionMixin({ theme, open: state, transition, delay, onOpen, onClose })
    })
});