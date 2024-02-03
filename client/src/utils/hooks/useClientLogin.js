'use client'
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"

export default function useClientLogin() {
    const [valid, setValid] = useState(false)
    const router = useRouter()
    const location = usePathname()

    useEffect(() => {
        const verifyToken = async () => {
            const response = await axios.get('/api/verify');
            console.log("Response:", response.data.valid)
            setValid(response.data.valid);

            if (response.data.valid) {
                localStorage.setItem('lastVisitedPage', location);
            } else if (location !== "/signin") {
                router.push("/signin")
            }
        };

        verifyToken();
    }, [location])

    return [valid, location, !valid]
}