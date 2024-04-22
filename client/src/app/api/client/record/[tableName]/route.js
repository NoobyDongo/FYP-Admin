import forwardToBackend from '@/utils/api/forwardToBackend';

const whitelist = ['product']

export async function POST(req, { params }) {
    const { tableName } = params
    if (!whitelist.includes(tableName))
        return Unauthorized()
    return forwardToBackend(await req.json(), tableName)
}