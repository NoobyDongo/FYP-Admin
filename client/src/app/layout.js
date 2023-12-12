
import './globals.css'
import '../fonts/Inter-3.19/Inter Web/inter.css'

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html style={{ overflow: "hidden", fontFamily: "Inter" }} lang="en">
        {children}
    </html>
  )
}
