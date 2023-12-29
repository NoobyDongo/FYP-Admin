'use client'
import { useRouter } from "next/navigation";
import { useCookies as useClientCookies } from 'next-client-cookies';
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function useClientLogin() {
    const cookies = useClientCookies()
    const token = cookies.get('token')
    const router = useRouter()
    const location = usePathname()
    useEffect(() => {
        if (!token && location !== "/signin") {
            router.push("/signin")
        }
    })
    return [token, location]
}

