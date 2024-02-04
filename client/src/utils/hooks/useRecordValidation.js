'use client'
import React from "react"

const validateRequired = (value) => {
    if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
    }
    return value !== undefined && (value > 0 || !!value.length);
}

export default function useRecordValidation(inputs){
    const [validationErrors, setValidationErrors] = React.useState({})
    const [validators, setValidators] = React.useState([])

    const validateRecord = React.useCallback(async (record) => {
        let errorText = {}
        for (const validator of validators) {
            const newErrorText = await validator(record);
            errorText = {
                ...errorText,
                ...newErrorText
            }
        }
        console.log("errorText", validators, record, errorText)
        if (Object.values(errorText).some((error) => error)) {
            setValidationErrors(errorText)
            return false
        }
        setValidationErrors({})
        return true
    }, [validators])

    React.useEffect(() => {
        setValidators([])
        const getRecordValue = (input, record) => input.valueGetter(record) || undefined

        inputs.forEach(input => {
            if (input.required && input.validator) {
                setValidators(prev => [
                    ...prev,
                    async (r) => ({
                        [input.name]:
                            !validateRequired(getRecordValue(input, r)) ? `${input.label} is required`
                                :
                                !await input?.validator(getRecordValue(input, r)) ? input?.errorMessage || 'Error' : ''
                    })
                ])
            }
            else if (input.required) {
                setValidators(prev => [
                    ...prev,
                    async (r) => ({ [input.name]: !validateRequired(getRecordValue(input, r)) ? `${input.label} is Required` : '' })
                ])
            }
            else if (input.validator) {
                setValidators(prev => [
                    ...prev,
                    async (r) => ({ [input.name]: !await input?.validator(getRecordValue(input, r)) ? input?.errorMessage || 'Error' : '' })
                ])
            }
        })
    }, [inputs])

    return [validationErrors, setValidationErrors, validateRecord]
}