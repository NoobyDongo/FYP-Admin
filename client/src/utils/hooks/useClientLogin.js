'use client'
import { useRouter, usePathname } from "next/navigation"
import React from "react"
import axios from "axios"
import useNotification from "@/components/Notifications/useNotification"
import link from "@/app/admin/link"

export default function useClientLogin() {
    const [valid, setValid] = React.useState(false)
    const router = useRouter()
    const location = usePathname()
    const { error } = useNotification()

    React.useEffect(() => {
        const verifyToken = async () => {
            const response = await axios.get('/api/verify')
            setValid(response.data.valid)

            if (response.data.valid) {
                if (location == link.signin) {
                    if (!localStorage.getItem('lastVisitedPage')) {
                        localStorage.setItem('lastVisitedPage', link.base)
                        router.push(link.base)
                    }
                    router.push(localStorage.getItem('lastVisitedPage'))
                } else {
                    localStorage.setItem('lastVisitedPage', location)
                }
            } else if (location !== link.signin) {
                error({ error: "Session Timeout, Please Sign In" })
                router.push(link.signin)
            }
            return response.data.valid
        }
        verifyToken()
    }, [location])

    return [valid, location]
}