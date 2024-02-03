import closedTransitionMixin from "./closedTransitionMixin";
import openedTransitionMixin from "./openedTransitionMixin";

export default ({ theme, open, transition, delay, onOpen, onClose }) => ({
    ...(!open && {
        ...closedTransitionMixin(theme, transition, delay),
        ...onClose
    }),
    ...(open && {
        ...openedTransitionMixin(theme, transition, delay),
        ...onOpen
    }),
});