'use client'
import { useEffect, useMemo } from 'react';
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import { Table as rawTable } from '@/components/Table/Table'
import { numberReg } from '@/utils/useRecordValidation';
import { useProgress } from '@/utils/useProgress';
import { useNotification } from '@/components/Notifications/useNotification';
import TableWrapper from '@/components/Table/wrapper';
import { toTableColumns } from '@/components/Table/TableColumnEditField';
import { useAPI, useAPIs } from '@/utils/crud/useAPI';


function Table() {
    const tableName = "product"

    const onCreatingRowCancel = () => { }
    const onEditingRowCancel = () => { }

    console.log("Table rendered")

    const [useCreate, useGet, useUpdate, useDelete] = CRUD({
        tableName: "product",
        simple: true,
        subTable: [
            { name: "producttype", param: { option: "all", simple: false } },
            { name: "origin", param: { option: "all", simple: false } },
        ]
    })
    const { mutateAsync: createRecord, isPending: isCreatingRecord } = useCreate()
    const { data: fetchedRecords = { product: [], pt: [], o: [] }, isError, isFetching = true, isLoading = true, } = useGet()
    const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useUpdate()
    const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useDelete()

    const columns = useMemo(
        () => toTableColumns([
            {
                accessorKey: 'id',
                enableClickToCopy: true,
            },
            {
                accessorKey: 'image',
                input: {
                    type: "image",
                }
            },
            {
                accessorKey: 'name',
                enableClickToCopy: true,
                size: 200,
                display: {
                    type: "imageText",
                    accessorKey: 'image'
                },
                input: {
                    required: true,
                },
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
                accessorKey: 'price',
                header: 'Price',
                enableClickToCopy: true,
                size: 150,
                input: {
                    type: "number",
                    required: true,
                    validator: (value) => value > 0 && numberReg.test(value),
                    errorMessage: "Number format incorrect"
                },
            },
            {
                accessorKey: 'productType',
                header: 'Type',
                size: 200,
                input: {
                    type: "select",
                    simple: true,
                    optionList: fetchedRecords.producttype,
                    required: true,
                    group: 2,
                }
            },
            {
                accessorKey: 'origin',
                size: 200,
                input: {
                    type: "select",
                    simple: true,
                    optionList: fetchedRecords.origin,
                    required: true,
                    group: 2,
                }
            }
        ]), [isLoading])

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            deleteRecord(row.original.id);
        }
    };

    const Table = () => rawTable({
        fetchedRecords: fetchedRecords.product,

        openDeleteConfirmModal,

        createRecord,
        updateRecord,
        deleteRecord,
        onCreatingRowCancel,
        onEditingRowCancel,

        isLoadingError: isError,
        isLoadingRecords: isLoading,
        isFetchingRecords: isFetching,
        isCreatingRecord,
        isUpdatingRecord,
        isDeletingRecord,

        columns,
        tableName,
        initialState: {
            columnVisibility: { image: false }
        }
    })
    //const EditPrompt = Prompt({ columns, action: 1, tableName, saveRecord: updateRecord })

    return (<Table />)
}

export default function ProductTable() {
    return (
        <TableWrapper>
            <Table />
        </TableWrapper>
    )
}

function GET(tableName, simple) {
    const callAPI = useAPI(tableName)
    const { startAsync } = useProgress()
    function useGet() {
        return useQuery({
            queryKey: [tableName],
            queryFn: async () => {
                return await startAsync(async () => await callAPI({
                    option: "all",
                    simple: simple
                }))
            },
            refetchOnWindowFocus: false,
        });
    }
    return [useGet]
}

function CRUD({ tableName, subTable, simple }) {

    const callAPI = useAPI(tableName)
    const otherAPIs = useAPIs(subTable)
    const { startAsync } = useProgress(1)

    const { normal: newNotification, error: alertError } = useNotification()

    function useCreate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (record) => {
                var rec = await startAsync(async () => {
                    var t = await callAPI({
                        option: "add",
                        method: "POST",
                        simple: true,
                        body: record
                    })

                    return t
                })
                return rec
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord)
                if (alertError(newRecord))
                    return
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords
                    let o = {
                        ...others, [tableName]: [ ...table, newRecord ],
                    }
                    console.log(o)
                    return o
                })
                newNotification("A record has been created", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
            //onSettled: () => queryClient.invalidateQueries({ queryKey: [tableName] }), //refetch users after mutation, disabled for demo
        });
    }

    function useGet() {
        return useQuery({
            queryKey: [tableName],
            queryFn: async () => {
                return await startAsync(async () => {
                    let record = {}
                    record[tableName] = await callAPI({
                        option: "all",
                        simple: simple
                    })
                    await Promise.all(otherAPIs.map(async (e) => {
                        record[e.name] = await e.fn()
                    }))
                    return record
                })
            },
            refetchOnWindowFocus: false,
        });
    }

    function useUpdate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (record) => {
                var rec = await startAsync(async () => {
                    var t = await callAPI({
                        option: "add",
                        method: "POST",
                        simple: true,
                        body: record
                    })

                    return t
                })
                return rec
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord)
                if (alertError(newRecord))
                    return
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords
                    let o = {
                        ...others, [tableName]: table?.map((prevRecord) =>
                        prevRecord.id === newRecord.id ? newRecord : prevRecord)
                    }
                    console.log(o)
                    return o
                })
                newNotification("A record has been edited", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
        });
    }

    function useDelete() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (recordId) => {
                var rec = await startAsync(async () => {
                    var t = await callAPI({
                        option: `remove/${recordId}`,
                        method: "DELETE",
                        simple: false,
                    })
                    return t
                })
                return rec
            },
            onMutate: (recordId) => {
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords
                    let o = {
                        ...others, [tableName]: table?.filter((record) => record.id !== recordId)
                    }
                    console.log(o)
                    return o
                })
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord)
                if (alertError(newRecord))
                    return
                newNotification("A record has been removed", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
        });
    }

    return [useCreate, useGet, useUpdate, useDelete]
}