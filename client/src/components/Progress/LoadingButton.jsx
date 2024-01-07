//by bcomenet
//https://github.com/mui/material-ui/issues/34415#issuecomment-1256165403
import * as React from 'react'
import Tooltip from '@mui/material/Tooltip';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';

export const LoadingButton = React.forwardRef(
	function LoadingButton({ children, loading, ...others }, ref) {
		return (
			<MuiButton
				ref={ref}
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
		);
	},
);

export default React.forwardRef(
	function Button(props, ref) {

		const {
			title,
			...others
		} = props

		return (
			<Tooltip title={title}>
				<LoadingButton ref={ref} aria-label={title} {...others} />
			</Tooltip>
		)
	}
)