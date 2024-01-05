import fs from 'fs';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    console.log(req)
    const { image, filename, directory } = await req.json()
    const imageData = image.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(imageData, 'base64')

    const uniqueFilename = `${filename}.webp`
    const relativePath = `/image/upload/${directory}/${uniqueFilename}`
    await new Promise(function (resolve, reject) {
      fs.writeFile(`./public${relativePath}`, buffer, (err) => {
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



}