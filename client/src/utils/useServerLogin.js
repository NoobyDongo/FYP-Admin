import { cookies as useCookies } from 'next/headers';
import { headers } from "next/headers";

export default function useServerLogin() {
    const cookies = useCookies()
    const token = cookies.get('token')

    const headersList = headers();
    const pathname = headersList.get("x-invoke-path") || "";

    if (!token && pathname !== "/signin") {
        //redirect("/signin", "replace")
    }
    return [token, pathname]
}