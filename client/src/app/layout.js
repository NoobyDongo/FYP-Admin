import { Inter } from "next/font/google";
import { cookies } from 'next/headers'
import { CookiesProvider } from 'next-client-cookies/server';
import './globals.scss'

export const metadata = {
  title: 'V#',
  description: 'Shop Online',
}
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const cookieStore = cookies()
  const darkMode = cookieStore.get('darkMode')
  console.log(darkMode)

  return (
    <html className={inter.className} lang="en">
      <CookiesProvider>
        <body suppressHydrationWarning>
          {children}
        </body>
      </CookiesProvider>
    </html>
  )
}
