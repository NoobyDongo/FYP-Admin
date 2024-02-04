'use client';
import React from 'react';
import styled from "@mui/material/styles/styled";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const UnstyledCustomHtmlTooltip = React.forwardRef(({ className, ...props }, ref) => (
    <Tooltip TransitionComponent={Fade} {...props} classes={{ popper: className }} ref={ref} />
))
UnstyledCustomHtmlTooltip.displayName = 'UnstyledCustomHtmlTooltip';

//https://mui.com/material-ui/react-tooltip/#customization
const CustomHtmlTooltip = styled(UnstyledCustomHtmlTooltip)(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 220,
        padding: 0,
        fontSize: theme.typography.pxToRem(12),
        transition: "none",
    },
}));
export default CustomHtmlTooltip
