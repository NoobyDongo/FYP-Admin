'use client'
import Button from '@mui/material/Button'

import {
    useMaterialReactTable,
    MaterialReactTable,
} from 'material-react-table'

import React from 'react'
import CRUD from '@/utils/crud/crud'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import CachedIcon from '@mui/icons-material/Cached'
import useGlobalFilter from './utils/filters/useGlobalFilter'
import useCustomTableProps from './utils/tableProps'
import useCreateEditDeletePrompts from '../Prompt/useCreateEditDeletePrompts'
import FadeWrapper from '../FadeWrapper'
import useCustomTransition from '../../utils/hooks/useCustomTransition'
import GET from '@/utils/crud/get'

function usePagenation(dependency = []) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 15,
    })
    //const [, setPagination] = useCustomTransition(_setPagination)
    React.useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: pagination.pageSize,
        })
    }, dependency)

    return [pagination, setPagination]
}

const totalRowReq = {
    method: 'GET',
    option: "count"
}
function useTotalRowCount(tablename) {
    return GET('/api/record/' + tablename, totalRowReq)
}

/*
async function getCount(tablename) {
    let api = dataFn('api/record/')
    let res = await api({
        method: 'GET',
        option: "count"
    })
    return Number(res)
}
*/

function useRowCount(data, pagination, setPagination, valid) {
    const rowCount = React.useMemo(() => data?.totalElements || 0, [data])
    const [noRecord, setNoRecord] = React.useState(true)
    const lastRowCount = React.useMemo(() => rowCount, [pagination, rowCount > 0])
    //console.log("rowCount", rowCount, "lastRowCount", lastRowCount)

    React.useEffect(() => {
        if (noRecord && rowCount > 0)
            setNoRecord(false)
        let size = pagination.pageSize
        let index = pagination.pageIndex
        let max = Math.ceil(rowCount / size)
        if (valid)
            if (rowCount > size && lastRowCount > 0) {
                if (index * size > rowCount)
                    index = max - 1
                setPagination({
                    pageIndex: index,
                    pageSize: size,
                })
            }
    }, [rowCount])

    return [rowCount, noRecord]
}

