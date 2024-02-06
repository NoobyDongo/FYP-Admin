'use client'
import ImagesUpload from '@/components/Images/ImagesUpload';
import React from 'react';
import RecordTextField from '../Inputs/RecordTextField';
import DefaultTextField from '../Inputs/DefaultTextField';
import PasswordTextField from '../Inputs/PasswordTextField';
import RecordsTextField from './RecordsTextField';

function deleteNestedKey(obj, path) {
    let pathParts = path.split('.');
    let key = pathParts.pop();
    let targetObj = pathParts.reduce((o, k) => (o || {})[k], obj);
    if (targetObj && targetObj.hasOwnProperty(key)) {
        delete targetObj[key];
    }
}

///excuse me, this compoenent is shxt :-))
const TableColumnEditField = React.forwardRef((props, ref) => {
    const {
        validationErrors, setValidationErrors,
        input,
        record,
        value, disabled, ...others
    } = props

    const inputComponent = React.useRef(null)

    const [localValue, setValue] = React.useState(null)

    React.useEffect(() => {
        if (!value)
            inputComponent.current?.clear()
        else
            setValue(value)
        //console.log('TableColumnEditField', value, 'localValue', localValue)
    }, [record])


    const onChange = React.useCallback((e) => {
        //console.log('onChange', e.target.value)
        setValue(e.target.value)
    }, [])

    //wow
    const onSpecialChange = React.useCallback((e) => {
        onChange({ target: { value: e } });
    }, [onChange])

    React.useImperativeHandle(ref, () => ({
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

    const textInputProps = React.useMemo(() => ({
        input,
        value: localValue,
        record,
        validationErrors,
        setValidationErrors,
        disabled,
        ...others
    }), [localValue, record, validationErrors, disabled, others, input])

    if (input.type === "image")
        return (
            <ImagesUpload
                {...textInputProps}
                onChange={onSpecialChange}
                value={value}
                label={input.label}
                name={input.name}
                required={input.required}

                link={input.linkFn?.(record)}
                ref={inputComponent}
            />
        )
    else if (input.type === 'records')
        return (
            <RecordsTextField
                {...textInputProps}
                ref={inputComponent}
            />)

    textInputProps.value = localValue || ''
    if (input.type === 'record')
        return (
            <RecordTextField
                {...textInputProps}
                onChange={onSpecialChange}
                ref={inputComponent}
            />)
    else if (input.type === "password")
        return (
            <PasswordTextField {...textInputProps}
                onChange={onChange}
            />)
    else
        return (
            <DefaultTextField {...textInputProps}
                onChange={onChange}
            />)

})
TableColumnEditField.displayName = 'TableColumnEditField'
export default TableColumnEditField