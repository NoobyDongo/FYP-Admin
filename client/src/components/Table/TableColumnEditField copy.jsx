'use client'
import MenuItem from '@mui/material/MenuItem';
import ImagesUpload from '@/components/Images/ImagesUpload';
import Box from "@mui/material/Box"
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { Children, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import OutlinedDiv from '../OutlinedDiv';
import HoverButtonGroup from '../HoverButtonGroup';
import IconButtonWithTooltip from '../IconButtonWithTooltip';
import useForm from '../Form/useForm';
import useHistory from '../useHistory';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CustomDialog from '../Dialog/CustomDialog';
import Prompt from '../Prompt/Prompt';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import RecordTextField from '../Inputs/RecordTextField';
import DefaultTextField from '../Inputs/DefaultTextField';
import PasswordTextField from '../Inputs/PasswordTextField';
import useCustomTableProps from './utils/tableProps';
import tableConfig from './utils/tableConfig';
import useCreateEditDeletePrompts from '../Prompt/useCreateEditDeletePrompts';

/*
const RecordsTextField = forwardRef((props, ref) => {

    const {
        disabled,
        input: rawInput,
        onChange: setParentValue,
        value: parentValue,
    } = props

    const [value, setValue] = useState(parentValue || [])

    const { required, label, inputs, input } = rawInput

    const [setForm, validateRecord, form] = useForm({
        inputs, allowGrouping: false,
        inputProps: {
            variant: "standard",
            label: "",
        }
    })

    console.log('input', input)
    const [setSearchValue, validateSearch, searchField, searchData] = useForm({
        inputs: input, allowGrouping: false,
        suspendUpdate: false,
        inputProps: {
            label: "",
            fullRecord: true,
            fullWidth: true,
            placeholder: `Search ${input[0].table.label}...`,
            sx: {
                '& .MuiInputBase-root': {
                    py: 0,
                    borderRadius: 50,
                },
                height: 'fit-content',
                padding: 1,
            }
        }
    })

    useEffect(() => {
        console.log("searchData", searchData)
    }, [searchData])

    useImperativeHandle(ref, () => ({
        getValue() { },
        clear() {
        }
    }))

    const { history, pointer, add: addToHistory, renderTools } =
        useHistory({
            initialValue: value,
            valueSetter: setValue,
            removeAll: () => setValue([]),
            comparator: (value) => value.map((record) => rawInput.valueGetter(record))
        })

    const onChange = (value) => {
        setParentValue(value)
    }

    const add = () => {
        let rec = input[0].valueGetter(searchData)
        if (!rec)
            return
        setValue(prev => {
            let newValue = [...prev, rec]
            addToHistory(newValue)
            return newValue
        })
    }

    console.log("value", input[0].valueGetter(searchData))
    
        useEffect(() => {
            if (parentValue) {
                setForm(value)
            }
        }, [parentValue])
    

    const [open, setOpen] = useState(false)

    const saveRecord = async (data) => {
        console.log(data)
    }

    const questionPrompt = useCallback(({ open }) =>
        <Prompt open={open} onClose={() => setOpen(false)} action={1} title={"add new records"} data={row}{...{ inputs, saveRecord: updateRecord }} 

        />
        , [inputs, updateRecord, row])

    return (
        <OutlinedDiv disabled={disabled} label={label} required={required} >

            <Collapse in={value.length > 0}>
                <TableContainer component={Box}>
                    <Table aria-label="simple table">
                        <TableHead sx={{
                            '& >.MuiTableRow-root >.MuiTableCell-head': {
                                borderColor: "input.border.main",
                                whiteSpace: "nowrap",
                            }
                        }}>
                            <TableRow>
                                <TableCell>Index</TableCell>
                                <TableCell>{input[0].label}</TableCell>
                                {inputs.map((input, i) => (
                                    <TableCell key={i} {...(i === inputs.length - 1 && { align: "right" })}>
                                        {input.label}
                                        {input.required ? " *" : ""}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {value.map((record, i) => (
                                <TableRow
                                    sx={{ '& td, & th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        <span>{i + 1}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span>{record.name}</span>
                                    </TableCell>
                                    {form.map((group, ii) => {
                                        let index = ii * group.length
                                        return (group.map((e, i) => (
                                            <TableCell key={index + i} {...(index + i === inputs.length - 1 && { align: "right" })}>
                                                {e}
                                            </TableCell>
                                        )))
                                    })}
                                </TableRow>

                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>

            <Collapse in={!disabled}>
                <Stack direction='row' alignItems='center'>
                    {searchField.map((group, ii) => {
                        let index = ii * group.length
                        return (group.map((e, i) => e))
                    })}
                    <HoverButtonGroup position="relative" locked={true} expanded={true} disabled>
                        {(() => {
                            let buttonDisabled = !input[0].valueGetter(searchData) || disabled
                            return Children.toArray(renderTools()).concat([
                                <IconButtonWithTooltip onClick={add} label='Add Record' disabled={buttonDisabled}>
                                    <AddCircleRoundedIcon {...(!buttonDisabled && { color: "primary" })} />
                                </IconButtonWithTooltip>
                            ])
                        })()}
                    </HoverButtonGroup>
                </Stack>
            </Collapse>

            <CustomDialog open={true}>

            </CustomDialog>
        </OutlinedDiv>
    )
})
RecordsTextField.displayName = 'RecordsTextField'
*/

/*
const a =
    <Autocomplete
        multiple
        open={open}
        onOpen={() => {
            setOpen(true);
        }}
        onClose={() => {
            setOpen(false);
        }}
        loading={loading}
        id="tags-standard"
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
            <TextField
                {...params}
                variant="standard"
                label="Multiple values"
                placeholder="Favorites"
            />
        )}
    />
*/


const RecordsTextField = forwardRef((props, ref) => {
    const {
        input, disabled, value
    } = props
    const { schema, label, required, name } = input

    const [counter, setCounter] = useState(0)

    useImperativeHandle(ref, () => ({
        getValue() {
            return data
        },
        clear() {
            setData([])
            resetHistory()
        }
    }))

    useEffect(() => {
        if (value)
            setData(value)
    }, [value])

    const [data, setData] = useState([])
    const { add: addToHistory, renderTools, resetHistory } =
        useHistory({
            disabled,
            initialValue: data,
            valueSetter: setData,
            comparator: (value) => value.map((image) => image['data'] || image['name'])
        })

    console.log("Table Data", data)

    const createRecord = useCallback((record) => {
        if (validationErrors?.[name])
            setValidationErrors({
                ...validationErrors,
                [name]: undefined,
            })
        let id = counter + 1
        record.id = id
        data.push(record)
        let d = [...data]
        setData(d)
        addToHistory(d)
        setCounter(id)
        return {}
    }, [])
    const updateRecord = useCallback((record) => {
        let old = data.find(record => record.id === id)
        if (old) {
            Object.assign(old, record);
        }
        let d = [...data]
        setData(d)
        addToHistory(d)
        return {}
    }, [])
    const deleteRecord = useCallback((id) => {
        const index = data.findIndex(record => record.id === id)
        if (index !== -1) {
            data.splice(index, 1);
        }
        let d = [...data]
        setData(d)
        addToHistory(d)
        return {}
    }, [])

    const { CreatePrompt, EditPrompt, toCreate, toEdit, toDelete } = useCreateEditDeletePrompts({
        inputs: schema.inputs, createRecord, updateRecord, deleteRecord
    })

    const { renderTopToolbar, renderBottomToolbar, ...customProps } = useCustomTableProps({
        enableColumnFilterModes: true,
        mini: true,
        disableTopToolbar: true,
        disableBottomToolbar: true,
        rowCount: data.length,
        toCreate,
        toEdit,
        toDelete,
        ...schema.props
    })

    const table = useMaterialReactTable({
        ...customProps,
        columns: schema.columns,
        data: data,
    })

    /*
        const { CreatePrompt, EditPrompt, toCreate, toEdit, toDelete } = useCreateEditDeletePrompts({
            inputs, upload, createRecord, row, updateRecord, deleteRecord
        })
    */
    //console.log(schema, input)

    return (
        <>
            <Box sx={{ position: "relative", py: 2, pr: tableConfig.iconButtonSize + 1 }}>

                {renderBottomToolbar({
                    table, simple: true, sx: {
                        border: 0,
                        py: 0,
                        height: tableConfig.iconButtonSize,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        '& .MuiFormLabel-root': {
                            display: "none"
                        },
                        '& .MuiTablePagination-root': {
                            justifyContent: "flex-start",
                        },
                        '& .MuiTablePagination-root': {
                            padding: 0,
                        },
                        '& .MuiPagination-ul > li, & .MuiPagination-ul > li > .MuiPaginationItem-root': {
                            width: tableConfig.iconButtonSize * .9,
                            minWidth: 0,
                            margin: 0,
                            padding: 0,
                            height: tableConfig.iconButtonSize * .9,
                        }
                    }
                })}
                <HoverButtonGroup disabled={data.length < 1} locked={data.length < 1}>
                    {Children.toArray(renderTopToolbar({ table, simple: true, disabled }).concat(renderTools())).reverse()}
                </HoverButtonGroup>
            </Box>
            <Collapse in={data.length > 0}>
                <MaterialReactTable table={table} />
            </Collapse>
            {CreatePrompt}
            {EditPrompt}
        </>

    )
})
RecordsTextField.displayName = 'RecordsTextField'


function deleteNestedKey(obj, path) {
    let pathParts = path.split('.');
    let key = pathParts.pop();
    let targetObj = pathParts.reduce((o, k) => (o || {})[k], obj);
    if (targetObj && targetObj.hasOwnProperty(key)) {
        delete targetObj[key];
    }
}

const TableColumnEditField = forwardRef((props, ref) => {
    const {
        validationErrors, setValidationErrors,
        input,
        record,
        onChange: saveToParent, value, disabled, suspendUpdate, ...others
    } = props

    const inputComponent = useRef(null)

    const [localValue, setValue] = useState(null)

    useEffect(() => {
        if (!value)
            inputComponent.current?.clear()
        setValue(value)
        console.log('TableColumnEditField', value)
    }, [record])


    const save = (value) => {
        saveToParent((form) => input.valueSetter(form, value))
    }

    const onComplete = () => {
        if (localValue === value)
            return null
        save(localValue)
    }

    const onChange = (e) => {
        setValue(e.target.value)
    }

    useImperativeHandle(ref, () => ({
        save(form) {
            if (input.type === "records") {
                deleteNestedKey(form, input.name)
                return form
            } else if (inputComponent.current)
                return input.valueSetter(form, inputComponent.current.getValue())
            else
                return input.valueSetter(form, localValue)
        },
    }))

    if (!input)
        return

    const textInputProps = {
        input,
        value: localValue,
        validationErrors,
        setValidationErrors,
        disabled,
        ...others
    }

    if (input.type === "image")
        return (
            <ImagesUpload
                {...textInputProps}
                onChange={(e) => { onChange({ target: { value: e } }); save(e) }}
                value={value}
                label={input.label}
                name={input.name}
                required={input.required}

                link={input.linkFn?.(record)}
                ref={inputComponent}
            />
        )
    if (input.type === 'records')
        return (
            <RecordsTextField
                {...textInputProps}
                onChange={(e) => { onChange({ target: { value: e } }) }}
                ref={inputComponent}
            />)
    textInputProps.value = localValue || ''
    if (input.type === 'record')
        return (
            <RecordTextField
                {...textInputProps}
                onChange={(e) => { onChange({ target: { value: e } }); save(e) }}
                ref={inputComponent}
            />)
    if (input.type === "password")
        return (
            <PasswordTextField {...textInputProps}
                onChange={onChange}
                onComplete={onComplete}
            />)
    else
        return (
            <DefaultTextField {...textInputProps}
                onChange={onChange}
                onComplete={onComplete}
            />)

})
TableColumnEditField.displayName = 'TableColumnEditField'
export default TableColumnEditField