import { cookies as Cookies } from 'next/headers'
import Response from '@/utils/api/response/response';

export async function GET(req) {
    const cookies = Cookies()
    cookies.delete('auth')
    return Response({ message: 'Logged out' })
}