const RawTable = (props) => {
    const enableSelection = false
    console.log('Table Rendered')

    const { columns, initialState, tableName, crud, baseSearchCriteria, mini = false } = props

    const getStorage = (key, defaultValue) => {
        try {
            return JSON.parse(sessionStorage.getItem(key + '_' + tableName)) || defaultValue
        } catch (err) {
            return defaultValue
        }
    }
    const setStorage = (key, value) => {
        sessionStorage.setItem(key + '_' + tableName, JSON.stringify(value))
    }

    const [columnFilters, _setColumnFilters] = React.useState(
        baseSearchCriteria ?
            [...getStorage('mrt_columnFilters', []), baseSearchCriteria] :
            [...getStorage('mrt_columnFilters', [])]
    )
    const [columnVisibility, _setColumnVisibility] = React.useState(
        initialState?.columnVisibility ?
            { ...getStorage('mrt_columnVisibility', {}), ...initialState.columnVisibility } :
            { ...getStorage('mrt_columnVisibility', {}) }
    )
    const [density, _setDensity] = React.useState(
        getStorage('mrt_density', 'comfortable')
    )
    const [rawGlobalFilter, __setGlobalFilter] = React.useState(
        getStorage('mrt_globalFilter', '')
    )
    const [showGlobalFilter, _setShowGlobalFilter] = React.useState(
        getStorage('mrt_showGlobalFilter', false)
    )
    const [showColumnFilters, _setShowColumnFilters] = React.useState(
        getStorage('mrt_showColumnFilters', false)
    )
    const [sorting, _setSorting] = React.useState(
        getStorage('mrt_sorting', [])
    )

    const globalFilter = useGlobalFilter(columns, columnVisibility, rawGlobalFilter)
    const [, _setGlobalFilter] = useCustomTransition(__setGlobalFilter)

    const setColumnFilters = React.useCallback((value) => {
        _setColumnFilters(prev => {
            let res = value(prev)
            setStorage(
                'mrt_columnFilters', res || []
            );
            return res
        })
    }, []);
    const setColumnVisibility = React.useCallback((value) => {
        _setColumnVisibility(prev => {
            let res = value(prev)
            setStorage(
                'mrt_columnVisibility', res || {}
            );
            return res
        })
    }, []);
    const setDensity = React.useCallback((value) => {
        _setDensity(value)
        setStorage(
            'mrt_density', value
        );
    }, []);
    const setGlobalFilter = React.useCallback((value) => {
        _setGlobalFilter(value)
        setStorage(
            'mrt_globalFilter', value ?? '',
        );
    }, []);
    const setShowGlobalFilter = React.useCallback((value) => {
        _setShowGlobalFilter(value)
        setStorage(
            'mrt_showGlobalFilter', value
        );
    }, []);
    const setShowColumnFilters = React.useCallback((value) => {
        _setShowColumnFilters(value)
        setStorage(
            'mrt_showColumnFilters', value
        );
    }, []);
    const setSorting = React.useCallback((value) => {
        _setSorting(value)
        setStorage(
            'mrt_sorting', value
        );
    }, []);

    const [pagination, setPagination] = usePagenation([columnFilters, rawGlobalFilter, sorting])


    const [useCreate, useGet, useUpdate, useDelete] = CRUD(
        { tableName, ...crud }, false,
        { pagination, columnFilters, globalFilter, sorting })

    const { mutateAsync: createRecord, isPending: isCreatingRecord } = useCreate()
    const { data: fetchedRecords = [], isError, isFetching = true, isLoading = true, refetch } = useGet()
    const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useUpdate()
    const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useDelete()

    const data = React.useMemo(() => (fetchedRecords?.content || []), [fetchedRecords])

    const { data: totalRowCount } = useTotalRowCount(tableName)

    const [rowCount, noRecord] = useRowCount(fetchedRecords, pagination, setPagination,
        columnFilters.length < 1 && !rawGlobalFilter && sorting.length < 1)



    const renderEmptyRowsFallback = React.useCallback(({ table }) => {
        return (
            <Fade in={table.getState().noRow && !table.getState().isLoading && !table.getState().isFetching} style={{ transitionDelay: '200ms' }} timeout={300} mountOnEnter unmountOnExit>
                <Stack sx={{
                    pt: 10,
                    pb: 10,
                    width: 1,
                    height: 1,
                    userSelect: 'none',
                    justifyContent: "center",
                    alignItems: 'center',
                    gap: 2,
                }} className='norecord'>
                    <Typography variant="body" fontStyle="italic" align="center" color="textSecondary">
                        No record to display
                    </Typography>
                    {table.getState().noRecord && !table.getState().searching &&
                        <Button variant="outlined" endIcon={<CachedIcon />} onClick={refetch}>fetch again</Button>
                    }
                </Stack>
            </Fade>
        )
    }, [refetch])

    const toCreate = React.useCallback(() => {
        window.dispatchEvent(new CustomEvent('openPrompt', { detail: { type: 'create', tableName } }))
    }, [tableName])

    const toEdit = React.useCallback((record) => {
        window.dispatchEvent(new CustomEvent('openPrompt', { detail: { type: 'edit', tableName, record } }))
    }, [tableName])

    const toDelete = React.useCallback((record) => {
        window.dispatchEvent(new CustomEvent('openPrompt', { detail: { type: 'delete', tableName, record } }))
    }, [tableName])

    const { renderTopToolbar, ...tableProps } = useCustomTableProps({
        initialState,
        pagination,
        setPagination,
        rowCount,
        enableSelection,
        toCreate,
        toEdit,
        toDelete,
        mini,
    })

    const [isFullScreen, setIsFullScreen] = React.useState(false)

    const table = useMaterialReactTable({
        columns: columns,
        rowCount: rowCount,
        data: isFetching ? [] : data,
        ...tableProps,

        enableTopToolbar: isFullScreen,
        ...isFullScreen && {
            renderTopToolbar
        },

        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        enableFilterMatchHighlighting: false,

        //onShowGlobalFilterChange: setShowSearchBar,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,

        onDensityChange: setDensity,
        onShowColumnFiltersChange: setShowColumnFilters,
        onShowGlobalFilterChange: setShowGlobalFilter,

        onIsFullScreenChange: setIsFullScreen,

        renderEmptyRowsFallback,
        muiToolbarAlertBannerProps: isError ? { color: 'error', children: 'Error loading data', } : undefined,

        state: {
            ...props.state,

            columnFilters,
            columnVisibility,
            density,
            showColumnFilters,
            showGlobalFilter,
            sorting,

            globalFilter: rawGlobalFilter,
            pagination,
            columnVisibility,
            isFullScreen,
            totalRowCount,
            rowCount,
            searching: columnFilters.length > 0 || rawGlobalFilter,
            noRecord: noRecord,
            noRow: rowCount < 1,

            //showGlobalFilter: !noRecord && showSearchBar,
            isLoading: isLoading || isFetching,
            isSaving: isCreatingRecord || isUpdatingRecord || isDeletingRecord,
            showAlertBanner: isError,
            //showProgressBars: isFetching || isCreatingRecord || isUpdatingRecord || isDeletingRecord,
        },
    })

    return [(
        <>
            <div className='MuiPaper-root'>
                {renderTopToolbar({ table })}
                <FadeWrapper variants={{
                    initial: { scale: 1, opacity: 0 },
                }} transition={{ duration: .35 }}>
                    <MaterialReactTable table={table} />
                </FadeWrapper>
            </div>
        </>
    ), createRecord, updateRecord, deleteRecord] 
}

export default function CrudTable(props) {
    const { inputs, upload = false, ...others } = props

    const [Table, createRecord, updateRecord, deleteRecord] = RawTable(others)

    const { CreatePrompt, EditPrompt, toCreate, toEdit, toDelete } = useCreateEditDeletePrompts({
        inputs, upload, createRecord, updateRecord, deleteRecord
    })

    React.useEffect(() => {
        const openPrompt = (e) => {
            const { type, record } = e.detail
            if (type === 'create')
                toCreate()
            if (type === 'edit')
                toEdit(record)
            if (type === 'delete')
                toDelete(record)
        }
        window.addEventListener('openPrompt', openPrompt)
        return () => {
            window.removeEventListener('openPrompt', openPrompt)
        }
    }, [])

    return (
        <>
            {Table}
            {CreatePrompt}
            {EditPrompt}
        </>
    )
}


