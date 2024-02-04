'use client'
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import clientToServer from "./clientToServer"

export default function GET(path, props, defaultValue) {
    const router = useRouter()
    const callAPI = clientToServer(path, router)

    return useQuery({
        queryKey: [path, props],
        queryFn: async () => {
            try {
                let res = await callAPI(props)
                if (res.error)
                    return defaultValue
                return res
            } catch (err) {
                console.error(err)
                return {}
            }
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    })
}