'use client'
import * as React from 'react'
import { NavTabs } from '@/components/Navigation/navoptions/options.jsx'
import CrudTable from '@/components/Table/Table.jsx'
import TableContainer from '@/components/Table/TableContainer'
import useHashTabMenu from '@/components/Tabs/useHashTabMenu.js'
import inventory from '@/schema/company/inventory'
import useCreateEditDeletePrompts from '@/components/Prompt/useCreateEditDeletePrompts'
import demo from '@/schema/demo/demo'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


export default function Home() {

  const createRecord = React.useCallback(async (record) => {
    return record
  }, [])

  const updateRecord = React.useCallback(async (record) => {
    return record
  }, [])

  const deleteRecord = React.useCallback(async (record) => {
    return record
  }, [])

  const { CreatePrompt, EditPrompt, toCreate, toEdit } = useCreateEditDeletePrompts({
    inputs: demo.inputs, createRecord, updateRecord, deleteRecord,
    createContext: "This prompt is for creating a new record.",
    updateContext: "This prompt is for editing an existing record. Some Input fields are disabled here.",
  })

  /*let Table = React.useCallback(() => CrudTable({
    columns: demo.columns,
    inputs: demo.inputs,
    tableName: demo.name,
    ...demo.props,
  }), [value])*/

  return (
    <>
      <Stack direction='row' sx={{ gap: 4, height: 1, width: 1, alignItems: "center", justifyContent:"center"}}>
        <Button onClick={() => toCreate()} variant='contained'>Create Form</Button>
        <Button onClick={() => toEdit()} variant='outlined'>Edit Form</Button>
      </Stack>
      {CreatePrompt}
      {EditPrompt}
    </>
  )
}
