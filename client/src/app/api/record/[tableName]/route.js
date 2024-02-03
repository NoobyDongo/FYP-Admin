import authClient from '@/utils/api/authClient';
import forwardToBackend from '@/utils/api/forwardToBackend';

export async function POST(req, {params}){
    return await authClient(async () => {
        const { tableName } = params
        return forwardToBackend(await req.json(), tableName)
    })
}