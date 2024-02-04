'use client'
import Button from '@mui/material/Button'

import {
    useMaterialReactTable,
    MaterialReactTable,
} from 'material-react-table'

import React, { useCallback } from 'react'
import CRUD from '@/utils/crud/crud'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import CachedIcon from '@mui/icons-material/Cached'
import useGlobalFilter from './utils/filters/useGlobalFilter'
import useCustomTableProps from './utils/tableProps'
import useCreateEditDeletePrompts from '../Prompt/useCreateEditDeletePrompts'
import dataFn from "@/utils/crud/clientToServer"
import FadeWrapper from '../FadeWrapper'

function usePagenation(dependency = []) {
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 15,
    })
    React.useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: pagination.pageSize,
        })
    }, dependency)

    return [pagination, setPagination]
}

async function getCount(tablename) {
    let api = dataFn('api/record/' + tablename)
    let res = await api({
        method: 'GET',
        option: "count"
    })
    return Number(res)
}

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

    const { columns, inputs, initialState, tableName, crud, render=true, upload = false, baseSearchCriteria, fetchAll = false, mini = false } = props
    const [columnVisibility, setColumnVisibility] = React.useState(initialState?.columnVisibility || {})

    const [columnFilters, setColumnFilters] = React.useState(baseSearchCriteria ? [baseSearchCriteria] : [])
    /*
    const handleOnColumnFiltersChange = React.useCallback((columnFilters) => {
        setColumnFilters(baseSearchCriteria? [baseSearchCriteria, ...columnFilters] : columnFilters)
    }, [columnFilters])
    */
    const [rawGlobalFilter, setGlobalFilter] = React.useState('')
    const [sorting, setSorting] = React.useState([])
    const [pagination, setPagination] = usePagenation([columnFilters, rawGlobalFilter, sorting])

    const globalFilter = useGlobalFilter(columns, columnVisibility, rawGlobalFilter)

    const [useCreate, useGet, useUpdate, useDelete] = CRUD(
        { tableName, ...crud },
        fetchAll,
        { pagination, columnFilters, globalFilter, sorting })

    const { mutateAsync: createRecord, isPending: isCreatingRecord } = useCreate()
    const { data: fetchedRecords = [], isError, isFetching = true, isLoading = true, refetch } = useGet()
    const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useUpdate()
    const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useDelete()

    const data = React.useMemo(() => ((fetchAll ? fetchedRecords : fetchedRecords?.content) || []), [fetchedRecords, columns])

    const [rowCount, noRecord] = useRowCount(fetchedRecords, pagination, setPagination,
        columnFilters.length < 1 && !rawGlobalFilter && sorting.length < 1)

    const { CreatePrompt, EditPrompt, /*DeletePrompt,*/ toCreate, toEdit, toDelete } = useCreateEditDeletePrompts({
        inputs, upload, createRecord, updateRecord, deleteRecord
    })

    const renderEmptyRowsFallback = useCallback(() => {
        return (
            <Fade in={!isLoading && !isFetching} style={{ transitionDelay: '200ms' }} timeout={300} mountOnEnter unmountOnExit>
                <Stack sx={{
                    pt: 10,
                    pb: 20,
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
                    <Button variant="outlined" endIcon={<CachedIcon />} onClick={refetch}>fetch again</Button>
                </Stack>
            </Fade>
        )
    }, [isLoading, isFetching, refetch])

    const { renderTopToolbar, ...tableProps } = useCustomTableProps({
        initialState,
        setPagination,
        rowCount,
        enableSelection,
        toCreate,
        toEdit,
        toDelete,
        noRecord,
        isLoading,
        mini,
    })

    const [isFullScreen, setIsFullScreen] = React.useState(false)

    const table = useMaterialReactTable({
        columns: columns,
        data: data,
        ...tableProps,

        enableTopToolbar: isFullScreen,
        ...isFullScreen && {
            renderTopToolbar
        },

        ...(!fetchAll && {
            manualPagination: true,
            manualFiltering: true,
            manualSorting: true,
            enableFilterMatchHighlighting: false,

            //onShowGlobalFilterChange: setShowSearchBar,
            onColumnVisibilityChange: setColumnVisibility,
            onColumnFiltersChange: setColumnFilters,
            onGlobalFilterChange: setGlobalFilter,
            onSortingChange: setSorting,
        }),
        onIsFullScreenChange: setIsFullScreen,

        renderEmptyRowsFallback,
        muiToolbarAlertBannerProps: isError ? { color: 'error', children: 'Error loading data', } : undefined,

        state: {
            ...props.state,
            ...(!fetchAll && {
                columnFilters,
                globalFilter: rawGlobalFilter,
                isLoading,
                pagination,
                sorting,
                columnVisibility,
            }),
            isFullScreen,

            //showGlobalFilter: !noRecord && showSearchBar,
            isLoading: isLoading,
            isSaving: isCreatingRecord || isUpdatingRecord || isDeletingRecord,
            showAlertBanner: isError,
            //showProgressBars: isFetching || isCreatingRecord || isUpdatingRecord || isDeletingRecord,
        },
    })

    if (render)
        return (
            <>
                <div className='MuiPaper-root'>
                    {renderTopToolbar({ table })}
                    <FadeWrapper variants={{
                        initial: { scale: 1, opacity: 0 },
                    }}
                        transition={{ duration: .35 }}>
                        <MaterialReactTable table={table} />
                    </FadeWrapper>
                </div>
                {CreatePrompt}
                {EditPrompt}
            </>
        )
    else {
        return <></>
    }
}

export default function CrudTable(props) {
    return (
        <RawTable {...props} />
    )
}


