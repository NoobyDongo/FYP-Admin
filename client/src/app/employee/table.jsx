import * as React from 'react';
import dayjs from 'dayjs';
import {
    DataGrid,
    GridRowModes,
    GridActionsCellItem,
    GridRowEditStopReasons,
    gridPageCountSelector,
    GridPagination,
    GridSeparatorIcon,
    useGridApiContext,
    useGridSelector,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport
} from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Box, Divider, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from '@emotion/react';
import Modal from '@mui/material/Modal';

function Pagination({ page, onPageChange, className }) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <MuiPagination
            color="primary"
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => {
                onPageChange(event, newPage - 1);
            }}
        />
    );
}

var id = 11
const initialRows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, joinDate: Date(), role: 'Market' },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42, joinDate: Date(), role: 'Market' },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45, joinDate: Date(), role: 'Market' },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16, joinDate: Date(), role: 'Market' },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null, joinDate: Date(), role: 'Market' },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150, joinDate: Date(), role: 'Market' },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44, joinDate: Date(), role: 'Market' },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36, joinDate: Date(), role: 'Market' },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: 10, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
    { id: id++, lastName: 'Roxie', firstName: 'Harvey', age: 65, joinDate: Date(), role: 'Market' },
];


function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}

function CustomToolbar(props) {
    const { setInCreation } = props;
    return (
        <GridToolbarContainer sx={{ mb: 2 }}>
            <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={() => setInCreation(true)}>
                Add record
            </Button>
            <GridToolbarColumnsButton sx={{ ml: "auto" }} />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}


function EditPrompt(props) {
    const { setRows, setRowModesModel } = props;
    const { open, setOpen } = props;

    const [id, setId] = React.useState(1)
    const [fname, setFName] = React.useState("fragile")
    const [lname, setLName] = React.useState("banana")
    console.log(fname)
    console.log(lname)

    const theme = useTheme()

    const newRecord = () => {
        setId(id + 1)
        console.log(fname)
        if (true) {
            setRows((oldRows) => [...oldRows, { id: "+ " + id, firstName: fname, lastName: lname, age: '', isNew: true }]);
            setRowModesModel((oldModel) => ({
                ...oldModel,
                [id]: { mode: GridRowModes.View, fieldToFocus: 'name' },
            }));
            setOpen(false)
        }
    }

    return (
        <Modal
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: 'center',
            }}
            slotProps={{
                backdrop: { sx: { backdropFilter: "blur(5px) brightness(80%) saturate(200%)" } }
            }}
            open={open}
        >
            <Paper sx={{ minWidth: "90vw", minHeight: "90vh", outline: "none", position: "relative" }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 3
                }}>
                    <Typography sx={{ display: "inline-block" }} variant="h5">New Record</Typography>
                    <IconButton sx={{ ml: "auto" }} onClick={() => { setOpen(false) }}>
                        <CancelIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ borderColor: theme.palette.background.default }} />

                <Stack gap={3} sx={{ padding: 3 }}>
                    <Stack gap={3}>


                        <TextField
                            label="Firstname"
                            variant="outlined"
                            type="text"
                            onChange={(e) => setFName(e.target.value)}
                            fullWidth

                            InputProps={{
                                disableUnderline: true
                            }}
                        />
                        <TextField
                            label="Lastname"
                            variant="outlined"
                            type="text"
                            onChange={(e) => setLName(e.target.value)}
                            fullWidth
                        />

                    </Stack>
                    <Stack direction="row" gap={2}>
                    </Stack>
                </Stack>

                <Box position="absolute" bottom={0} sx={{
                    height: "max-content",
                    width: 1,
                }}>
                    <Stack direction="row-reverse" gap={2} sx={{ padding: 2, px: 3 }}>
                        <Button variant='contained' onClick={newRecord}>Save Record</Button>
                    </Stack>
                </Box>

            </Paper>
        </Modal>
    )
}

export function DataGridExample({ height }) {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const [inCreation, setInCreation] = React.useState(false)

    /*
        const setCookie = (num) => {
            cookieStore.set("tableRowPerPage", num)
        }
    */
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'id', headerName: 'ID', editable: false, width: 100 },
        { field: 'firstName', headerName: 'First name', editable: true, width: 130 },
        { field: 'lastName', headerName: 'Last name', editable: true, width: 130 },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'Fullname',
            sortable: false,
            editable: false,
            width: 160,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            editable: true,
            headerAlign: 'left',
            align: "left",
            width: 90,
        },
        {
            field: 'joinDate',
            headerName: 'Join date',
            type: 'date',
            width: 180,
            editable: true,
            valueFormatter: (params) => dayjs(params.value).format('DD/MM/YYYY'),
        },
        {
            field: 'role',
            headerName: 'Department',
            width: 220,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Market', 'Finance', 'Development'],
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            headerAlign: 'center',
            align: "center",
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            key={123}
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            key={124}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            key={125}
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        key={126}
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={127}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        key={128}
                        icon={<CancelIcon />}
                        label="Cancel"
                        className="textPrimary"
                        onClick={handleCancelClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <div>
            <EditPrompt open={inCreation} setOpen={setInCreation} setRows={setRows} setRowModesModel={setRowModesModel}></EditPrompt>
            <DataGrid
                sx={{
                    border: 0,
                    "& .MuiDataGrid-columnHeadersInner": {
                        width: "100%"
                    },
                    '& .MuiDataGrid-iconSeparator:last-child': {
                        display: "none"
                    },
                    "& .MuiDataGrid-cell:nth-last-child(2)": {
                        position: "absolute",
                        background: "transparent",
                        right: 0,
                        transform: "translateX(100%)"
                    },
                    "& .MuiDataGrid-columnHeader:last-child": {
                        position: "absolute",
                        background: "transparent",
                        zIndex: -1,
                        right: 0,
                    },
                }}
                pagination
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    }
                }}
                loading={false}
                pageSizeOptions={[5, 10, 15, 20]}
                rows={rows}
                autoHeight
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    pagination: CustomPagination,
                    toolbar: CustomToolbar,
                }}
                slotProps={{
                    toolbar: { setInCreation }
                }}
            />
        </div>
    );
}