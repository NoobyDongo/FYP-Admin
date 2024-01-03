'use client'
import {
    TextField,
    MenuItem,
    Box,
} from '@mui/material';
import ImageUpload from '@/components/ImageUpload';
import { useEffect, useState } from 'react';
import Image from 'next/image';


function NextImage(props) {
    const { defaultSrc, src, ...others } = props;
    const [source, setSource] = useState(src || defaultSrc);

    return (
        <Image
            {...others}
            src={source}
            onErrorCapture={() => {
                setSource(defaultSrc);
            }}
        />
    );
}

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
    console.log(keys)

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
        console.log(keys, nestedObject, form, lastKey, value)

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
    let inputValueStetter = createInputValueSetter(accessorKey, !input?.simple && input?.optionList)
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
                ...(display.type === "imageText" && TableImageTextCell({ accessorFn: createAccessorFunction(display.accessorKey) }))
            })
        }),
        ...others
    }
}




/*
const column = {
    accessorFn: (value) => value.xx,
    accessorKey: "test",
    header: "Test",
    size: 120,
    ...others,
    input: {
        type: "xx" || "text",
        valueSetter: (form, value) => form["xx"] = value,

        ...(select && {
            optionList: list,
            optionIdAccessor: (option) => option.xx,
            optionValueAccessor: (option) => option.name,

        })
    }
}
/*
const ex = {
    accessorFn: (row) => row.productType?.id,
    accessorKey: 'productType',
    header: 'Type',
    size: 200,
    ...SelectInput({
        valueAccessorFn: (row) => row.productType?.name,
        required: true,
        group: 2,
        optionList: producttype,
        fn: (form, value) => ({ ...form, productType: { ...producttype.find((e) => e.id = value) } }),
        optionValueAccessorFn: (v) => v?.id,
        optionLabelAccessorFn: (v) => v?.name,
        cell: {
            sx: {
                textTransform: "capitalize"
            }
        },
        required: true,
    })
}
*/


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
                <Box sx={{textOverflow:"ellipsis", whiteSpace:"nowrap"}} >
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
                    <span style={{ whiteSpace:"nowrap"}}>{renderedCellValue}</span>
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
        //{input.optionLabelAccessorFn(input.optionList?.find((e) => input.optionValueAccessorFn(e) == cell.getValue()))}
        //{input.valueAccessorFn(row.original)}
        Cell: ({ cell }) => (
            <Box sx={{ textTransform: "capitalize" }}>
                {getOptionvalue(cell.getValue())}
            </Box>
        ),
    }
}


export default function TableColumnEditField(props) {
    const { col, validationErrors, setValidationErrors } = props
    const { onComplete: saveToParent, value } = props

    const [localValue, setValue] = useState()
    useEffect(() => {
        setValue(value)
    }, [value])

    const onComplete = () => {
        console.log("value", localValue, "oldValue", value)
        if (col.input.type === "select")
            console.log(col.input.optionList)
        if (localValue === value) {
            console.log("...no change at all...")
            return null
        }
        saveToParent((form) => col.input.valueSetter(form, localValue))
    }
    const onTextChange = (e) => {
        setValue(e.target.value)
    }

    const onSelectChange = (e) => {
        setValue(e.target.value)
        //console.log("event", e.target.value)
        //saveToParent((form) => valueSetter({}, e.target.value))
        //onComplete(e)
    }


    if (!col.input)
        return

    var input = col.input
    var key = col.accessorKey
    if (input.type == "image")
        return (
            <ImageUpload
                images={value}
                maxNumber={1}
                name={key}
                onChange={onComplete}
            ></ImageUpload>
        )
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
                onChange={input.optionList?.length >= 1 ? onSelectChange : onTextChange}
                onBlurCapture={onComplete}
                {...(!input.type === "text" && {onBlurCapture:{onComplete}})}

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