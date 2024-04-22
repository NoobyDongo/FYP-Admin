import NavWrapper from "@/components/Navigation/_wrapper";
import Notifications from '@/components/Notifications/Notifications';

export const metadata = {
  title: 'V# Admin Panel',
  description: '',
}

export default function RootLayout({ children }) {

  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      minWidth: '100vw',
    }}>
      <NavWrapper>{children}</NavWrapper>
      <Notifications />
    </main>
  )
}
