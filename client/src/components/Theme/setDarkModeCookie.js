'use server'
import { cookies } from 'next/headers'

export default async function setDarkModeCookie(data) {
    cookies().set('darkMode', data)
}