import { cookies } from 'next/headers'
import Wrapper from "./wrapper";

export default function RootLayout({ children }) {

  const cookieStore = cookies()
  const cToken = cookieStore.get('token')

  console.log(cToken)



  return (
    <body style={{ height: "100vh", width: "100vw", display: "flex" }}>

      <Wrapper token={cToken}>{children}</Wrapper>

    </body>
  )
}
