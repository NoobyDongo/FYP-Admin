import * as React from 'react';
import Box from '@mui/material/Box';
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
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45, joinDate: Date(),role: 'Market' },
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
    return (
        <GridToolbarContainer>
            <EditToolbar {...props} />
            <GridToolbarColumnsButton sx={{ml:"auto"}}/>
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}


function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    var oid = 0
    const handleClick = () => {
        const id = "+ " + oid++;
        setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </Button>
    );
}

export function DataGridExample() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
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
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
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
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: "100%",
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                sx={{ 
                    border: 0,
                    maxHeight: "100%",
                }}
                pagination
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    }
                }}
                loading={false}
                pageSize={20} //integer value representing max number of rows
                pageSizeOptions={[5, 10, 15, 25]}
                autoHeight
                rows={rows}
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
                    toolbar: { setRows, setRowModesModel }
                }}
            />
        </Box>
    );
}