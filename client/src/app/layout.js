import './globals.scss'
import '../resources/fonts/Inter-3.19/Inter Web/inter.css'

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
        {children}
      </body>
    </html>
  )
}
