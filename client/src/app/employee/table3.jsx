'use client'
import { useMemo, useState } from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Tooltip,
    ListItemIcon,
    MenuItem,
    Typography,
    lighten,
} from '@mui/material';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
//MRT Imports
import {
    MRT_EditActionButtons,
    MaterialReactTable,
    useMaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleGlobalFilterButton,
    MRT_ToggleFullScreenButton,
    MRT_ShowHideColumnsButton,
} from 'material-react-table';

import { data } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import { useTheme } from '@emotion/react';

const Example = () => {
    const [validationErrors, setValidationErrors] = useState({});
    const theme = useTheme()

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

    //call CREATE hook
    const { mutateAsync: createUser, isPending: isCreatingUser } =
        useCreateUser();
    //call READ hook
    const {
        data: fetchedUsers = [],
        isError: isLoadingUsersError,
        isFetching: isFetchingUsers,
        isLoading: isLoadingUsers,
    } = useGetUsers();
    //call UPDATE hook
    const { mutateAsync: updateUser, isPending: isUpdatingUser } =
        useUpdateUser();
    //call DELETE hook
    const { mutateAsync: deleteUser, isPending: isDeletingUser } =
        useDeleteUser();

    //CREATE action
    const handleCreateUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createUser(values);
        table.setCreatingRow(null); //exit creating mode
    };

    //UPDATE action
    const handleSaveUser = async ({ values, table }) => {
        const newValidationErrors = validateUser(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateUser(values);
        table.setEditingRow(null); //exit editing mode
    };

    //DELETE action
    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedUsers,
        initialState: {
            columnVisibility: {
                firstName: false,
                lastName: false
            },
            showColumnFilters: false,
            showGlobalFilter: true,
            columnPinning: {
                right: ['startDate']
            }
        },
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: true,
        enableColumnResizing: true,
        enableBottomToolbar: true,
        enableStickyHeader: true,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing: true,
        layoutMode: "semantic",
        paginationDisplayMode: 'pages',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiPaginationProps: {
            sx: {
                pd: 0
            },
            color: 'primary',
            rowsPerPageOptions: [10, 20, 30],
            variant: 'filled',
        },
        muiTableHeadCellProps: {
            sx: {
                overflow: "hidden",
                boxShadow: "none",
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                    position: 'absolute',
                    right: 0,
                },
            }
        },
        muiTableContainerProps: ({ table }) => ({
            style: {
                overflow: "auto",
                //height of the top toolbar and the bottom one...
                maxHeight: table.getState().isFullScreen ? `calc(100% - ${40 + 56}px)` : '100%',
            },
        }),
        muiTablePaperProps: ({ table }) => ({
            //not sx
            elevation: theme.palette.mode == "dark" ? 1 : 0,
            sx: {
                transition: 'none',
                backgroundColor: table.getState().isFullScreen ? theme.palette.background.default : 'transparent',
            },
            style: {
                overflow: "auto",
                //height of the sticky header
                maxHeight: table.getState().isFullScreen ? `calc(100% - ${35}px)` : '100%',
                zIndex: table.getState().isFullScreen ? 1200 : undefined,
            },
        }),

        muiBottomToolbarProps: {
            sx: {
                transition: 'none',
            }
        },

        muiTableBodyRowProps: {
            sx: {
                backgroundColor: 'transparent',
            }
        },
        muiTableBodyCellProps: {
            sx: {
                border: "none",
                boxShadow: "none"
            }
        },
        getRowId: (row) => row.id,
        muiToolbarAlertBannerProps: isLoadingUsersError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateUser,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveUser,
        //optionally customize modal content
        renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Create New User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderDetailPanel: ({ row }) => (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Pending</Typography>
                </Box>
            </Box>
        ),
        //optionally customize modal content
        renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
            <>
                <DialogTitle variant="h3">Edit User</DialogTitle>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    {internalEditComponents} {/* or render custom edit components here */}
                </DialogContent>
                <DialogActions>
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </DialogActions>
            </>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
        renderTopToolbar: ({ table }) => {

            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        display: 'flex',
                        gap: '0.5rem',
                        py: 2,
                        px: 2,
                        justifyContent: 'space-between',
                    })}
                >
                    <Box sx={{ display: 'flex', gap: '0.5rem', height: "fit-content", alignItems: 'top' }}>
                        {/* import MRT sub-components */}

                        <Button
                            variant="contained"
                            onClick={() => {
                                table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                                //or you can pass in a row object to set default values with the `createRow` helper function
                                // table.setCreatingRow(
                                //   createRow(table, {
                                //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                                //   }),
                                // );
                            }}
                        >
                            Create New User
                        </Button>
                        <MRT_ToggleGlobalFilterButton table={table} />
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                        <MRT_ToggleFullScreenButton table={table} />
                    </Box>
                    <Box>
                        <Box sx={
                            {
                                display: 'flex', gap: '0.5rem', alignItems: "center",
                                "& > .MuiButtonBase-root": {
                                    height: "fit-content",
                                    paddingBlock: .45,
                                    paddingInline: 1,
                                    fontSize: 13
                                },
                                "& .MuiFormLabel-root": {
                                    fontSize: 14
                                },
                                "& #mrt-rows-per-page": {
                                    paddingLeft: 1,
                                    paddingBlock: .5
                                },
                                "& .MuiTablePagination-root": {
                                    padding: 0
                                }
                            }
                        }>

                            <MRT_TablePagination table={table} />
                        </Box>
                        <Box sx={
                            {
                                display: 'flex', gap: '0.5rem', alignItems: "center", justifyContent: "flex-end",
                            }
                        }>
                        </Box>
                    </Box>
                </Box>
            );
        },
        state: {
            isLoading: isFetchingUsers,
            isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
            showAlertBanner: isLoadingUsersError,
            showProgressBars: isFetchingUsers,
        },
    });

    return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
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
function useGetUsers() {
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
function useUpdateUser() {
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
function useDeleteUser() {
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


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExampleWithProviders = () => (
    //Put this with your other react-query providers near root of your app
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
            <Example />
        </QueryClientProvider>
    </LocalizationProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );

function validateUser(user) {
    return {
        firstName: !validateRequired(user.firstName)
            ? 'First Name is Required'
            : '',
        lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
        email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
    };
}
