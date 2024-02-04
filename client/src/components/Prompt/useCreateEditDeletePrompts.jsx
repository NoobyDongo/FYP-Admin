'use client'
import React from 'react'
import Prompt from '@/components/Prompt/Prompt'

export default function useCreateEditDeletePrompts(props) {
    const { inputs, upload, createRecord, updateRecord, deleteRecord, createContext, updateContext } = props

    const [creating, setCreating] = React.useState(false)
    const [row, setRow] = React.useState({})
    const [editing, setEditing] = React.useState(false)

    const toCreate = React.useCallback(() => setCreating(true), [])
    const toEdit = React.useCallback((row) => {
        setRow(row)
        setEditing(true)
    }, [])
    const toDelete = React.useCallback((row) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            deleteRecord(row)
        }
    }, [deleteRecord])

    const RawCreatePrompt = React.useCallback((open) => <Prompt useUpload={upload ? 1 : 0} open={open} onClose={() => setCreating(false)} action={0} {...{ inputs, saveRecord: createRecord, context:createContext }} />,
        [inputs, createRecord, createContext])

    const RawEditPrompt = React.useCallback((open) => <Prompt useUpload={upload ? 1 : 0} open={open} onClose={() => setEditing(false)} action={1} data={row} {...{ inputs, saveRecord: updateRecord, context:updateContext }} />,
        [inputs, updateRecord, row, updateContext])


    const CreatePrompt = React.useMemo(() => RawCreatePrompt(creating), [creating])
    const EditPrompt = React.useMemo(() => RawEditPrompt(editing), [editing])

    return {
        CreatePrompt,
        EditPrompt,
        /*DeletePrompt, */
        toCreate,
        toEdit,
        toDelete,
        setCreating,
        setEditing,
        creating,
        editing,
    }
}
