'use client'
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ImagesUpload from '@/components/Image/ImagesUpload';
import { useEffect, useRef, useState } from 'react';
import NextImage from '../Image/NextImage';
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"

function createAccessorFunction(accessorKey) {
    const keys = accessorKey.split('.');

    return (row) => {
        let value = row;
        for (const key of keys) {
            if (value === undefined) {
                break;
            }
            value = value[key];
        }
        return value;
    };
}
function createInputValueSetter(accessorKey, list) {
    const keys = accessorKey.includes('.') ? accessorKey.split('.') : [accessorKey];

    return (form, value) => {
        const clonedKeys = [...keys];
        const lastKey = clonedKeys.pop();
        const nestedObject = clonedKeys.reduce((acc, key) => {
            if (acc[key] === undefined) {
                acc[key] = {};
            }
            return acc[key];
        }, form);

        nestedObject[lastKey] = value;

        return form;
    };
}

export function toTableColumns(list) {
    list.forEach((e, i) => {
        list[i] = { ...TableColumn(e) }
    })
    console.log("Columns", list)
    return list
}

export function TableColumn(props) {
    const { accessorKey, header: rawHeader, size: rawSize, input, display, ...others } = props

    let accessorFn = createAccessorFunction(accessorKey)
    let inputValueStetter = input ? createInputValueSetter(accessorKey, !input?.simple && input?.optionList) : null
    let header = rawHeader || accessorKey.charAt(0).toUpperCase() + accessorKey.slice(1)
    let size = rawSize || 120 + header.length * 10

    return {
        accessorFn,
        accessorKey,
        header,
        size,
        ...(input && {
            input: {
                ...input,
                type: input.type === "number" ? "tel" : input.type || "text", //no updown arrow this way lol
                valueSetter: inputValueStetter,
            },
            ...((!input.type || input.type === "text") && TableTextCell()),
            ...(input.type && {
                ...(input.type === "image" && TableImageCell({ accessorFn })),
                ...(input.type === "select" && TableSelectCell(input)),
            }),
            ...(display && {
                ...(display.type === "imageText" && TableImageTextCell({ accessorFn: display.accessorFn })),
            })
        }),
        ...others
    }
}

export function TableImageCell(props) {
    const { accessorFn } = props
    return {
        Cell: ({ row }) => {
            return (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <NextImage
                        alt="image"
                        height={30}
                        width={30}
                        src={accessorFn(row.original)}
                        defaultSrc={"/image/avatar.png"}
                        style={{ borderRadius: '50%' }}
                    />
                </Box>
            )
        },
    }
}

export function TableTextCell() {
    return {
        Cell: ({ renderedCellValue }) => {
            return (
                <Box sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }} >
                    <span>{renderedCellValue}</span>
                </Box>
            )
        },
    }
}

export function TableImageTextCell(props) {
    const { accessorFn } = props
    return {
        Cell: ({ renderedCellValue, row }) => {
            return (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }} >
                    <NextImage
                        alt="image"
                        height={30}
                        width={30}
                        src={accessorFn(row.original)}
                        defaultSrc={"/image/avatar.png"}
                        style={{ borderRadius: '50%' }}
                    />
                    <span style={{ whiteSpace: "nowrap" }}>{renderedCellValue}</span>
                </Box>
            )
        },
    }
}

export function TableSelectCell(input) {

    console.log("TableSelectCell", input.optionList)
    let getOption = (id) => input.optionList?.find((e) => (input.optionIdAccessorFn?.(e) || e.id) == id)
    let getOptionvalue = (id) => input.optionValueAccessorFn?.(getOption(id)) || getOption(id).name

    return {
        Cell: ({ cell }) => (
            <Box sx={{ textTransform: "capitalize" }}>
                {getOptionvalue(cell.getValue())}
            </Box>
        ),
    }
}

function DefaultTextField(props) {

    const { label, name, input, children, value, disabled } = props
    const { onChange, onComplete } = props
    const { validationErrors, setValidationErrors } = props
    const {
        required = false,
        type = "text",
        variant = "outlined",
        fullWidth = true,
        multiline,
        InputProps,
        labelShrink,
    } = input

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
            onBlurCapture={onComplete}
            disabled={disabled}

            InputLabelProps={{ shrink: !labelShrink }}

            error={!!validationErrors?.[name]}
            helperText={validationErrors?.[name]}
            onFocus={() => {
                if (validationErrors?.[name])
                    setValidationErrors({
                        ...validationErrors,
                        [name]: undefined,
                    })
            }}
        >
            {children}
        </TextField>
    )
}

function PasswordTextField(props) {

    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseUpPassword = (event) => {
        event.preventDefault()
    }

    return (
        <TextField
            {...props}
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment:
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
            }}
        >
            {children}
        </TextField>
    )
}

export default function TableColumnEditField(props) {
    const { col, validationErrors, setValidationErrors } = props
    const { input, accessorKey: key } = col
    const { record } = props
    const { onComplete: saveToParent, value, disabled } = props
    const inputComponent = useRef(null)

    const [localValue, setValue] = useState()
    useEffect(() => {
        if (!value)
            inputComponent.current?.clear()
        setValue(value)
    }, [value])

    const save = (value) => {
        saveToParent((form) => input.valueSetter(form, value))
    }

    const onComplete = () => {
        console.log("value", localValue, "oldValue", value)
        if (localValue === value) {
            console.log("...no change at all...")
            return null
        }
        save(localValue)
    }

    const onChange = (e) => {
        setValue(e.target.value)
    }


    if (!input)
        return
    if (input.type === "image")
        return (
            <ImagesUpload
                name={col.header}
                onChange={(e) => { onChange({ target: { value: e } }); save(e) }}
                value={value}
                disabled={disabled}
                ref={inputComponent}
                link={input.linkFn?.(record)}
            >

            </ImagesUpload>
        )
    if (input.type === "text" || input.type === "number")
        return (
            <DefaultTextField
                label={col.header}
                name={key}
                input={input}
                value={localValue || ""}
                onChange={onChange}
                onComplete={onComplete}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                disabled={disabled}
            ></DefaultTextField>)
    else
        return (
            <TextField
                label={col.header}
                name={key}
                required={input.required}
                type={input.type}
                variant={input.variant}
                fullWidth
                value={localValue || ""}
                multiline={input.multiline}
                InputProps={input.InputProps}
                select={input.optionList?.length >= 1}
                onChange={onChange}
                onBlurCapture={onComplete}
                disabled={disabled}

                InputLabelProps={{ shrink: true }}

                error={!!validationErrors?.[key]}
                helperText={validationErrors?.[key]}
                onFocus={() =>
                    setValidationErrors({
                        ...validationErrors,
                        [key]: undefined,
                    })}
            >
                {input.optionList?.map((e) => {
                    var value = input.optionIdAccessor?.(e) || e.id
                    var label = input.optionValueAccessor?.(e) || e.name
                    return (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    )
                })}
            </TextField>
        )

}