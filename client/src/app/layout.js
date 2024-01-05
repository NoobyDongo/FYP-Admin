import './globals.scss'
import '../fonts/Inter-3.19/Inter Web/inter.css'


import { cookies } from 'next/headers'
import NavWrapper from "../components/Navigation/wrapper";
import { CookiesProvider } from 'next-client-cookies/server';
import useServerLogin from '@/utils/useServerLogin';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}


export default function RootLayout({ children }) {

  const cookieStore = cookies()
  const cToken = cookieStore.get('token')
  const [token, location] = useServerLogin()

  return (
    <html style={{
      overflow: "hidden", fontFamily: "Inter"
    }} lang="en">

      <body suppressHydrationWarning style={{ fontFamily: "inherit", height: "100vh", width: "100vw", overflow: "auto", display: "flex" }}>
        <CookiesProvider>
          <NavWrapper token={cToken}>{children}</NavWrapper>
        </CookiesProvider>

      </body>
    </html>
  )
}
