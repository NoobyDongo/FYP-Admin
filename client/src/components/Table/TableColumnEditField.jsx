'use client'
import MenuItem from '@mui/material/MenuItem';
import ImagesUpload from '@/components/Images/ImagesUpload';
import Box from "@mui/material/Box"
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

import React, { Children, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

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
import RecordsTextField from './RecordsTextField';

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
        //console.log('TableColumnEditField', value)
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
        record,
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