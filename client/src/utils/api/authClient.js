import jwt from 'jsonwebtoken'
import { cookies as Cookies } from 'next/headers'
import Unauthorized from './response/unauthorized'

export function _authClient(){
    const auth = Cookies().get('auth')
    //console.log("Auth:", auth)

    try {
        const decoded = jwt.verify(auth.value, process.env.JWT_SECRET)
        //console.log("Decoded:", decoded)
        return true
    } catch (err) {
        return false
    }
}

export default async function authClient(asyncFn){
    if(_authClient())
        return await asyncFn()
    else
        return Unauthorized()
}