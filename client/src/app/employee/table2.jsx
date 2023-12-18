import { useMemo } from 'react';

//MRT Imports
import {
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

//Material UI Imports
import {
    Box,
    Button,
    ListItemIcon,
    MenuItem,
    Typography,
    lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

//Mock Data
import { data } from './makeData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Signal } from '@preact/signals-react';

const loadingItems = new Signal(false)

const _Example = () => {

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
                accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
                id: 'name', //id is still required when using accessorFn instead of accessorKey
                header: 'Name',
                enableClickToCopy: true,
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
                enableClickToCopy: true,
                filterVariant: 'autocomplete',
                header: 'Email',
                size: 300,
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
            },
            {
                accessorKey: 'jobTitle', //hey a simple column for once
                header: 'Job Title',
                size: 350,
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
            },
        ],
        [],
    );
    const theme = useTheme()

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: true,
        enableColumnResizing: true,
        enableBottomToolbar: false,
        enableStickyHeader: true,
        initialState: { showColumnFilters: false, showGlobalFilter: true, columnPinning: { right: ['startDate'] } },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
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
            shape: 'round',
            variant: 'filled',
        },
        muiTableProps: {
            sx: {
                maxWidth: "100%",
                backgroundColor: "transparent",
                "& *": {
                    boxShadow: "none !important",
                },
            },
        },
        muiTableHeadCellProps: {
            sx: {
                overflow: "hidden",
                "& .Mui-TableHeadCell-ResizeHandle-Wrapper": {
                    position: 'absolute',
                    right: 0,
                },
            }
        },
        muiTablePaperProps: ({ table }) => ({
            //not sx
            elevation: theme.palette.mode == "dark" ? 1 : 0,
            style: {
                zIndex: table.getState().isFullScreen ? 2000 : undefined,
            },
        }),
        muiTableProps: {
        },
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
        renderRowActionMenuItems: ({ closeMenu }) => [
            <MenuItem
                key={0}
                onClick={() => {
                    // View profile logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                View Profile
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={() => {
                    // Send email logic...
                    closeMenu();
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <Send />
                </ListItemIcon>
                Send Email
            </MenuItem>,
        ],
        renderTopToolbar: ({ table }) => {
            const handleDeactivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('deactivating ' + row.getValue('name'));
                });
            };

            const handleActivate = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('activating ' + row.getValue('name'));
                });
            };

            const handleContact = () => {
                table.getSelectedRowModel().flatRows.map((row) => {
                    alert('contact ' + row.getValue('name'));
                });
            };

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
        }
    });

    return <MaterialReactTable table={table} />;
};

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useTheme } from '@emotion/react';
import Image from 'next/image';

const Example = () => (
    //App.tsx or AppProviders file
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <_Example />
    </LocalizationProvider>
);

export default Example;
