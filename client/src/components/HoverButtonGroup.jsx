'use client'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import tableConfig from './Table/utils/tableConfig.js'
import withStyle from '@/utils/styles/withStyle'
import Fade from '@mui/material/Fade';

const widthTransition = 150

const CustomMenu = withStyle({
    component: Box,
    props: { shouldForwardProp: (prop) => prop !== 'floating' },
    fn: ({ theme, floating }) => ({
        zIndex: 10,
        pointerEvents: 'auto',
        transitionProperty: "transform, width, top, left",
        transitionDuration: "200ms",
        px: 0.25,
        py: 0.25,
        backdropFilter: "blur(3px) saturate(200%)",

        ...(floating ? {
            position: "absolute",
            bottom: tableConfig.iconPadding * .75,
            right: tableConfig.iconPadding,
        } : {
        }),

        flex: 1,
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'flex-end',

        borderRadius: 30,
        border: 'solid',
        borderWidth: 1,
        borderColor: theme.palette.input.border.main,

        '& .MuiIconButton-root': {
            height: tableConfig.iconButtonSize,
            width: tableConfig.iconButtonSize,
        },
    })
})
const MenuContentOutterWrapperStyle = {
    flex: 1,
    display: "flex",
    width: 'fit-content',
    justifyContent: "space-between"
}
const MenuContentInnerWrapperStyle = floating => ({
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    height: "fit-content",
    width: 'fit-content',
})
const WrapperStyle = (width, fullWidth, expand) => ({
    position: "absolute",
    height: '100%',
    width: width,
    top: 0,
    right: 0,
    zIndex: 10,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    paddingInline: tableConfig.iconPadding,
    ...(fullWidth && {
        transitionProperty: "width",
        transitionDuration: `${widthTransition}ms`,
        transitionDelay: `${expand ? 0 : widthTransition * 2}ms`,
        transitionTimingFunction: expand ? "ease-out" : 'ease-in',
    })
})

export default function HoverButtonGroup({ in: appear = true, floating, disabled, expanded, locked, children, fullWidth, autoReset = true }) {
    const [expand, setExpand] = React.useState(expanded)
    const [lock, setLocked] = React.useState(locked)
    const wrapperRef = React.useRef()
    const wrapperFullWidth = React.useRef()
    const wrapperHalfWidth = React.useRef()

    React.useEffect(() => {
        setExpand(expanded)
    }, [expanded])

    React.useEffect(() => {
        if (locked || autoReset)
            setLocked(locked)
    }, [locked])

    React.useEffect(() => {
        if (floating)
            return

        wrapperHalfWidth.current = `${tableConfig.iconButtonSize + (tableConfig.iconPadding + 1) * 2}px`
        wrapperFullWidth.current = wrapperRef.current.parentElement.clientWidth
    }, [])

    const handleMouseEnter = () => {
        if (disabled || expand || lock)
            return
        setExpand(true)
    }
    const handleMouseLeave = () => {
        if (disabled || !expand && !lock)
            return
        setExpand(false)
    }

    const extend = expand || lock

    const iconButton = React.useMemo(() => (
        <IconButton size='small'
            onClick={() => { setLocked(!lock) }}
            disabled={disabled}
            sx={{
                transition: "200ms transform ease",
                transform: `rotate(${lock ? 45 : 0}deg)`
            }}
        >
            <MoreVertIcon />
        </IconButton>
    ), [lock, disabled])

    const menu = (
        <Fade in={appear} mountOnEnter unmountOnExit appear={false}>
            <CustomMenu floating={floating}>
                <div style={MenuContentOutterWrapperStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={MenuContentInnerWrapperStyle(floating || !fullWidth)}>
                        {(floating || !fullWidth ? children : [...children].reverse()).map((child, index) => {
                            let multiplier = Math.min(children.length * .3, 2)
                            let transitionDelay = (expand ? index * 15 : (children.length - index) * 25) / multiplier + expand ? fullWidth ? widthTransition * .75 : 0 : 0
                            let transitionDuration = Math.min(200 + transitionDelay, 1000)

                            return (
                                <Collapse key={index} orientation='horizontal' style={{ transitionDelay: `${transitionDelay}ms` }} in={extend} timeout={transitionDuration} unmountOnExit mountOnEnter>
                                    <div style={{ paddingRight: tableConfig.iconGap }}>
                                        {child}
                                    </div>
                                </Collapse>
                            )
                        })}
                    </div>
                    {iconButton}
                </div>
            </CustomMenu>
        </Fade>
    )

    return floating ? menu : (
        <div ref={wrapperRef} style={
            WrapperStyle(fullWidth ?
                extend ? wrapperFullWidth.current : wrapperHalfWidth.current : 'auto', fullWidth, extend)
        }>
            {menu}
        </div>

    )
}
