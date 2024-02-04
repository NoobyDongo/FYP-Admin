'use client'
import { usePathname, useRouter } from "next/navigation"
import ListItem from '@mui/material/ListItem'
import React from 'react'
import openCloseTransitionMixin from "@/utils/styles/openCloseTransitionMixin"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import styled from "@mui/material/styles/styled"
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box';
import LayersIcon from '@mui/icons-material/Layers';
import CustomHtmlTooltip from "../ToolTip/CustomHtmlTooltip"
import { useLocation } from "./LocationContext"

const iconSize = 25


export default function NavOption(props) {
    const { e, open, sx, buttonProps, iconProps, textProps, parent, func, ...others } = props
    const { icon, func: efunc, name, displayname: names, validator } = e
    const { nav, title } = names || {}
    const { sx: iconSx, ...otherIconProps } = iconProps || {}
    const { sx: buttonSx, ...otherButtonProps } = buttonProps || {}
    const { sx: textSx, ...otherTextProps } = textProps || {}
    const { color: textColor, ...othertextSx } = textSx || {}
    const [active, setActive] = React.useState(false)
    const [parentActive, setParentActive] = React.useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const displayName = nav || name
    const { changeLocation } = useLocation();
    //const {start} = useProgress(1)

    //let active = path + window.location.hash === link || pathname === base || (landing && !searchString && pathname === parent.base)
    //let parentActive = pathname === parent?.base

    const onClick = () => {
        //start()
        efunc?.(window, router)
        func?.(e)
    }

    React.useEffect(() => {
        if (!active && validator?.(window)) {
            setActive(true)
            if (!parent){
                changeLocation({ text: title })
            }
        }
        else
            if (active && !validator?.(window))
                setActive(false)
        if (parent)
            setParentActive(parent?.validator?.(window))

    }, [pathname])

    const borderWidth = 2
    const height = 48 || buttonSx?.height

    return (
        <ListItem disablePadding sx={{ display: 'block', px: 1, ...sx }} {...others}>
            <CustomHtmlTooltip title={open ? null :
                <>
                    <Box sx={{
                        padding: 1,
                        px: 1.5,
                        border: 1,
                        borderColor: 'input.border.main',
                        borderRadius: 1,
                        userSelect: "none",
                    }}>
                        {displayName}
                    </Box>
                </>
            } placement="right">

                <CustomListItemButton
                    sx={theme => ({
                        minHeight: height,
                        height: height,
                        px: 1.5,
                        borderRadius: 2,
                        boxShadow: active ? theme.palette.mode === 'dark'? "none" : theme.shadows[2] : "none",
                        backgroundColor: active ?
                            theme.palette.navbar.backgroundColor.primary :
                            theme.palette.navbar.backgroundColor.secondary,
                        color: (active ?
                            theme.palette.navbar.text.color.primary :
                            textColor || theme.palette.navbar.text.color.secondary),
                        ...buttonSx
                    })}
                    {...otherButtonProps}
                    onClick={onClick}
                >
                    {parent &&
                        <>
                            <CustomListItemIcon open={open} active={active || parentActive} sx={{
                                width: 50,
                                display: "flex",
                                gap: 1.2,
                                justifyContent: "initial",
                                alignItems: "center",
                                color: 'inherit',
                                ...iconSx
                            }} {...otherIconProps}>
                                <Box sx={{
                                    flexShrink: 0,
                                    width: iconSize,
                                    display: "flex",
                                    height: height - 15,
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    color: parentActive ? 'inherit' : 'text.disabled',
                                }}>
                                    <Box sx={{
                                        width: borderWidth,
                                        height: e === parent.content[parent.content.length - 1] ? `calc(50% + ${borderWidth}px)` : '100%',
                                        backgroundColor: "currentColor",
                                    }} />
                                    <Box sx={{
                                        position: "absolute",
                                        top: "50%",
                                        right: 0,
                                        height: borderWidth,
                                        width: `calc(50% - ${borderWidth}px / 2)`,
                                        backgroundColor: "currentColor",
                                    }} />
                                </Box>
                                <LayersIcon sx={{
                                    fontSize: 20,
                                    color: active ? 'inherit' : 'text.disabled',
                                }} />
                            </CustomListItemIcon>
                        </>
                    }
                    {!parent &&
                        <CustomListItemIcon open={open} active={active} sx={{ color: 'inherit', ...iconSx }} {...otherIconProps}>
                            {icon}
                        </CustomListItemIcon>
                    }
                    <CustomStack direction="column" open={open}>
                        <CustomListItemText
                            primaryTypographyProps={{
                                fontSize: 13.5,
                                ...othertextSx,
                                sx: theme => ({
                                    fontWeight: active ?
                                        theme.palette.navbar.text.fontWeight.primary :
                                        theme.palette.navbar.text.fontWeight.secondary,
                                    ...othertextSx?.sx
                                })
                            }}
                            primary={displayName}
                            {...otherTextProps}
                        />
                        {parent && <CustomListItemText
                            primaryTypographyProps={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: 'text.disabled',
                            }}
                            primary={parent.displayname.nav}
                            {...otherTextProps}
                        />}

                    </CustomStack>
                </CustomListItemButton>
            </CustomHtmlTooltip>
        </ListItem>
    )
}
export const CustomStack = styled(Stack, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flex: 1,
    width: 0,
    minWidth: 0,
    marginLeft: open ? 0 : theme.spacing(3),
    marginRight: theme.spacing(-3),
    justifyContent: 'center',
    ...openCloseTransitionMixin({ theme, open, transition: "margin" })
}))
export const CustomListItemIcon = styled(ListItemIcon, { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'active' })(({ theme, open, active }) => ({
    minWidth: 0,
    width: iconSize,
    justifyContent: 'center',
    marginRight: open ? theme.spacing(1) : 0,
    color: active ? theme.palette.logo.main : "",
    ...openCloseTransitionMixin({ theme, open, transition: "margin" })
}))
export const CustomListItemText = styled(ListItemText, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    textTransform: "capitalize",
    margin: 0,
    ...openCloseTransitionMixin({ theme, open, transition: "margin" })
}))
export const CustomListItemButton = styled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    justifyContent: open ? 'initial' : 'center',
    ...openCloseTransitionMixin({ theme, open, transition: "padding" })
}))

