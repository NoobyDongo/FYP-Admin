'use client'
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemIcon,
    MenuItem,
    Typography,
    lighten,
    ListItemText,
    Paper,
    Divider,
    alpha,
    Stack,
} from '@mui/material';
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

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const RawTable = (props) => {
    const theme = useTheme()

    const { setValidationErrors, validateRecord } = props
    const { handleSave, handleCreate, createPrompt, editPrompt, openDeleteConfirmModal } = props
    const { createRecord, updateRecord, deleteRecord } = props
    const { columns, initialState, tableName } = props
    const { fetchedRecords } = props
    const { isCreatingRecord, isUpdatingRecord, isDeletingRecord } = props
    const { isFetchingRecords, isLoadingError, isLoadingRecords } = props

    const defaultHandleCreate = async ({ values, table }) => {
        console.log(values)
        const newValidationErrors = validateRecord(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createRecord(values);
        table.setCreatingRow(null); //exit creating mode
    };

    const defaultHandleSave = async ({ values, table }) => {
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
    
    const defaultEditPrompt = ({ table, row, internalEditComponents }) => (
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

    const defaultCreatePrompt = ({ table, row, internalEditComponents }) => (
        <>
            <DialogTitle variant="h4">Create New {tableName || "Record"}</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
                <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
        </>
    )

    const defaultOpenDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteRecord(row.original.id);
        }
    };

    const table = useMaterialReactTable({
        columns,
        data: fetchedRecords,
        initialState: {
            ...initialState,
            showColumnFilters: false,
            showGlobalFilter: true,
        },
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: false,
        enableColumnResizing: true,
        enableBottomToolbar: true,
        enableStickyHeader: true,
        createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
        editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
        layoutMode: "grid-nogrow",
        paginationDisplayMode: 'pages',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined',
        },
        muiEditRowDialogProps: {
            
        },
        muiPaginationProps: {
            sx: {
                pd: 0,
                marginLeft: "auto"
            },
            color: 'primary',
            rowsPerPageOptions: [10, 15, 20, 30, 50],
            variant: 'filled',
        },
        muiTableHeadCellProps: {
            sx: {
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                paddingBottom: ".5rem",
                boxShadow: "none",
                border: 0,
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                    position: 'absolute',
                    right: 0,
                },
            }
        },
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
                zIndex: table.getState().isFullScreen ? 1200 : undefined,
            },
        }),
        muiTableHeadRowProps: {
            sx: {
                borderBottom: 1,
                borderColor: theme.palette.border.main
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
        muiTableFooterProps: {
            sx: {
                outline: "none"
            }
        },
        muiToolbarAlertBannerProps: isLoadingError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Edit', //change "Actions" to "Edit"
                size: 50,
            },
        },
        /*
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
    */
        getRowId: (row) => row.id,
        onCreatingRowCancel: () => setValidationErrors({}),
        onEditingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreate || defaultHandleCreate,
        onEditingRowSave: handleSave || defaultHandleSave,
        renderCreateRowDialogContent: createPrompt || defaultCreatePrompt,
        renderEditRowDialogContent: editPrompt || defaultEditPrompt,

        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Actions', //change "Actions" to "Edit"
                size: 120,
            },
        },
        renderRowActionMenuItems: ({ row }) => [

            <MenuItem key="edit" onClick={() => table.setEditingRow(row)}>
                <ListItemIcon>
                    <EditIcon color='primary' />
                </ListItemIcon>
                <ListItemText primary="Edit" />
            </MenuItem>,

            <MenuItem key="delete" onClick={() => (openDeleteConfirmModal || defaultOpenDeleteConfirmModal)(row)}>
                <ListItemIcon>
                    <DeleteIcon color='error' />
                </ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>,

        ],
        renderBottomToolbar: ({ table }) => {

            return (
                <Paper
                    sx={(theme) => ({
                        px: 2,
                        py: 1.5,
                        borderTop: 1,
                        borderColor: theme.palette.border.main,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'flex-end',
                        gap: '0.5rem',

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
                            paddingBlock: .5,
                            paddingBottom: .3,
                        },
                        "& .MuiTablePagination-root": {
                            padding: 0,
                            paddingLeft: 0,
                            paddingBlock: 0,
                        },
                        "& .MuiTablePagination-root": {
                            justifyContent: "flex-end",
                            padding: 0,
                            width: "100%",
                        }
                    })}
                >
                    <Box sx={(theme) => ({
                        width: "fit-content",
                        whiteSpace: "nowrap",
                        fontSize: 14,
                        marginRight: 4,

                        [theme.breakpoints.down('md')]: {
                            display: "none"
                        },
                    })}>
                        Total Record: <span style={{
                            color: theme.palette.primary.main,
                            fontSize: 16, marginLeft: 8
                        }}>
                            {fetchedRecords.length}</span>
                    </Box>
                    <MRT_TablePagination table={table} />
                </Paper>
            );
        },
        renderTopToolbar: ({ table }) => {

            return (
                <Box
                    sx={(theme) => ({
                        backgroundColor: lighten(theme.palette.background.default, 0.05),
                        padding: 2,
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                    })}
                >
                    <Box sx={{
                        [theme.breakpoints.up('sm')]: {
                            display: 'flex', gap: '0.5rem', height: "fit-content", alignItems: 'center',
                        },
                    }}>

                        <MRT_ToggleGlobalFilterButton sx={{
                            [theme.breakpoints.only('xs')]: {
                                display: 'none',
                            },
                        }} table={table} />
                        <MRT_GlobalFilterTextField table={table} />
                        <MRT_ToggleFiltersButton table={table} />
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />
                        <MRT_ToggleFullScreenButton table={table} />
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            px: 2,
                            py: 1.5,
                        }}
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
                        Create New {tableName || "record"}
                    </Button>
                </Box>
            );
        },
        state: {
            isLoading: isLoadingRecords,
            isSaving: isCreatingRecord || isUpdatingRecord || isDeletingRecord,
            showAlertBanner: isLoadingError,
            showProgressBars: isFetchingRecords,
        },
    });

    return (
        <MaterialReactTable table={table} />
    )
};

export function TableEditTextFieldProps(setValidationErrors, validationErrors, { type, required, name }) {

    return (
        {
            muiEditTextFieldProps: {
                type: type || "text",
                required: required,
                error: !!validationErrors?.[name],
                helperText: validationErrors?.[name],
                //remove any previous validation errors when user focuses on the input
                onFocus: () =>
                    setValidationErrors({
                        ...validationErrors,
                        [name]: undefined,
                    }),
            }
        }
    )
}

const Table = (props) => (
    //Put this with your other react-query providers near root of your app
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RawTable {...props} />
    </LocalizationProvider>
);

export default Table;


