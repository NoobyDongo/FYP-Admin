//by bcomenet
//https://github.com/mui/material-ui/issues/34415#issuecomment-1256165403
import * as React from 'react'
import Tooltip from '@mui/material/Tooltip';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export const LoadingButton = React.forwardRef(
	function LoadingButton({ children, loading, ...others }, ref) {
		return (
			<MuiButton
				ref={ref}
				disabled={loading}
				{...others}
			>
				{loading && (
					<CircularProgress
						color="inherit"
						size={16}
						sx={{mr:1}}
					/>)}
				{children}
			</MuiButton>
		);
	},
);

export default React.forwardRef(
	function Button(props, ref) {
		if (props.loading) {
			return (
				<LoadingButton ref={ref} {...props} />
			)
		}

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