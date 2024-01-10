'use client'
import * as React from 'react';
//import ExampleWithProviders from './table3'
//import Example from './table2';
import TableContainer from '@/components/Table/TableContainer'
import ProductTable from './table';
import TabPanel from '@/components/Tabs/TabPanel';
import TabMenu from '@/components/Tabs/TabMenu';
import useTabMenu from '@/components/Tabs/useTabMenu';
import ImagesUpload from '@/components/Image/ImagesUpload';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import useProgress from "@/components/Progress/useProgress/useProgress";
import { io } from 'socket.io-client';
import { imageUploadWs, server, ws } from '../../config.js';

export default function Home() {
  console.log("page rendered")
  const [value, handleChange] = useTabMenu()
  const tabs = ["Product List", "Product Type", "Origin"]

  return (
    <>
      <TableContainer>
        <TabMenu tabs={tabs} value={value} handleChange={handleChange} sx={{mb: 3, border: 0}}/>
        <TabPanel className="" value={value} index={1}>
          
        </TabPanel>
        <TabPanel className="tabpanel" value={value} index={0}>
          <ProductTable />
        </TabPanel>
      </TableContainer>
    </>
  )
}

function ImageUploadDemo() {

  const imageUpload = React.useRef(null);
  const {start, stop} = useProgress()

  const uploadImage = () => {
    ///imageUpload.current.uploadImages()
    const socket = io(ws); // Replace with your server URL
    
    socket.on('connect', async () => {
      console.log('Connected with socket ID:', socket.id);
      console.log(imageUpload.current.getImages())

      let formdata = {
        name: "124",
        desc: '234',
        price: 124213,
        images: imageUpload.current.getImages(),
      }

      let body = {
        socket: socket.id,
        form: formdata,
      }
      await fetch(`${server}/api/record/product`, {
        method:"POST",
        body: JSON.stringify(body)
      }).then(() => {
        socket.disconnect()
        socket.close()
      })
    });

    socket.on(imageUploadWs.start, (data) => {
      console.log(data)
      start(data.name)
    })
    socket.on(imageUploadWs.end, (data) => {
      console.log(data)
      setTimeout(stop(data.name), 500)
    })

  }

  return <Dialog open fullWidth>
    <DialogTitle variant="h4" sx={{ textTransform: "capitalize" }}>Test New Record</DialogTitle>
    <Divider />
    <DialogContent
      sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <ImagesUpload ref={imageUpload}></ImagesUpload>

    </DialogContent>
    <DialogActions sx={{ padding: 3, pt: 1, pb: 2, gap: 2 }}>
      <Button>Cancel</Button>
      <Button variant="contained" onClick={uploadImage}>Save</Button>
    </DialogActions>
  </Dialog>;
}

