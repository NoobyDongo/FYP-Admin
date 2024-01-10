import authClient from '@/utils/api/authClient';
import Response from '@/utils/api/response/response';
import { toApi } from '@/utils/crud/useAPI';

export async function POST(req, {params}){
    return await authClient(async () => {
        const { tableName } = params
        let res = await toApi(await req.json(), tableName);
        return Response(res.data)
    })
}

