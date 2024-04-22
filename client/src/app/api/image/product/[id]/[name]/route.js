//https://github.com/vercel/next.js/discussions/16417#discussioncomment-6489765, original from codergautam
import InternalError from '@/utils/api/response/internalError';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const defaultImage = await fs.promises.readFile(path.join(process.cwd(), 'public', 'image', 'product', '_default', 'default.png'));

function makeResponse(data, name = '.png') {
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
}

export async function GET(req, { params = {} }) {
    const { id, name } = params;
    const filePath = path.join(process.cwd(), 'public', 'image', 'product', id, name);

    try {
        return makeResponse(await fs.promises.readFile(filePath), name);
    } catch (err) {
        try {
            return makeResponse(defaultImage, name);
        } catch (errr) {
            return InternalError(`Failed to read file: ${errr.code}`)
        }
    }
}