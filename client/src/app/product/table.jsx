'use client'
import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

import {
    Box,
} from '@mui/material';
import { products, rawOrigin, rawType } from './makeData';
import Table from '@/components/Table'
import { numberReg } from '@/hooks/useRecordValidation';
import usePrompt from '@/hooks/usePrompt';
import { useProgress } from '@/hooks/useProgress';
import { useNotification } from '@/hooks/useNotification';

function RawProductTable() {
    const tableName = "Product"

    const onCreatingRowCancel = () => { }
    const onEditingRowCancel = () => { }

    useEffect(() => {
        console.log("Table Rendered")
    })

    const { mutateAsync: createRecord, isPending: isCreatingRecord } = useCreate();
    const { data: fetchedRecords = [], isError: isLoadingError, isFetching: isFetchingRecords, isLoading: isLoadingRecords, } = useGet();
    const { mutateAsync: updateRecord, isPending: isUpdatingRecord } = useUpdate();
    const { mutateAsync: deleteRecord, isPending: isDeletingRecord } = useDelete();

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                size: 120,
                enableClickToCopy: true,
            },

            {
                accessorKey: 'image',
                header: 'Image',
                size: 180,
                input: {
                    type: "image",
                },
                Cell: ({ row }) => {
                    return (
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
                                src={row.original.image || "/image/avatar.png"}
                                loading="lazy"
                                style={{ borderRadius: '50%' }}
                            />
                        </Box>
                    )
                },
            },

            {
                accessorKey: 'name',
                header: 'Name',
                size: 200,
                input: {
                    required: true,
                },
                Cell: ({ renderedCellValue, row }) => {
                    return (
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
                                src={row.original.image || "/image/avatar.png"}
                                loading="lazy"
                                style={{ borderRadius: '50%' }}
                            />
                            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                            <span>{renderedCellValue}</span>
                        </Box>
                    )
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
                size: 150,
                input: {
                    type: "tel", //no updown arrow this way lol
                    required: true,
                    validator: (value) => value > 0 && numberReg.test(value),
                    errorMessage: "Number format incorrect"
                },
            },
            {
                accessorKey: 'producttype',
                header: 'Type',
                size: 200,
                input: {
                    group: 2,
                    optionList: rawType,
                    optionValueAccessorFn: (value) => value.id,
                    optionLabelAccessorFn: (value) => value.name,
                    required: true,
                },
                Cell: ({ cell }) => (
                    <Box>
                        {rawType.find((e) => e.id == cell.getValue()).name}
                    </Box>
                ),
            },
            {
                accessorKey: "origin",
                header: "Origin",
                size: 200,
                input: {
                    group: 2,
                    optionList: rawOrigin,
                    optionValueAccessorFn: (value) => value.id,
                    optionLabelAccessorFn: (value) => value.name,
                    required: true,
                },
                Cell: ({ cell }) => (
                    <Box>
                        {rawOrigin.find((e) => e.id == cell.getValue()).name}
                    </Box>
                ),
            }

        ], [isUpdatingRecord],
    );

    const [createPrompt, handleCreate] = usePrompt({ columns, action: 0, tableName, saveRecord: createRecord })
    const [editPrompt, handleEdit] = usePrompt({ columns, action: 1, tableName, saveRecord: updateRecord })

    const openDeleteConfirmModal = (row) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            deleteRecord(row.original.id);
        }
    };  

    return (
        <Table
            fetchedRecords={fetchedRecords}

            createPrompt={createPrompt}
            editPrompt={editPrompt}
            openDeleteConfirmModal={openDeleteConfirmModal}

            createRecord={createRecord}
            updateRecord={updateRecord}
            deleteRecord={deleteRecord}
            onCreatingRowCancel={onCreatingRowCancel}
            onEditingRowCancel={onEditingRowCancel}

            isLoadingError={isLoadingError}
            isLoadingRecords={isLoadingRecords}
            isCreatingUser={isCreatingRecord}
            isUpdatingRecords={isUpdatingRecord}
            isDeletingRecords={isDeletingRecord}
            isFetchingRecords={isFetchingRecords}

            columns={columns}
            tableName={tableName}
            handleCreate={handleCreate}
            handleSave={handleEdit}
            initialState={{
                columnVisibility: { image: false }
            }}

        >
        </Table>
    )
}

const queryClient = new QueryClient()

export default function ProductTable() {
    return (
        <QueryClientProvider client={queryClient}>
            <RawProductTable />
        </QueryClientProvider>
    )
}

const {start, stop} = useProgress()
const startAsync = async(func) => {
    start();await func();setTimeout(stop(), 100);
}
const newNotification = useNotification()

function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (record) => {
            //send api update request here
            await startAsync(() => new Promise((resolve) => setTimeout(resolve, 1000))) ; //fake api call
            newNotification("A record has been created","info")
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newRecord) => {
            queryClient.setQueryData(['product'], (prevRecords) => [
                ...prevRecords,
                {
                    ...newRecord,
                    id: (Math.random() + 1).toString(36).substring(7),
                },
            ]);
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

function useGet() {
    return useQuery({
        queryKey: ['product'],
        queryFn: async () => {
            //send api request here
            await startAsync(() => new Promise((resolve) => setTimeout(resolve, 1000))) ; //fake api call
            return Promise.resolve(products);
        },
        refetchOnWindowFocus: false,
    });
}

function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (record) => {
            //send api update request here
            await startAsync(() => new Promise((resolve) => setTimeout(resolve, 1000))) ; //fake api call
            newNotification("A record has been edited","info")
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (newRecord) => {
            queryClient.setQueryData(['product'], (prevRecords) =>
                prevRecords?.map((prevRecord) =>
                    prevRecord.id === newRecord.id ? newRecord : prevRecord,
                ),
            );
        },
        //onSettled: () => queryClient.invalidateQueries({ queryKey: ['product'] }), //refetch users after mutation, disabled for demo
    });
}

function useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (recordId) => {
            //send api update request here
            await startAsync(() => new Promise((resolve) => setTimeout(resolve, 1000))) ; //fake api call
            return Promise.resolve();
        },
        //client side optimistic update
        onMutate: (recordId) => {
            queryClient.setQueryData(['product'], (prevRecords) =>
                prevRecords?.filter((record) => record.id !== recordId),
            );
        },
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
    });
}

