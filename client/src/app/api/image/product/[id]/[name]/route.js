//https://github.com/vercel/next.js/discussions/16417#discussioncomment-6489765, original from codergautam
import InternalError from '@/utils/api/response/internalError';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(req, { params }) {
    const { id, name } = params;
    //console.log(params)
    const filePath = path.join(process.cwd(), 'public', 'image', 'product', id, name);

    try {
        const data = await fs.promises.readFile(filePath);
        const res = new NextResponse(data)
        const ext = path.extname(name);
        let contentType = 'image/jpeg'; // default to jpeg
        if (ext === '.png') {
            contentType = 'image/png';
        } else if (ext === '.gif') {
            contentType = 'image/gif';
        }
        res.headers.set('content-type', contentType);
        return res;
    } catch (err) {
        return InternalError(`Failed to read file: ${err}`)
    }
}