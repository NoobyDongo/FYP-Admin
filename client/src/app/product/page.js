'use client'
import * as React from 'react';
//import ExampleWithProviders from './table3'
//import Example from './table2';
import TableContainer from '@/components/TableContainer'
import ProductTable from './table';
import { TabPanel,TabMenu, useTabMenu } from '@/components/tabs';

export default function Home() {
  console.log("page rendered")
  const [value, handleChange] = useTabMenu()
  const tabs = ["Product List", "Product Type", "Origin"]
  return (
    <>
      <TableContainer>
        <TabMenu tabs={tabs} value={value} handleChange={handleChange}/>
        <TabPanel className="tabpanel" value={value} index={0}>
          <ProductTable />
        </TabPanel>
      </TableContainer>
    </>
  )
}

