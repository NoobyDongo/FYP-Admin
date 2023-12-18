'use client'
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Table from './Table';
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import { Box } from '@mui/material';
import { data } from './makeData';

export default function TableExample() {
    const [validationErrors, setValidationErrors] = useState({});

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                enableClickToCopy: true,
                size: 120,
            },
            {
                accessorKey: 'firstName', //hey a simple column for once
                header: 'First Name',
                size: 150,
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    error: !!validationErrors?.firstName,
                    helperText: validationErrors?.firstName,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            firstName: undefined,
                        }),
                },
            },
            {
                accessorKey: 'lastName', //hey a simple column for once
                header: 'Last Name',
                size: 150,
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    error: !!validationErrors?.lastName,
                    helperText: validationErrors?.lastName,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            lastName: undefined,
                        }),
                },
            },
            {
                accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
                id: 'name', //id is still required when using accessorFn instead of accessorKey
                header: 'Name',
                enableClickToCopy: true,
                enableEditing: false,
                size: 250,
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
                accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
                header: 'Email',
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                size: 300,
                muiEditTextFieldProps: {
                    type: 'email',
                    required: true,
                    error: !!validationErrors?.email,
                    helperText: validationErrors?.email,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            email: undefined,
                        }),
                },
            },
            {
                accessorKey: 'salary',
                // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
                filterFn: 'between',
                header: 'Salary',
                size: 200,
                //custom conditional format and styling
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue() < 50_000
                                    ? theme.palette.error.dark
                                    : cell.getValue() >= 50_000 && cell.getValue() < 75_000
                                        ? theme.palette.warning.dark
                                        : theme.palette.success.dark,
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {cell.getValue()?.toLocaleString?.('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </Box>
                ),
                muiEditTextFieldProps: {
                    type: 'number',
                    required: true,
                    error: !!validationErrors?.salary,
                    helperText: validationErrors?.salary,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            salary: undefined,
                        }),
                },
            },
            {
                accessorKey: 'jobTitle', //hey a simple column for once
                header: 'Job Title',
                size: 350,
                muiEditTextFieldProps: {
                    type: 'text',
                    required: true,
                    error: !!validationErrors?.jobTitle,
                    helperText: validationErrors?.jobTitle,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            jobTitle: undefined,
                        }),
                },
            },
            {
                accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
                id: 'startDate',
                header: 'Start Date',
                filterVariant: 'date',
                filterFn: 'lessThan',
                sortingFn: 'datetime',
                Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
                Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
                muiFilterTextFieldProps: {
                    sx: {
                        minWidth: '250px',
                    },
                },
                muiEditTextFieldProps: {
                    type: 'date',
                    required: true,
                    error: !!validationErrors?.date,
                    helperText: validationErrors?.date,
                    //remove any previous validation errors when user focuses on the input
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            date: undefined,
                        }),
                },
            },
        ], [validationErrors],
    );

    return (

        <QueryClientProvider client={queryClient}>
            <Table
                queryClient={queryClient}
                useCreate={useCreate}
                useGet={useGet}
                useDelete={useDelete}
                useUpdate={useUpdate}
                setValidationErrors={setValidationErrors}
                validateRecord={validateRecord}
                columns={columns}
            >
            </Table>
        </QueryClientProvider>
    )
}

//CREATE hook (post new user to api)
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

//READ hook (get users from api)
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

//UPDATE hook (put user in api)
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

//DELETE hook (delete user in api)
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

const queryClient = new QueryClient();

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateRecord(user) {
    return {
        firstName: !validateRequired(user.firstName)
            ? 'First Name is Required'
            : '',
        lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
        email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    };
}