'use client'
import { useCallback, useEffect, useState } from "react";

export const numberReg = /^-?\d+\.?\d*$/

export default function useRecordValidation(columns) {
    const [validators, setValidators] = useState([]);

    const validateRequired = (value) => value !== undefined && (value > 0 || !!value.length);

    const validateRecord = useCallback((record) => {
        console.log("validateRecord", record)
        console.log("validateRecordError", validators)

        var r = {}
        validators.forEach(e => {
            var t = e(record)
            console.log("temp", t)
            r = {
                ...r,
                ...t
            }
        })
        return r
    },[validators])

    useEffect(() => {
        console.log("setValidators()")
        setValidators([])
        columns.forEach((c) => {
            if (c.input?.required && c.input?.validator) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({
                        [c.accessorKey]:
                            !validateRequired(r[c.accessorKey]) ? `${c.header} is Required`
                                :
                                !c.input?.validator(r[c.accessorKey]) ? c.input?.errorMessage || 'Error' : ''
                    })
                ])
            }
            else if (c.input?.required) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !validateRequired(r[c.accessorKey]) ? `${c.header} is Required` : '' })
                ])
            }
            else if (c.input?.validator) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !c.input?.validator(r[c.accessorKey]) ? c.input?.errorMessage || 'Error' : '' })
                ])
            }
        })
    }, [columns])

    return validateRecord
}