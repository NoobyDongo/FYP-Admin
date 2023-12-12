import ResponsiveAppBar from '@/components/appbar'

export default function RootLayout({ children }) {
  return (
    <html style={{overflow:"hidden", fontFamily:"Inter"}} lang="en">
      
      <body style={{height:"100vh"}}>
        <ResponsiveAppBar></ResponsiveAppBar>

        {children}
      </body>
    </html>
  )
}
