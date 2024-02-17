import jwt from 'jsonwebtoken';
import { cookies as Cookies } from 'next/headers';

export default () => {
    const auth = Cookies().get('auth');
    try {
        const decoded = jwt.verify(auth.value, process.env.JWT_SECRET);
        return true;
    } catch (err) {
        return false;
    }
}
