import TextField from '@mui/material/TextField'

export default function DefaultTextField(props) {
    const { input, children, value, disabled, onChange, validationErrors, setValidationErrors, record, ...others } = props;

    const {
        label, name, required = false, type = "text", variant = "outlined", fullWidth = true, multiline, InputProps, labelShrink,
    } = input;

    return (
        <TextField
            label={label}
            name={name}
            required={required}
            type={type}
            variant={variant}
            fullWidth={fullWidth}
            value={value}
            multiline={multiline}
            InputProps={InputProps}
            onChange={onChange}
            //onBlurCapture={onComplete}
            disabled={disabled}

            InputLabelProps={{ shrink: !labelShrink }}

            error={!!validationErrors?.[name]}
            helperText={validationErrors?.[name]}
            onFocus={() => {
                if (validationErrors?.[name])
                    setValidationErrors({
                        ...validationErrors,
                        [name]: undefined,
                    });
            }}
            {...others}
        >
            {children}
        </TextField>
    );
}