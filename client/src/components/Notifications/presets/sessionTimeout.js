'use client'
import useNotification from "@/components/Notifications/useNotification"

export default () => {
    const { error } = useNotification()
    return () => error({ error: "Session Timeout, Please Sign In" })
}