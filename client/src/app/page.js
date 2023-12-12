'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button';
import { Container, Stack, Typography } from '@mui/material';

export default function Home() {

  const router = useRouter()

  const ToHRS = (e) => {
    router.push("hrs")
  }
  const ToFront = (e) => {
    router.push("front")
  }

  return (
    <body>

      <Container>
        <Stack alignItems="center" padding={10} gap={5}>
        <Typography variant="h3">Test Page</Typography>

        <Button variant='outlined' onClick={ToHRS}>To HRS</Button>
        <Button variant='outlined' onClick={ToFront}>To Front</Button>
        </Stack>
      </Container>

    </body>
  )
}
