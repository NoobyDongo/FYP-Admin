import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

const authenticateToken = (req, next) => {



  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    req.user = user;
    return await next();
  });
};

export async function GET(req) {
  /*
  console.log(req.headers)
  const token = req.headers.authorization;
  console.log(token)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  */
  console.log(req.headers)
  console.log(req.nextUrl.searchParams)
  try {
    const folderName = req.nextUrl.searchParams.get("folderName") || "_blank";

    // Check if the received folderName is empty
    if (!folderName) {
      throw new Error('Folder name is empty');
    }

    const newDirectoryName = await generateUniqueDirectoryName(folderName);
    await createDirectory(newDirectoryName);

    return NextResponse.json({ name: newDirectoryName }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

}

const generateUniqueDirectoryName = async (folderName) => {
  let uniqueFolderName = folderName;
  let counter = 1;

  while (fs.existsSync(path.join(process.cwd(), 'public/image/upload', uniqueFolderName))) {
    uniqueFolderName = `${folderName}-${counter}`;
    counter++;
  }

  return uniqueFolderName;
};

const createDirectory = (folderName) => {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(process.cwd(), 'public/image/upload', folderName);

    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
