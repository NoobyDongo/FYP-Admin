'use client';
import { forwardRef } from 'react';
import TextField from '@mui/material/TextField';

//https://stackoverflow.com/a/55036265, thx to Ryan Cogswell
const InputComponent = forwardRef((props, ref) => <div ref={ref} {...props} />);
InputComponent.displayName = "InputComponent";
const OutlinedDiv = ({ children, label, boxSx, sx, ...others }) => {
    return (
        <TextField
            sx={boxSx}
            variant="outlined"
            label={label}
            multiline
            InputLabelProps={{ shrink: true }}
            InputProps={{
                sx: (theme) => ({
                    cursor: "default",
                    ...sx(theme),
                }),
                inputComponent: InputComponent
            }}
            inputProps={{ children: children }}
            {...others} />
    );
};
export default OutlinedDiv;
