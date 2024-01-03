'use client'
import { useCallback, useEffect, useState } from "react";

export const numberReg = /^-?\d+\.?\d*$/
export const urlReg = /(https?:\/\/[^\s]+)/g;
export const imageReg = /(data:image\/[^\s]+)/g;

export default function useRecordValidation(columns) {
    const [validators, setValidators] = useState([]);

    const validateRequired = (value) => value !== undefined && (value > 0 || !!value.length);

    const validateRecord = useCallback((record) => {
        console.log("validateRecord", record)
        console.log("validateRecordError", validators)

        var errorText = {}
        validators.forEach(validator => {
            var newErrorText = validator(record)
            console.log("temp", newErrorText)
            errorText = {
                ...errorText,
                ...newErrorText
            }
        })
        return errorText
    },[validators])
    
    useEffect(() => {
        console.log("setValidators()")
        setValidators([])
        
        const getRecordValue = (col, r) => col.accessorFn?.(r) || r[col.accessorKey]

        columns.forEach((c) => {
            if (c.input?.required && c.input?.validator) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({
                        [c.accessorKey]:
                            !validateRequired(getRecordValue(c, r)) ? `${c.header} is required`
                                :
                                !c.input?.validator(getRecordValue(c, r)) ? c.input?.errorMessage || 'Error' : ''
                    })
                ])
            }
            else if (c.input?.required) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !validateRequired(getRecordValue(c, r)) ? `${c.header} is Required` : '' })
                ])
            }
            else if (c.input?.validator) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !c.input?.validator(getRecordValue(c, r)) ? c.input?.errorMessage || 'Error' : '' })
                ])
            }
        })
    }, [columns])

    return validateRecord
}