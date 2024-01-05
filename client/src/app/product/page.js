'use client'
import * as React from 'react';
//import ExampleWithProviders from './table3'
//import Example from './table2';
import TableContainer from '@/components/Table/TableContainer'
import ProductTable from './table';
import { TabPanel, TabMenu, useTabMenu } from '@/components/Tabs';
import { ImageUpload, ImagesUpload } from '@/components/ImageUpload/ImageUpload';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import { useImageUpload } from '@/components/ImageUpload/useImageUpload';
import { ProgressButton, useProgress } from '@/utils/useProgress';

export default function Home() {
  console.log("page rendered")
  const [value, handleChange] = useTabMenu()
  const tabs = ["Product List", "Product Type", "Origin"]

  const [images, setImages] = React.useState([])
  const imageUpload = React.useRef(null);

  const uploadImage = () => {
    imageUpload.current.uploadImages()
  }

  return (
    <>
      <TableContainer>
        <TabMenu tabs={tabs} value={value} handleChange={handleChange} />
        <TabPanel className="" value={value} index={0}>
          <Dialog open fullWidth>
            <DialogTitle variant="h4" sx={{ textTransform: "capitalize" }}>Test New Record</DialogTitle>
            <Divider />
            <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <ImagesUpload ref={imageUpload}></ImagesUpload>
            </DialogContent>
            <DialogActions sx={{ padding: 3, pt: 1, pb: 2, gap:2 }}>
                <Button>Cancel</Button>
                <Button variant="contained" onClick={uploadImage}>Save</Button>
            </DialogActions>
        </Dialog>
        </TabPanel>
        <TabPanel className="tabpanel" value={value} index={1}>
          <ProductTable />
        </TabPanel>
      </TableContainer>
    </>
  )
}

