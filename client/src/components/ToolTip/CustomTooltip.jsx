import Tooltip from '@mui/material/Tooltip';
import Fade from "@mui/material/Fade";
import React from 'react';

const CustomTooltip = React.forwardRef(({ children, ...props }, ref)=> {

    return (
        <Tooltip ref={ref} TransitionComponent={Fade} {...props}>
            {children}
        </Tooltip>
    );
})
CustomTooltip.displayName = 'CustomTooltip'
export default CustomTooltip
