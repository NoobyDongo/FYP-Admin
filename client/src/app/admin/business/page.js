'use client'
import * as React from 'react'
import { NavTabs } from '@/components/Navigation/navoptions/options.jsx'
import CrudTable from '@/components/Table/Table.jsx'
import origin from '@/schema/product/origin.js'
import TableContainer from '@/components/Table/TableContainer'
import useHashTabMenu from '@/components/Tabs/useHashTabMenu.js'
import Box from '@mui/material/Box';
import customer from '@/schema/business/customer'
import invoice from '@/schema/business/invoice'


export default function Home() {

  const tables = {
    0: null,
    1: customer,
    2: invoice,
  }

  const { menu, value } = useHashTabMenu({
    tabIndicators: NavTabs.business,
    MenuProps: {
      sx: {
        mb: 2,
      }
    }
  })
  //console.log("page rendered", NavTabs, value)

  let Table = React.useCallback(() => value ? CrudTable({
    columns: tables[value].columns,
    inputs: tables[value].inputs,
    tableName: tables[value].name,
    ...tables[value].props,
  }) : (
    <Box sx={{ padding: 2 }}>
      <h1>Reports... Coming Soon</h1>
    </Box>
  ), [value])

  return (
    <>
      <TableContainer>
        {menu}
        <div className="tabpanel">
          <Table />
        </div>
      </TableContainer>
    </>
  )
}
