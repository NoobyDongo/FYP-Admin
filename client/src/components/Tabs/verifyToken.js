import axios from "axios";

export default async (router, fn) => {
    const response = await axios.get('/api/verify');

    if (response.data.valid) {
        localStorage.setItem('lastVisitedPage', window.location.pathname + window.location.hash);
        fn();
    } else if (window.location.pathname !== "/signin") {
        router.push("/signin");
    }
}
