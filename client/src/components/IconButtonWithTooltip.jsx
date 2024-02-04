import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CustomTooltip from './ToolTip/CustomTooltip';

export default function IconButtonWithTooltip({ label, disabled, size, onClick, children, ...other }) {
    const adjustedButtonProps = {
        disabled: disabled,
        onClick: disabled ? undefined : onClick
    }
    return (
        <CustomTooltip title={label}>
            <div>
                <IconButton size={size || 'small'} {...other} {...adjustedButtonProps}>
                    {children}
                </IconButton>
            </div>
        </CustomTooltip>
    );
}
