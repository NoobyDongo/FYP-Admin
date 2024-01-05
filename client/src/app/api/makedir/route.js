import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { auth } from "@/utils/api/auth";
import { makedirKey, makedirOption } from "../../../utils/config.js";


export async function GET(req) {
  return await auth(req, makedirKey, async () => {
    try {
      const option = req.nextUrl.searchParams.get("option");
      const path = req.nextUrl.searchParams.get("path") || "public";
      const folderName = req.nextUrl.searchParams.get("folderName") || "_blank";

      if (option === makedirOption.create) {
        const newDirectoryName = await generateUniqueDirectoryName(path, folderName);
        await createDirectory(path, newDirectoryName)
        return NextResponse.json({ name: newDirectoryName }, { status: 200 })
      } else if (option === makedirOption.remove) {
        await removeDirectory(path, folderName)
        return NextResponse.json({}, { status: 200 })
      }

    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  })
}

const generateUniqueDirectoryName = async (dirpath, folderName) => {
  let uniqueFolderName = folderName;
  let counter = 1;

  while (fs.existsSync(path.join(process.cwd(), dirpath, uniqueFolderName))) {
    uniqueFolderName = `${folderName}-${counter}`;
    counter++;
  }

  return uniqueFolderName;
};

const removeDirectory = (dirpath, folderName) => {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(process.cwd(), dirpath, folderName);

    fs.rmdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};


const createDirectory = (dirpath, folderName) => {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(process.cwd(), dirpath, folderName);

    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
