'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from '@mui/material';
import { data } from './makeData';
import { TableEditTextFieldProps } from '@/components/Table'
import Table from '@/components/Table'
import { MRT_EditActionButtons } from 'material-react-table';
import ImageUploading from 'react-images-uploading';
import ImageUpload from '@/components/ImageUpload';
import { images } from '../../../next.config';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';



function TextInputField(props) {
    const { onChange } = props
    const { label, variant, size, type, name, required, multiline } = props
    const { InputProps, fullWidth } = props
    const { ...others } = props

    return (
        <TextField
            key={name}
            label={label}
            variant={variant}
            size={size || "small"}
            type={type}
            name={name}
            required={required}
            onChange={onChange}
            fullWidth={fullWidth}
            multiline={multiline}
            InputProps={{
                ...InputProps,
            }}
            {...others}

        />
    )
}

function TableColumnEditField(props) {
    const { col, validationErrors, setValidationErrors, onChange } = props
    if (col.input) {
        var input = col.input
        return (
            <TextInputField
                key={col.accessorKey}
                label={col.header}
                name={col.accessorKey}
                required={input.required}
                type={input.type}
                variant={input.variant || "standard"}
                fullWidth={false}
                multiline={input.multiline}
                InputProps={input.InputProps}

                onChange={onChange}

                error={!!validationErrors?.[col.accessorKey]}
                helperText={validationErrors?.[col.accessorKey]}
                onFocus={() =>
                    setValidationErrors({
                        ...validationErrors,
                        [col.accessorKey]: undefined,
                    })}
            />
        )
    }
}

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
            {(!value && !edit) && <TextInputField value={"——"} />}
        </>
    )
}

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
        console.log("Table rendered")
        setValidators([])
        columns.forEach((c) => {
            if (c.input?.required) {
                setValidators(prev => [
                    ...prev,
                    (r) => ({ [c.accessorKey]: !validateRequired(r[c.accessorKey]) ? `${c.header} is Required` : '' })
                ])
            }
        })
        console.log("Table rendered", "errors", validators)
    }, [columns])

    return validateRecord
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
        console.log(values)
        const newValidationErrors = validateRecord(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateRecord(values);
        table.setEditingRow(null); //exit editing mode
    };


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
                    multiline: true,
                    required: true,
                },
                Cell: ({ renderedCellValue, row }) => (
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
                            src="/image/avatar.png"
                            loading="lazy"
                            style={{ borderRadius: '50%' }}
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
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
                accessorKey: 'producttype_name',
                header: 'Type',
                size: 150,
            },

        ], [validationErrors],
    );
    const validateRecord = useRecordValidation(columns)


    const editPrompt = ({ table, row, internalEditComponents }) => (
        <>
            <DialogTitle variant="h4">Edit {tableName || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
                <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
        </>
    )


    const createForm = useRef({})
    const [images, setImages] = useState([]);

    const createPrompt = ({ table, row, internalEditComponents }) => {


        const onImageUploadChange = (imageList, addUpdateIndex) => {
            // data for submit
            console.log(imageList, addUpdateIndex);
            setImages(imageList);
            onFormValueChange({
                target: {
                    name: "image",
                    value: imageList
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
                        <Stack gap="1rem" direction="">
                        </Stack>
                    </Stack>
                    {
                        columns.map((col, i) =>
                            <TableColumnEditField key={i}
                                col={col}
                                onChange={onFormValueChange}
                                validationErrors={validationErrors}
                                setValidationErrors={setValidationErrors} />
                        )
                    }
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
            return Promise.resolve(data);
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
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
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

