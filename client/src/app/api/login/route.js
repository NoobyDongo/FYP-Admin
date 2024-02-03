import BadRequest from '@/utils/api/response/badRequest'
import Response from '@/utils/api/response/response'
import Unauthorized from '@/utils/api/response/unauthorized'
import jwt from 'jsonwebtoken'

function createToken({ id, email }) {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
    })
}

export async function POST(req) {
    const { username, password } = await req.json()
    console.log("Username:", username, "Password:", password)

    if (!username || !password)
        return BadRequest()

    if (username === ' ' && password === ' ') {
        const token = createToken({ id: 1, email: 'admin@example.com' })
        console.log("Token:", token)
        const res = Response({ valid: true })

        res.cookies.set('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: Number(process.env.JWT_EXPIRES_IN),
            path: '/',
        })

        return res
    } else {
        return Response({ valid: false })
    }
}