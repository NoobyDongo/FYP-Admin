import { auth } from '@/utils/api/auth';
import { uploadImageKey } from '@/utils/config';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';


export async function POST(req) {
  return await auth(req, uploadImageKey, async () => {
    try {
      const { image, filename, path : dirpath, directory } = await req.json()
      const imageData = image.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(imageData, 'base64')
  
      const uniqueFilename = `${filename}.webp`
      const relativePath = path.join(dirpath, directory, uniqueFilename)
      console.log("relativePath", relativePath)
      await new Promise(function (resolve, reject) {
        fs.writeFile(relativePath, buffer, (err) => {
          if (err) {
            console.error('Error saving image:', err)
            reject(err)
          }
          else resolve();
        });
      });
      return NextResponse.json({ link: relativePath }, { status: 200 })
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}