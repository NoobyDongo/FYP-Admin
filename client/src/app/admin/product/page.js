'use client'
import * as React from 'react'
//import ExampleWithProviders from './table3'
//import Example from './table2'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CustomDialog from '@/components/Dialog/CustomDialog'
import CrudTable from '@/components/Table/Table.jsx'

import { NavTabs } from '@/components/Navigation/navoptions/options.jsx'

import useForm from '@/components/Form/useForm.jsx'
import reformat from '@/schema/reformat.js'
import productSchema from '@/schema/product/product.js'
import producttype from '@/schema/product/producttype.js'
import origin from '@/schema/product/origin.js'
import TableContainer from '@/components/Table/TableContainer'
import useHashTabMenu from '@/components/Tabs/useHashTabMenu.js'
import inventoryproduct from '@/schema/company/inventoryproduct';
import formEditMode from '@/components/Form/formEditMode';

export default function Home() {
  const tables = {
    0: productSchema,
    1: producttype,
    2: origin,
  }
  const { menu, value } = useHashTabMenu({
    tabIndicators: NavTabs.product,
    MenuProps: {
      sx: {
        mb: 2,
      }
    }
  })
  
  const Table = React.useCallback(() => {
    return CrudTable({
      columns: tables[value].columns,
      inputs: tables[value].inputs,
      tableName: tables[value].name,
      ...tables[value].props,
    })
  }, [value])

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

/*
          <ImageUploadDemo />
    <CustomPanel className="tabpanel" value={value} index={0}>
      <ProductTable />
    </CustomPanel>
    <CustomPanel className="tabpanel" value={value} index={1}>
      <ProductTypeTable />
    </CustomPanel>
    <CustomPanel className="tabpanel" value={value} index={2}>
      <OriginTable />
    </CustomPanel>
*/

function ImageUploadDemo() {

  const columns = React.useMemo(() => reformat({
    label: "Inventory",
    name: "inventory",
    columns: [
      {
        accessorKey: 'id',
        enableClickToCopy: true,
      },
      {
        accessorKey: 'name',
        enableClickToCopy: true,
        size: 200,
        input: {
          required: true,
        },
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 250,
        input: {
          multiline: true,
          required: true,
        },
      },
      {
        tab: "Products",
        content: [
          {
            hidden: true,
            accessorKey: 'inventoryProduct',
            header: 'Inventory Product',
            enableColumnFilter: false,
            visibleInShowHideMenu: false,
            input: {
              type: "records",
              schema: inventoryproduct,
            }
          },
        ]
      }

    ],
  }), [])
  
  const { setFormData, validate, form } = useForm({ inputs: columns.inputs, mode: formEditMode.create })
  //const [f2, v2, ff1] = useForm({ inputs: product.inputs })

  return (
    <>
      <CustomDialog open={true}
        header='Records'
        content={
          <>
            <Stack gap={3}>
              {form}
            </Stack>
          </>
        }
        actions={
          <>
            <Button onClick={() => setFormData({})}>Cancel</Button>
            <Button variant="contained" onClick={sendForm}>Save</Button>
          </>
        }
        onClose={() => { }}
      />

    </>
  )
}

