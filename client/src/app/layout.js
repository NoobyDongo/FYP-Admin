import './globals.scss'
import '../resources/fonts/Inter-3.19/Inter Web/inter.css'

import NavWrapper from "../components/Navigation/_wrapper";
import Notifications from '@/components/Notifications/Notifications';

export const metadata = {
  title: 'V# Admin Panel',
  description: '',
}

export default function RootLayout({ children }) {

  return (
    <html style={{
      overflow: "hidden", fontFamily: "Inter"
    }} lang="en">

      <body suppressHydrationWarning style={{ fontFamily: "inherit", height: "100vh", width: "100vw", overflow: "auto", display: "flex" }}>
        <NavWrapper>{children}</NavWrapper>
        <Notifications />
      </body>
    </html>
  )
}
