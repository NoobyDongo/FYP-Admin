export default (theme, thing, delay) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        delay: `${delay || 0}ms`,
    }),
});