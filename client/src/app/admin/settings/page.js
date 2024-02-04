'use client'
import changeLocationEvent from '@/utils/events/changeLocationEvent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';
import settings from '../settings';

function Checker({ valueKey, children, defaultChecked }) {
  const [checked, setChecked] = React.useState(!!defaultChecked)

  React.useEffect(() => {
    if (valueKey)
      if (localStorage.getItem(valueKey) !== null)
        setChecked(localStorage.getItem(valueKey) === 'true')
  }, [])

  const onClick = (e) => {
    setChecked(prev => {
      if (valueKey)
        localStorage.setItem(valueKey, !prev)
      return !prev
    })
  }

  return (
    <Box onClick={onClick} sx={{ userSelect: "none", cursor: 'pointer', width: 'fit-content' }}>
      <Checkbox size='medium' checked={checked} sx={{ width: 0, pr: 2 }} disableRipple />
      <Typography component='span' variant='body2' >{children}</Typography>
    </Box>
  )
}

function Primary({ children, ...others }) {
  return <Typography fontSize="inherit" component='span' color='primary' {...others} >{children}</Typography>
}

export default function Home() {

  React.useEffect(() => {
    window.dispatchEvent(changeLocationEvent({ text: "Settings" }))
  }, [])


  return (
    <>
      <Box sx={{ pl: 1, pt: 2 }}>
        <Box sx={{ pb: 1 }}>
          <Typography variant='h7' fontWeight={600}>Prompts</Typography>
        </Box>
        <Checker valueKey={settings.promptAllowBackdropClickClose} defaultChecked>
          Allow prompts to be closed by clicking outside the prompt
        </Checker>

        <Box sx={{ pb: 1, mt: 4 }}>
          <Typography variant='h7' fontWeight={600}>Creating Record</Typography>
        </Box>
        <Checker valueKey={settings.autoDisableCreateRecord} defaultChecked>
          Disable prompt after creating a record
        </Checker>
        <Checker valueKey={settings.autoCloseCreatePrompt}>
          Close prompt after creating a record
        </Checker>


        <Box sx={{ pb: 1, mt: 4 }}>
          <Typography variant='h7' fontWeight={600}>Editing Record</Typography>
        </Box>
        <Checker valueKey={settings.autoDisableEditRecord} defaultChecked>
          Disable prompt after editing a record
        </Checker>
        <Checker valueKey={settings.autoCloseEditPrompt}>
          Close prompt after editing a record
        </Checker>
      </Box>
    </>
  )
}