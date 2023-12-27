'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    MenuItem,
} from '@mui/material';
import { products, rawOrigin, rawType } from './makeData';
import Table from '@/components/Table'
import { MRT_EditActionButtons } from 'material-react-table';
import ImageUpload from '@/components/ImageUpload';


var numberReg = /^-?\d+\.?\d*$/

function TableColumnEditField(props) {
    const { col, validationErrors, setValidationErrors, onChange, value } = props
    if (col.input) {
        var input = col.input
        return (
            <TextField
                label={col.header}
                name={col.accessorKey}
                required={input.required}
                type={input.type}
                variant={input.variant}
                fullWidth={true}
                defaultValue={value}
                multiline={input.multiline}
                InputProps={input.InputProps}
                select={input.optionList?.length >= 1}
                onChange={onChange}

                InputLabelProps={{ shrink: true }}

                error={!!validationErrors?.[col.accessorKey]}
                helperText={validationErrors?.[col.accessorKey]}
                onFocus={() =>
                    setValidationErrors({
                        ...validationErrors,
                        [col.accessorKey]: undefined,
                    })}
            >
                {input.optionList?.map((e) => {
                    var value = input.optionValueAccessorFn?.(e) || e.value
                    var label = input.optionLabelAccessorFn?.(e) || e.label
                    return (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    )
                })}
            </TextField>
        )
    }
}
/*
function DateInputField({ edit, value, setValue }) {

    return (
        <>
            {(value || edit) &&
                <DatePicker
                    defaultValue={value || dayjs(new Date())}
                    disableOpenPicker={!edit}
                    onChange={(e) => setValue(e)}
                    slotProps={{
                        disableUnderline: !edit, textField: {
                            variant: "standard", size: 'small', readOnly: !edit, InputProps: {
                                disableUnderline: !edit
                            }
                        }
                    }}
                />
            }
            {(!value && !edit) && <Text value={"——"} />}
        </>
    )
}
*/
function useRecordValidation(columns) {
    const [validators, setValidators] = useState([]);

    const validateRequired = (value) => value !== undefined && !!value.length;
    function validateRecord(record) {
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
    }

    useEffect(() => {
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
            if (c.input?.required) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !validateRequired(r[c.accessorKey]) ? `${c.header} is Required` : '' })
                ])
            }
            if (c.input?.validator) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !c.input?.validator(r[c.accessorKey]) ? c.input?.errorMessage || 'Error' : '' })
                ])
            }
        })
    }, [columns])

    return validateRecord
}
/*
function useEditForm(columns, tableName){
    const [validationErrors, setValidationErrors] = useState({});
    const [images, setImages] = useState([]);
    const [form, setForm] = useState([]);

    useEffect(() => {
        setImages([{data_url : row.original.image}])
        setForm({...form, ...row.original, id:row.original.id})
    },[])

    const onImageUploadChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
        onFormValueChange({
            target: {
                name: "image",
                value: imageList[0]?.data_url || null
            }
        })
    };

    const onFormValueChange = (e) => {
        setForm({...form, id:row.original.id})
        editForm.current[e.target.name]= e.target.value
        console.log(editForm.current)
    }
}
*/

function EditPrompt(props){
    const [validationErrors, setValidationErrors] = useState({});

    const {table, columns, images, setImages, editForm, row, tableName} = props
    useEffect(() => {
        setImages([{data_url : row.original.image}])
        editForm.current = {...row.original}
        editForm.current.id = row.original.id
    },[])

    const onImageUploadChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
        onFormValueChange({
            target: {
                name: "image",
                value: imageList[0]?.data_url || null
            }
        })
    };

    const onFormValueChange = (e) => {
        editForm.current[e.target.name]= e.target.value
        console.log(editForm.current)
    }

    return (
        <>
            <DialogTitle variant="h4">Edit {tableName || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                <Stack direction="row" gap="1rem">
                    <ImageUpload
                        images={images}
                        maxNumber={1}
                        onChange={onImageUploadChange}
                    ></ImageUpload>
                </Stack>
                {
                    columns.slice(0, 4).map((col, i) =>
                        <TableColumnEditField key={i}
                            col={col}
                            value={editForm.current[col.accessorKey]}
                            onChange={onFormValueChange}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors} />
                    )
                }
                <Stack gap="1rem" direction="row" width={1}>
                    {
                        columns.slice(4, 6).map((col, i) =>
                            <TableColumnEditField key={i}
                                col={col}
                                value={editForm.current[col.accessorKey]}
                                onChange={onFormValueChange}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors} />
                        )
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
        </>
    )
}

