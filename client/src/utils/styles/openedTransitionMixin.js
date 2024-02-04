export default (theme, thing, delay) => ({
    transition: theme.transitions.create(thing, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        delay: `${delay || 0}ms`,
    }),
});