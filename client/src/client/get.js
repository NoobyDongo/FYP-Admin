import clientToServer from "@/client/clientToServer";
import {
    keepPreviousData,
    useQuery,
} from '@tanstack/react-query';

export default function GET(path, props, defaultValue) {
    const callAPI = clientToServer(path)

    return useQuery({
        queryKey: [path, props],
        queryFn: async () => {
            try {
                let res = await callAPI(props)
                if (res.data?.error)
                    return defaultValue
                return res
            } catch (err) {
                console.error(err)
                return defaultValue
            }
        },
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    })
}