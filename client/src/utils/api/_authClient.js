import jwt from 'jsonwebtoken';
import { cookies as Cookies } from 'next/headers';

export default () => {
    const auth = Cookies().get('auth');
    //console.log("Auth:", auth)
    try {
        const decoded = jwt.verify(auth.value, process.env.JWT_SECRET);
        //console.log("Decoded:", decoded)
        return true;
    } catch (err) {
        return false;
    }
}
