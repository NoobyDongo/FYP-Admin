'use client';
import React from 'react';
import CrudTable from './Table';

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

const RecordsTextField = React.forwardRef((props, ref) => {
    const {
        input, value, record
    } = props;
    const { schema, demo = false } = input;

    React.useImperativeHandle(ref, () => ({
        getValue() {
            return data;
        },
        clear() {
        }
    }));

    const customCreate = React.useCallback((r) => {
        input.valueSetter(r, input.valueGetter(record));
        return schema.props?.crud?.methods?.customCreate(r) ?? r;
    }, [input]);
    const customUpdate = React.useCallback((r) => {
        input.valueSetter(r, input.valueGetter(record));
        return schema.props?.crud?.methods?.customUpdate(r) ?? r;
    }, [input]);
    const customDelete = React.useCallback((r) => {
        return schema.props?.crud?.methods?.customDelete(r) ?? r.id;
    }, [input]);

    const baseSearchCriteria = React.useMemo(() => ({ id: `id.${input.setterKey}`, value: `${input.valueGetter(record)}` }), [record, input]);

    let Table = React.useCallback(() => CrudTable({
        columns: schema.columns,
        inputs: schema.inputs,
        tableName: schema.name,
        ...schema.props,
        ...(!demo && baseSearchCriteria),
        mini: true,
        crud: {
            methods: {
                deleteOption: "remove",
                customCreate,
                customDelete,
                customUpdate,
            }
        }
    }), [schema, record, input]);

    return (<>
        <Table />
    </>);
});
RecordsTextField.displayName = 'RecordsTextField';
export default RecordsTextField;
