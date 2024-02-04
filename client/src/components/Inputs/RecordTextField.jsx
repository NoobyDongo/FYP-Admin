'use client'
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAPI from '@/utils/crud/useAPI'
import useGlobalFilter from '../Table/utils/filters/useGlobalFilter'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import Popper from '@mui/material/Popper'
import DefaultTextField from './DefaultTextField'
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"

//what a load of crap
const RecordTextField = React.forwardRef((props, ref) => {
    const {
        input, onChange: onParentChange, value: unUsedValue, name, disabled, validationErrors, setValidationErrors, ...others
    } = props
    const { full = false, sx } = input
    let useMultiple = false

    const [inputValue, setInputValue] = useState('')
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(useMultiple ? [] : null)
    const [options, setOptions] = useState([])
    const [fetched, setFetched] = useState(false)
    const loading = open && options.length === 0 && !fetched
    const router = useRouter()
    const callApi = useAPI('api/record', input.table.name, router)

    const getOptionLabel = React.useCallback((option) => { return `${option.name || input.table.nameFn?.(option)} (id:${option.id})` }, [])

    useEffect(() => {
        if (unUsedValue) {
            if (unUsedValue == value?.id) {
            } else {
                tempValue.current = unUsedValue
                tempLabel.current = getOptionLabel(tempValue.current)
                setInputValue(tempLabel.current)
                setValue(unUsedValue)
            }
        }
    }, [unUsedValue])

    const globalFilter = useGlobalFilter(input.table.columns, input.table.props?.initialState?.columnVisibility, inputValue)

    useImperativeHandle(ref, () => ({
        getValue() { return full ? value : useMultiple ? value.map((e) => { id: e.id }) : value?.id || null },
        clear() {
            resetValue()
            setInputValue('')
            tempValue.current = null
            tempLabel.current = null
        }
    }))

    //get options
    useEffect(() => {
        if (!open || value)
            return
        (async () => {
            const timeoutId = setTimeout(() => {
                setFetched(false)
            }, 100)
            const res = await callApi({
                option: "search",
                method: "POST",
                body: {
                    criteriaList: globalFilter,
                    page: 0,
                    size: 6,
                },
                simple: false
            })
            setOptions(res.content || [])

            clearTimeout(timeoutId)
            setFetched(true)
            //const response = await 
        })()
    }, [inputValue, open])

    //reset options
    useEffect(() => {
        if (open)
            return
        setOptions([])
        if (tempValue.current) {
            setValue(tempValue.current)
            setInputValue(tempLabel.current)
        }
    }, [open])


    const onChange = (event, newValue) => {
        tempValue.current = null
        tempLabel.current = null
        setValue(newValue)
        //onParentChange(fullRecord ? newValue : newValue?.id || null)
        console.log(newValue)
    }

    const resetValue = () => {
        setValue(useMultiple ? [] : null)
    }

    const [skipUpdate, setSkipUpdate] = useState(true)
    const onInputChange = useCallback((e, newInputValue) => {
        console.log("onInputChange")
        if (skipUpdate) {
            return
        }
        if (value && !useMultiple) {
            tempValue.current = value
            tempLabel.current = inputValue
            resetValue()
        }
        if(validationErrors[input.name])
            setValidationErrors({ ...validationErrors, [input.name]: null })
        setInputValue(newInputValue)
        if (!newInputValue && !useMultiple) {
            resetValue()
        }
        if (!newInputValue && !open) {
            setOpen(true)
        }
    }, [skipUpdate, open, value])
    const handleKeyDown = (event) => {
        /*
        console.log("handleKeyDown", event.key)
        if (event.key === 'Enter') {
            setValue(tempValue.current)
        }
        */
    }


    const tempValue = useRef()
    const tempLabel = useRef()
    const onMenuOpen = () => {
        console.log("onMenuOpen")
        if (value) {
            tempValue.current = value
            tempLabel.current = inputValue
            resetValue()
            setInputValue('')
        }
        setOpen(!open)
    }

    return (
        <Autocomplete
            {...others}

            open={open}
            onOpen={() => {
                if (value)
                    return
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}

            sx={{
                minWidth: 150,
                flex: 1,
                '& .MuiOutlinedInput-root': {
                    padding: 2.0625 - 0.9375,
                    paddingRight: 1.75,
                },
                ...sx,
            }}

            loading={loading}
            options={options}
            filterSelectedOptions
            filterOptions={(x) => x}
            onChange={onChange}
            onInputChange={onInputChange}
            value={value}

            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={getOptionLabel}

            renderTags={(value, getTagProps) => {
                return value.map((option, index) => (
                    <Chip key={index} variant="outlined" label={option.name || input.table.nameFn?.(option)} {...getTagProps({ index })} />
                ))
            }}

            PopperComponent={(props) => <Popper {...props} sx={{ minWidth: 300, width: 1, ...props.sx }} placement="bottom-start" />}

            renderOption={(props, option) => {
                let {key, ...others} = props
                return (
                    <li key={key} {...others}>
                        <Stack direction='row' gap={2}>
                            <Grid item sx={{ minWidth: 30, alignSelf: 'center' }}>
                                {option.id}
                            </Grid>
                            <Divider orientation="vertical" flexItem />
                            <Grid item sx={{ minWidth: 30 }}>
                                {option.name || input.table.nameFn?.(option)}
                            </Grid>
                        </Stack>
                    </li>
                )
            }}

            disabled={disabled}
            disableClearable
            forcePopupIcon={false}
            renderInput={(params) => {
                return <DefaultTextField
                    {...params}
                    {...others}
                    disabled={disabled}
                    validationErrors={validationErrors}
                    setValidationErrors={setValidationErrors}
                    InputLabelProps={{ shrink: true }}
                    input={input}
                    placeholder={tempLabel.current || ""}
                    InputProps={{
                        ...params.InputProps,
                        onFocus: () => setSkipUpdate(false),
                        onBlur: () => setSkipUpdate(true),
                        onKeyDown: handleKeyDown,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <Fade in={!disabled}>
                                    <InputAdornment position="end">
                                        {value &&
                                            <IconButton
                                                aria-label="clear select"
                                                onClick={(e) => onChange(e, null)}
                                                edge="end"
                                                size='small'
                                            >
                                                <CloseIcon />
                                            </IconButton>}
                                        <IconButton
                                            aria-label="open select"
                                            disabled={disabled}
                                            onClick={onMenuOpen}
                                            edge="end"
                                            size='small'
                                        >
                                            {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                </Fade>
                            </>
                        ),
                    }} />
            }} />
    )
})
RecordTextField.displayName = 'RecordTextField'
export default RecordTextField
