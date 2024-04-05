'use client';
import React from 'react';
import TextField from '@mui/material/TextField';

//https://stackoverflow.com/a/55036265, thx to Ryan Cogswell
const InputComponent = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
InputComponent.displayName = "InputComponent";
const OutlinedDiv = ({ children, label, boxSx, sx, active, disabled, error, ...others }) => {
    return (
        <TextField
            sx={(theme) => ({
                ...(!disabled && !error && {
                    '&> .MuiInputBase-root > .MuiOutlinedInput-notchedOutline.Mui-focused, :not(.Mui-error) > .MuiInputBase-root > .MuiOutlinedInput-notchedOutline': {
                        borderWidth: `${active ? 1 : 1}px !important`,
                        borderColor: `${active ? theme.palette.primary.main : theme.palette.input.border.main} !important`,
                    },

                    '&:not(.Mui-error) > .MuiFormLabel-root': {
                        color: `${active ? theme.palette.primary.main : theme.palette.input.label.main} !important`,
                    },
                }),
                ...(typeof boxSx === 'function' ? boxSx(theme) : boxSx)
            })}
            variant="outlined"
            label={label}
            disabled={disabled}
            multiline
            InputLabelProps={{ shrink: true, sx: {zIndex: 10} }}
            InputProps={{
                sx: (theme) => ({
                    padding: 0,
                    position: 'relative',
                    cursor: "default",
                    ...(typeof sx === 'function' ? sx(theme) : sx),
                }),
                inputComponent: InputComponent
            }}
            error={error}
            inputProps={{ children: children }}
            {...others}
        />
    );
};
export default OutlinedDiv;