function RawProductTable() {
    const [validationErrors, setValidationErrors] = useState({});
    const tableName = "Product"

    const handleCreate = async ({ values, table }) => {

        console.log("createForm", createForm.current)

        const obj = {
            ...values,
            ...createForm.current,
        }

        console.log("Object", obj)
        const newValidationErrors = validateRecord(obj);
        console.log("Error", newValidationErrors)
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createRecord(obj);
        table.setCreatingRow(null); //exit creating mode
        createForm.current = {}
        setImages([])
    };

    const handleSave = async ({ values, table }) => {

        console.log("editForm", editForm.current)

        const obj = {
            ...editForm.current,
        }

        console.log("editForm", {...values})

        const newValidationErrors = validateRecord(obj);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateRecord(obj);
        table.setEditingRow(null); //exit editing mode
        editForm.current = {}
        setImages([])
    };

    console.log("Table Rendered")

    const { mutateAsync: createRecord, isPending: isCreatingRecord } = useCreate();
    const { data: fetchedRecords = [], isError: isLoadingError, isFetching: isFetchingRecords, isLoading: isLoadingRecords, } = useGet();
    const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useUpdate();
    const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useDelete();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 120,
                enableClickToCopy: true,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 200,
                input: {
                    required: true,
                },
                Cell: ({ renderedCellValue, row }) => {
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            <Image
                                alt="avatar"
                                height={30}
                                width={30}
                                src={row.original.image || "/image/avatar.png"}
                                loading="lazy"
                                style={{ borderRadius: '50%' }}
                            />
                            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                            <span>{renderedCellValue}</span>
                        </Box>
                    )
                },
            },
            {
                accessorKey: 'desc',
                header: 'Description',
                size: 250,
                input: {
                    multiline: true,
                    required: true,
                },
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 150,
                input: {
                    type: "tel", //no updown arrow this way lol
                    required: true,
                    validator: (value) => value > 0 && numberReg.test(value),
                    errorMessage: "Number format incorrect"
                },
            },
            {
                accessorKey: 'producttype',
                header: 'Type',
                size: 200,
                input: {
                    optionList: rawType,
                    optionValueAccessorFn: (value) => value.id,
                    optionLabelAccessorFn: (value) => value.name,
                    required: true,
                },
                Cell: ({ cell }) => (
                    <Box>
                        {rawType.find((e) => e.id == cell.getValue()).name}
                    </Box>
                ),
            },
            {
                accessorKey: "origin",
                header: "Origin",
                size: 200,
                input: {
                    optionList: rawOrigin,
                    optionValueAccessorFn: (value) => value.id,
                    optionLabelAccessorFn: (value) => value.name,
                    required: true,
                },
                Cell: ({ cell }) => (
                    <Box>
                        {rawOrigin.find((e) => e.id == cell.getValue()).name}
                    </Box>
                ),
            }

        ], [validationErrors],
    );
    const validateRecord = useRecordValidation(columns)

    const [images, setImages] = useState([]);
    const editForm = useRef({})

    const editPrompt = ({ table, row, internalEditComponents }) => 
        <EditPrompt table={table} columns={columns} tableName={tableName} row={row} setImages={setImages} images={images} editForm={editForm}></EditPrompt>

    const createForm = useRef({})

    const createPrompt = ({ table, row, internalEditComponents }) => {

        const onImageUploadChange = (imageList, addUpdateIndex) => {
            // data for submit
            setImages(imageList);
            onFormValueChange({
                target: {
                    name: "image",
                    value: imageList[0]?.data_url || null
                }
            })
        };

        const onFormValueChange = (e) => {
            createForm.current = { ...createForm.current, [e.target.name]: e.target.value }
            console.log(createForm.current)
        }

        return (
            <>
                <DialogTitle variant="h4">Create New {tableName || "Record"}</DialogTitle>
                <Divider />
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <Stack direction="row" gap="1rem">
                        <ImageUpload
                            images={images}
                            maxNumber={1}
                            onChange={onImageUploadChange}
                        ></ImageUpload>
                    </Stack>
                    {
                        columns.slice(0, 4).map((col, i) =>
                            <TableColumnEditField key={i}
                                col={col}
                                onChange={onFormValueChange}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors} />
                        )
                    }
                    <Stack gap="1rem" direction="row" width={1}>
                        {
                            columns.slice(4, 6).map((col, i) =>
                                <TableColumnEditField key={i}
                                    col={col}
                                    onChange={onFormValueChange}
                                    validationErrors={validationErrors}
                                    setValidationErrors={setValidationErrors} />
                            )
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        )
    }

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are dawdwadwadw sure you want to delete this user?')) {
            deleteRecord(row.original.id);
        }
    };

    return (
        <Table
            setValidationErrors={setValidationErrors}
            fetchedRecords={fetchedRecords}

            createPrompt={createPrompt}
            editPrompt={editPrompt}
            openDeleteConfirmModal={openDeleteConfirmModal}

            createRecord={createRecord}
            updateRecord={updateRecord}
            deleteRecord={deleteRecord}

            isLoadingError={isLoadingError}
            isLoadingRecords={isLoadingRecords}
            isCreatingUser={isCreatingRecord}
            isUpdatingRecords={isUpdatingRecord}
            isDeletingRecords={isDeletingRecord}
            isFetchingRecords={isFetchingRecords}

            validateRecord={validateRecord}
            columns={columns}
            tableName={tableName}
            handleCreate={handleCreate}
            handleSave={handleSave}
            initialState={{
                columnVisibility: { image: false }
            }}

        >
        </Table>
    )
}

const queryClient = new QueryClient()

export default function ProductTable() {
    return (
        <QueryClientProvider client={queryClient}>
            <RawProductTable />
        </QueryClientProvider>
    )
}

function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            //send api update request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo) => {
            queryClient.setQueryData(['users'], (prevUsers) => [
                ...prevUsers,
                {
                    ...newUserInfo,
                    id: (Math.random() + 1).toString(36).substring(7),
                },
            ]);
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

function useGet() {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            //send api request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve(products);
        },
        refetchOnWindowFocus: false,
    });
}

function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (user) => {
            //send api update request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newUserInfo) => {
            queryClient.setQueryData(['users'], (prevUsers) =>
                prevUsers?.map((prevUser) =>
                    prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
                ),
            );
        },
        //onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId) => {
            //send api update request here
            await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (userId) => {
            queryClient.setQueryData(['users'], (prevUsers) =>
                prevUsers?.filter((user) => user.id !== userId),
            );
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

