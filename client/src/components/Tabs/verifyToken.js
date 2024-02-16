'use client'
import link from "@/app/admin/link";
import axios from "axios";
import sessionTimeout from "@/components/Notifications/presets/sessionTimeout"

export default async function verifyToken(router, fn){
    const response = await axios.get('/api/verify');
    const timeout = sessionTimeout()

    if (response.data.valid) {
        localStorage.setItem('lastVisitedPage', window.location.pathname + window.location.hash);
        fn();
    } else if (window.location.pathname !== link.signin) {
        timeout()
        router.push(link.signin);
    }
}
