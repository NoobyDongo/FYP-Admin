import { Inter } from "next/font/google";
import './globals.scss'

export const metadata = {
  title: 'V# Admin Panel',
  description: '',
}
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  return (
    <html style={{
      overflow: "hidden"
    }} className={inter.className}  lang="en">

      <body suppressHydrationWarning  style={{ fontFamily: "inherit", height: "100vh", width: "100vw", overflow: "auto", display: "flex" }}>
        {children}
      </body>
    </html>
  )
}
