import { auth } from '@/utils/api/auth';
import { uploadImageKey } from '../../../../../config';
import fs from 'fs';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

function generateUniqueFilename(directory, filename, ext) {
  let uniqueFilename = `${filename}.${ext}`;

  while (fs.existsSync(path.join(directory, uniqueFilename))) {
    // Generate a new unique filename using a SHA-256 hash
    const hash = crypto.createHash('sha256');
    hash.update(Date.now().toString());
    const hashedFilename = hash.digest('hex');

    uniqueFilename = `${hashedFilename}.${ext}`;
  }

  return uniqueFilename;
}

//function to convert image buffer to webp
async function toWebp(buffer) {
  return await sharp(buffer)
    .resize(800)
    .toFormat('webp')
    .webp({ quality: 80 })
    .toBuffer()
}


//check if base64image is gif
function isGif(base64Image) {
  return base64Image.includes('data:image/gif;base64,')
}

export async function POST(req) {
  return await auth(req, uploadImageKey, async () => {
    const { image, filename, path: directoryPath, directory } = await req.json()
    const imageData = image.replace(/^data:image\/\w+;base64,/, '')

    console.log(isGif(image) ? 'gif' : 'not gif')
    let gif = isGif(image)
    let buffer = Buffer.from(imageData, 'base64')
    if (!gif)
      buffer = await toWebp(buffer)

    console.log('directoryPath:', directoryPath);
    console.log('directory:', directory);
    const uniqueFilename = generateUniqueFilename(directoryPath, filename, gif ? "gif" : "webp")
    console.log('uniqueFilename:', uniqueFilename);
    const relativePath = path.join(directoryPath, directory, uniqueFilename)
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
    return NextResponse.json({ name: uniqueFilename }, { status: 200 })
  })
}