import Unauthorized from './response/unauthorized'
import _authClient from './_authClient'

export default async (asyncFn) => {
    if (_authClient())
        return await asyncFn()
    else
        return Unauthorized()
}