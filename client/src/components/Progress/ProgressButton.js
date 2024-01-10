'use client';
import * as React from 'react'
import useProgressListener from "./useProgress/useProgressListener";
import Tooltip from '@mui/material/Tooltip';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';

export default function ProgressButton({ id, children, ...others }) {
    const { loading } = useProgressListener(id);
    return (
        <LoadingButton
            loading={loading}
            {...others}
        >
            <span>{children}</span>
        </LoadingButton>
    );
}

//https://github.com/mui/material-ui/issues/34415#issuecomment-1256165403, thx to bcomenet
const LoadingButton = React.forwardRef((props, ref) => {
    const { title, children, loading, ...others } = props

    return (
        <Tooltip title={title}>
            <MuiButton
                ref={ref}
                aria-label={title}
                disabled={loading}
                {...others}
            >
                <Collapse orientation='horizontal' in={loading} mountOnEnter unmountOnExit>
                    <Fade in={loading} >
                        <div style={{ height: "100%", paddingRight: 8, display: 'flex', alignItems: "center" }}>
                            <CircularProgress
                                color="inherit"
                                size={16}
                            />
                        </div>
                    </Fade>
                </Collapse>
                {children}
            </MuiButton>
        </Tooltip>
    )
})
LoadingButton.displayName = 'LoadingButton'