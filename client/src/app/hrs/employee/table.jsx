import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import {
    DataGrid,
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
import { useTheme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { SpeakerSharp } from '@mui/icons-material';

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

function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}

function CustomColumnResizeIcon(k, r, keeee) {

    const theme = useTheme()
    
    const key =  useRef(k)
    const ref =  useRef(r)

    var keyDown = false
    var x = 0
    var width = 0

    useEffect(() => {
        /*
        if (!key) {
            const temp = pCols.shift()
            if (temp) {
                setKey(temp)
                setKey(columns.length - pCols.length - 1)
            }
            else
                pCols.unshift(temp)
        }*/
        
    },[])

    const handleMouseDown = (e) => {
        console.log(keeee, keeee % columns.length, key.current)
        x = e.clientX
        width = key.current.width
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mousemove', handleMouseMove)
    }
    const handleMouseMove = (e) => {

        console.log(e.clientX)
        key.current.width = width + e.clientX - x
        ref.current()
    }
    const handleMouseUp = (e) => {
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('mousemove', handleMouseMove)
    }

    return (
        <div onMouseDown={handleMouseDown} style={{ height: "100%", display: "flex", alignItems: "center" }}>
            <GridSeparatorIcon
                sx={{
                    cursor: "col-resize",
                    "&:hover": {
                        color: theme.palette.primary.main
                    }
                }}
            />
        </div>
    )
}

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  

function Header() {

}

function Table() {

}

function Row() {

}


const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
];
/*
columns.forEach((e) => {
    if(!e.valueGetter){
        e.valueGetter = (params) =>`${params.row[e.field] || '——'}`
    }
})
*/
const pCols = [...columns]

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    { id: 10, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export function DataGridExample() {
    const theme = useTheme()

    const [cols, setColumns] = useState(columns)

    const [selectable, setSelectable] = useState(false)
    const [editable, setEditable] = useState(false)

    var key = 0

    useEffect(() => {
    },[])

    
    const SetSeparators = function(){
        var k = Math.floor(key / 2) % columns.length
        /*
        if(separators.current.length === 0){
            columns.forEach((e) => {
                CustomColumnResizeIcon(e, RefreshCols)
            })
        }
        */
        console.log(key,k, columns[k])
        key++
        return CustomColumnResizeIcon(columns[k], RefreshCols, key)
        /*
        const temp = columns[Math.floor(key++/2)]
        console.log(key)
        return CustomColumnResizeIcon(temp, RefreshCols)
        */
    }
    const RefreshCols = function(){
        console.log(columns)
        setColumns([...columns])
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                sx={{ border: 0 }}
                rows={rows}
                columns={cols}
                pagination
                slots={{
                    pagination: CustomPagination,
                    columnResizeIcon: SetSeparators,
                    toolbar: CustomToolbar,
                }}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                loading = {false}
                pageSizeOptions={[5, 10, 25]}

                isCellEditable={editable}

                checkboxSelection={selectable}
                disableRowSelectionOnClick={!selectable}
                isRowSelectable={(p) => selectable}

                disableDensitySelector={false}
            />
        </div>
    );
}