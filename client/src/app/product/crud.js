'use client';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import useProgress from "@/utils/hooks/useProgress/useProgress";
import { useNotification } from '@/components/Notifications/useNotification';
import { useAPI, useAPIs } from '@/utils/crud/useAPI';
import { api } from '../../../config';

export default function CRUD({ tableName, subTable, simple, methods }) {

    const callAPI = useAPI(api, tableName);
    const otherAPIs = useAPIs(api, subTable);
    const { create = callAPI, get = callAPI, update = callAPI, delete: _del = callAPI } = methods;
    const { createSimple = true, getSimple = true, updateSimple = true, deleteSimple = true } = methods;
    const { createOption = "add", getOption = "all", updateOption = "add", deleteOption } = methods;
    const { startAsync } = useProgress(1);

    const { normal: newNotification, error: alertError } = useNotification();

    function useCreate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (record) => {
                var rec = await startAsync(async () => {
                    var t = await create({
                        option: createOption,
                        method: "POST",
                        simple: true && createSimple,
                        body: record
                    });

                    return t;
                });
                return rec;
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord);
                if (alertError(newRecord))
                    return
                if (!newRecord.id) {
                    alertError({ error: "No id returned from server" })
                    return
                }
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords;
                    let o = {
                        ...others, [tableName]: [...table, newRecord],
                    };
                    console.log(o);
                    return o;
                });
                newNotification("A record has been created", "info");
            },
            onError: (err) => {
                alertError({ error: err });
            },
            //onSettled: () => queryClient.invalidateQueries({ queryKey: [tableName] }), //refetch users after mutation, disabled for demo
        });
    }

    function useGet() {
        return useQuery({
            queryKey: [tableName],
            queryFn: async () => {
                return await startAsync(async () => {
                    let record = {};
                    record[tableName] = await get({
                        option: getOption,
                        simple: simple && getSimple
                    });
                    await Promise.all(otherAPIs.map(async (e) => {
                        record[e.name] = await e.fn();
                    }));
                    return record;
                });
            },
            refetchOnWindowFocus: false,
        });
    }

    function useUpdate() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (record) => {
                var rec = await startAsync(async () => {
                    var t = await update({
                        option: updateOption,
                        method: "POST",
                        simple: true && updateSimple,
                        body: record
                    });

                    return t;
                });
                return rec;
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord);
                if (alertError(newRecord))
                    return;
                if (!newRecord.id) {
                    alertError({ error: "No id returned from server" })
                    return
                }
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords;
                    let o = {
                        ...others, [tableName]: table?.map((prevRecord) => prevRecord.id === newRecord.id ? newRecord : prevRecord)
                    };
                    console.log(o);
                    return o;
                });
                newNotification("A record has been edited", "info");
            },
            onError: (err) => {
                alertError({ error: err });
            },
        });
    }

    function useDelete() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (recordId) => {
                var rec = await startAsync(async () => {
                    var t = await _del({
                        option: deleteOption || `remove/${recordId}`,
                        method: "DELETE",
                        simple: false && deleteSimple,
                        body: { id: recordId }
                    });
                    return t;
                });
                return rec;
            },
            onSuccess: (newRecord) => {
                console.log("newREcord", newRecord);
                if (alertError(newRecord))
                    return;
                queryClient.setQueryData([tableName], (prevRecords) => {
                    let { [tableName]: table, ...others } = prevRecords;
                    let o = {
                        ...others, [tableName]: table?.filter((record) => record.id !== newRecord.id)
                    };
                    console.log(o);
                    return o;
                });
                newNotification("A record has been removed", "info");
            },
            onError: (err) => {
                alertError({ error: err });
            },
        });
    }

    return [useCreate, useGet, useUpdate, useDelete];
}
