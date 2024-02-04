import NavWrapper from "@/components/Navigation/_wrapper";
import Notifications from '@/components/Notifications/Notifications';

export const metadata = {
  title: 'V# Admin Panel',
  description: '',
}

export default function RootLayout({ children }) {

  return (
    <>
      <NavWrapper>{children}</NavWrapper>
      <Notifications />
    </>
  )
}
