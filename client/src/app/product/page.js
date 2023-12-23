import * as React from 'react';
//import ExampleWithProviders from './table3'
//import Example from './table2';
import TableContainer from '@/components/TableContainer'
import ProductTable from './table';
import ExampleWithLocalizationProvider from '@/components/ExampleTable/TS';


export default function Home() {

  return (
    <TableContainer>
      <ProductTable></ProductTable>
    </TableContainer>
  )
}

