import { _authClient } from '@/utils/api/authClient';
import Response from '@/utils/api/response/response';

export async function GET(req) {
    return Response({ valid: _authClient() })
}