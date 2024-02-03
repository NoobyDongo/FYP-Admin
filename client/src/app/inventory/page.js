'use client'
import * as React from 'react'
import { NavTabs } from '@/components/Navigation/navoptions/options.jsx'
import CrudTable from '@/components/Table/Table.jsx'
import producttype from '@/schema/product/producttype.js'
import origin from '@/schema/product/origin.js'
import TableContainer from '@/components/Table/TableContainer'
import useHashTabMenu from '@/components/Tabs/useHashTabMenu.js'
import inventory from '@/schema/company/inventory'
import Box from '@mui/material/Box';


export default function Home() {
  const tables = [
    inventory,
  ]

  const { menu, value } = useHashTabMenu({
    tabIndicators: NavTabs.company,
    MenuProps: {
      sx: {
        mb: -5,
      }
    }
  })
  console.log("page rendered", NavTabs, value)

  let Table = React.useCallback(() =>CrudTable({
    columns: tables[value].columns,
    inputs: tables[value].inputs,
    tableName: tables[value].name,
    ...tables[value].props,
  }), [value])

  return (
    <>
      <TableContainer sx={{pt: 1}}>
        <div className="tabpanel">
          <Table />
        </div>
      </TableContainer>
    </>
  )
}
