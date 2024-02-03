'use client';
import * as React from 'react'
import useProgressListener from "./useProgress/useProgressListener";
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CustomTooltip from '../ToolTip/CustomTooltip';

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
    const { title, children, loading, completed, ...others } = props

    return (
        <CustomTooltip title={title}>
            <MuiButton
                ref={ref}
                aria-label={title}
                disabled={loading}
                sx={{
                    width: loading || completed ? 95 : 68,
                    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                }}
                {...others}
            >
                <Collapse orientation='horizontal' in={loading || completed} style={{
                    transitionDelay: `${loading ? 100 : 0}ms`,
                }} timeout={loading ? 300 : 200}
                >
                    <Fade in={loading || completed} >
                        <div style={{ height: "100%", width: 28, display: 'flex', alignItems: "center" }}>
                            {loading && !completed && <CircularProgress
                                color="inherit"
                                size={16}
                            />}
                            {completed && <CheckCircleOutlineOutlinedIcon
                                color="inherit"
                                fontSize='small'
                            />}
                        </div>
                    </Fade>
                </Collapse>
                {children}
            </MuiButton>
        </CustomTooltip>
    )
})
LoadingButton.displayName = 'LoadingButton'