import { Inter } from "next/font/google";
import { CookiesProvider } from 'next-client-cookies/server';
import './globals.scss'

export const metadata = {
  title: 'V#',
  description: 'Shop Online',
}
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
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
