'use client'
import React from "react"
import Stack from '@mui/material/Stack'
import useRecordValidation from '@/utils/hooks/useRecordValidation'
import FormEditField from "@/components/Table/TableColumnEditField"
import customDialogConfig from "@/components/Dialog/customDialogConfig"
import formEditMode from "./formEditMode"
import useBuiltTabMenu from "../Tabs/useBuiltTabMenu"

const FormGroup = React.forwardRef((props, ref) => {
    const { inputs, label, validationErrors, setValidationErrors } = props

    const formInputs = React.useRef([])
    React.useImperativeHandle(ref, () => ({
        save(form) {
            formInputs.current.forEach((input) => {
                input.save(form)
            })
        },
    }))
    return (<div></div>)

})
FormGroup.displayName = "FormGroup"

const FormTab = React.forwardRef((props, ref) => {
    const { tab, label, validationErrors, setValidationErrors } = props

    const formGroups = React.useRef([])
    React.useImperativeHandle(ref, () => ({
        save(form) {
            formGroups.current.forEach((group) => {
                group.save(form)
            })
        },
    }))

    return (
        <div></div>
    )

})
FormTab.displayName = "FormTab"

export default function useForm({ data, inputs, disabled, gap = customDialogConfig.gap, mode = formEditMode.create, allowGrouping = true, inputProps, suspendUpdate = true }) {
    const [validationErrors, setValidationErrors, validateRecord] = useRecordValidation(inputs[mode])
    const sortedColumns = React.useMemo(() => inputs[mode], [mode])
    const [formData, setFormData] = React.useState(data || {})
    const formInputs = React.useRef([])

    const onChange = (fn) => {
        if (suspendUpdate)
            return
        let newForm = fn({ ...formData })
        setFormData(newForm)
        console.log(newForm)
    }

    const setForm = (data) => {
        setFormData(data)
        setValidationErrors({})
    }

    const validate = React.useCallback(async (fn) => {
        let formData = { ...data }
        formInputs.current.forEach((input) => {
            input.save(formData)
        })

        if (validateRecord(formData)) {
            setFormData(formData)
            return await fn(formData)
        }
        else
            return false
    })

    React.useEffect(() => {
        return () => {
            setValidationErrors({})
        }
    }, [inputs])


    const form = React.useMemo(() => {
        let props = {
            disabled,
            record: formData,
            onChange,
            validationErrors,
            setValidationErrors,
            suspendUpdate,
            ...inputProps,
        }
        let makeInput = (input) => ({
            input: inputProps ? {
                ...input,
                InputProps: { ...inputProps, ...inputProps.InputProps }
            } : input,
            value: input.valueGetter(formData) || '',
        })

        let lastGroup = 0
        const renderGroup = (group, i) => {
            return group.map((input, ii) => {
                let index = i * lastGroup + ii;
                return (
                    <FormEditField ref={el => formInputs.current[index] = el} key={index} {...props} {...makeInput(input)} />
                );
            });
        };

        if (allowGrouping) {
            return sortedColumns.map((group, i) => {
                let res = (
                    <>
                        <Stack key={i} direction={group.length == 2 ? "row" : "column"} gap={gap}>
                            {renderGroup(group, i)}
                        </Stack>
                    </>
                )
                lastGroup = group.length
                return res
            });
        } else {
            return sortedColumns.flatMap(renderGroup);
        }
    }, [sortedColumns, formData, validationErrors, disabled, gap, allowGrouping])

    const tabMenu = useBuiltTabMenu({
        tabs: [
            {
                name: "Form",
            },
            {
                name: "JSON",
            }
        ]
    })
    const nonMemoForm = (
        <>

            {form}
        </>
    )

    return [setForm, validate, form, formData]
}

/*
React.useEffect(() => {
        const sortColumn = () => {
            const list = []
            const filteredArray = []

            inputs.forEach((i, index) => {
                const group = i.group || 0

                if (!list[group])
                    list[group] = []

                const place = i.order || index

                let targetList = list[group]
                let currentIndex = place

                while (targetList[currentIndex]) {
                    currentIndex++
                }

                targetList[currentIndex] = i
            })

            list.forEach((group) => {
                if (group) {
                    const filteredGroup = group.filter((element) => {
                        return element !== undefined && element !== null && element !== ''
                    })
                    filteredArray.push(filteredGroup)
                }
            })
            console.log(filteredArray)
            setColumns(filteredArray)
        }
        sortColumn()
        return () => {
            setValidationErrors({})
        }
    }, [inputs])
*/