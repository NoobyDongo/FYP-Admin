'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@emotion/react';
import { TabMenu, TabPanel } from '@/components/tabs';
import ExampleWithProviders from './table3'
//import Example from './table2';


export default function Home() {
  const theme = useTheme()

  const [value, setValue] = React.useState(0);
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <Box paddingTop={theme.spacing(2)} sx={{ maxWidth: "100%" }}>
      <TabMenu
        value={value}
        handleChange={handleChange}
        tabs={["Employee List"]}
      />
      <TabPanel value={value} index={0}>
        <ExampleWithProviders></ExampleWithProviders>
      </TabPanel>

    </Box>
  )
}
