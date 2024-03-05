import IconButton from '@mui/material/IconButton'
import CustomTooltip from './ToolTip/CustomTooltip';

export default function IconButtonWithTooltip({ label, disabled, size, onClick, children, sx, ...other }) {
    const adjustedButtonProps = {
        disabled: disabled,
        onClick: disabled ? undefined : onClick
    }
    return (
        <CustomTooltip title={label}>
            <div style={{
                width: 'fit-content',
                height: 'fit-content',
            }}>
                <IconButton size={size || 'small'} sx={{
                    fontFamily: 'inherit', ...sx
                }} {...other} {...adjustedButtonProps}>
                    {children}
                </IconButton>
            </div>
        </CustomTooltip>
    );
}
