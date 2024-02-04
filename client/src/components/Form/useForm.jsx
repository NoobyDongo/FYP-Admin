'use client'
import React from "react"
import Stack from '@mui/material/Stack'
import Collapse from '@mui/material/Collapse'
import Box from '@mui/material/Box'
import useRecordValidation from '@/utils/hooks/useRecordValidation'
import FormEditField from "@/components/Table/TableColumnEditField"
import customDialogConfig from "@/components/Dialog/customDialogConfig"
import formEditMode from "./formEditMode"
import useBuiltTabMenu from "../Tabs/useBuiltTabMenu"
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const makeInput = (input, inputProps, formData) => ({
    input: inputProps ? {
        ...input,
        InputProps: { ...inputProps, ...inputProps.InputProps }
    } : input,
    value: input.valueGetter(formData) || '',
})

const FormGroup = React.forwardRef((properties, ref) => {
    const { inputs, inputProps, label, props, formData, gap } = properties

    const formInputs = React.useRef([])
    React.useImperativeHandle(ref, () => ({
        save(form) {
            formInputs.current.forEach((input) => {
                input.save(form)
            })
        },
    }))

    const form = React.useMemo(() => {
        return (
            <>
                {label != 0 && <Stack direction='row' alignItems="center" sx={{ mb: gap - 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 500 }} variant="h6">{label}</Typography>
                    <Divider sx={{ flex: 1, height: 1, alignSelf: "center", ml: gap / 2 / 2 }} />
                </Stack>
                }
                <Collapse in={true}>
                    {
                        inputs.map((input, i) =>
                            <Collapse in={true} key={i}>
                                <Box sx={{ pt: i > 0 ? gap : 1, pb:gap / 2, }}>
                                    <FormEditField ref={el => formInputs.current[i] = el} {...props} {...makeInput(input, inputProps, formData)} />
                                </Box>
                            </Collapse>
                        )
                    }
                </Collapse>
            </>
        )
    }, [inputs, formData, inputProps, props, gap, label])

    return (form)

})
FormGroup.displayName = "FormGroup"

const FormTab = React.forwardRef((properties, ref) => {
    const { tab, props, inputProps, formData, gap } = properties
    const formGroups = React.useRef([])

    React.useImperativeHandle(ref, () => ({
        save(form) {
            formGroups.current.forEach((group) => {
                group.save(form)
            })
        },
    }))

    const Groups = React.useMemo(() => {

        return Object.keys(tab).map((key, i) => {
            console.log('inputs', tab[key])
            return (
                <FormGroup key={i} gap={gap} ref={el => formGroups.current[i] = el} formData={formData} inputs={tab[key]} inputProps={inputProps} props={props} label={key} />
            )
        })

    }, [tab, formData, inputProps, props, gap])

    return Groups

})
FormTab.displayName = "FormTab"

let obj = {
    0: {
        0: [
            {
                1: true,
                type: "text",
                required: true,
                // ... other properties ...
            },
        ],
    },
    Details: {
        0: [
            {
                1: true,
                type: "password",
                required: true,
                // ... other properties ...
            },
            {
                1: true,
                type: "password",
                required: true,
                // ... other properties ...
            },
        ],
        InnerDetails: [
            {
                1: true,
                type: "text",
                required: true,
                // ... other properties ...
            },
        ],
    },
};

export default function useForm({ data, inputs, disabled, gap = customDialogConfig.gap, mode = formEditMode.create, allowGrouping = true, inputProps, suspendUpdate = true }) {
    const [validationErrors, setValidationErrors, validateRecord] = useRecordValidation(inputs[mode][formEditMode.validator])
    const sortedColumns = React.useMemo(() => inputs[mode][formEditMode.content], [mode])
    const [formData, setFormData] = React.useState(data || {})
    const formTabs = React.useRef([])

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
        //console.log('formTabs', formTabs.current)
        formTabs.current.forEach((input) => {
            input?.save(formData)
        })

        if (await validateRecord(formData)) {
            setFormData(formData)
            return await fn(formData)
        }
        else
            return false
    })
    React.useEffect(() => {
        //console.log('sortedColumns', inputs)
        return () => {
            setValidationErrors({})
        }
    }, [inputs])

    React.useEffect(() => {
        //console.log('sortedColumns', sortedColumns)
    }, [sortedColumns])

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

        const renderTab = (tab) => {
            /*
            console.log('tab', Object.keys(tab).length)
            if(Object.keys(tab).length < 1)
                return
            */
            return Object.keys(tab).map((key, i) => {
                let resTab = ({
                    name: key == 0 ? 'Basic Information' : key,
                    content: <FormTab tab={tab[key]} ref={el => formTabs.current[i] = el} inputProps={inputProps} props={props} formData={formData} gap={gap} />,
                })
                return resTab
            })
        }

        //console.log('tab content', renderTab(sortedColumns[formEditMode.content]))

        return renderTab(sortedColumns)

    }, [sortedColumns, formData, validationErrors, inputProps, gap, disabled, suspendUpdate])

    const { menu, tabs } = useBuiltTabMenu({
        tabs: form,
        useFade: false,
        TabProps: {
            preventUmount: true,
            variants:{
                initial: {
                    opacity: 1,
                    scale: 1,
                },
            },
        },
        MenuProps: {
            sx: {
                minHeight: 0,
                display: 'flex',
                flexGrow: 0,
                height: 'fit-content',
                "& .MuiTabs-indicator": {
                    display: 'none',
                    transform: "scaleX(0) translateY(-0px)",
                },
                '& .MuiTabs-flexContainer': {
                    py: 0,
                    gap: gap / 2,
                },
            },
            TabProps: {
                sx: {
                    minWidth: 0,
                    borderRadius: 20,
                    padding: .5,
                    mb: gap,
                    minHeight: 0,
                },
            }
        }
    })

    //console.log('Object.keys(sortedColumns).length', Object.keys(sortedColumns).length)
    const final = React.useMemo(() => (<div>
        {Object.keys(sortedColumns).length > 1 && <div>
            {menu}
        </div>}
        {tabs}
    </div>), [menu, tabs])

    //console.log('final', { mode, sortedColumns, })

    return [setForm, validate, final, formData]
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