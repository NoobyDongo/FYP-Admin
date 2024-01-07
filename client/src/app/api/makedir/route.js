import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { auth } from "@/utils/api/auth";
import { makedirKey, makedirOption } from "../../../../config.js";
import BadRequest from "@/utils/api/response/badRequest.js";


export async function GET(req) {
  return await auth(req, makedirKey, async () => {
      const option = req.nextUrl.searchParams.get("option");
      const targetPath = req.nextUrl.searchParams.get("path") || "public";
      const folderName = req.nextUrl.searchParams.get("folderName") || "_blank";

      if (option === makedirOption.create) {
        const newDirectoryName = await generateUniqueDirectoryName(targetPath, folderName);
        await createDirectory(targetPath, newDirectoryName)
        return NextResponse.json({ name: newDirectoryName }, { status: 200 })

      } else if (option === makedirOption.remove) {
        await removeDirectory(targetPath, folderName)
        return NextResponse.json({}, { status: 200 })
      } else if (option === makedirOption.rename) {
        const newName = req.nextUrl.searchParams.get("newName");
        if (!newName) return BadRequest("newName is undefined")
        fs.renameSync(path.join(process.cwd(), targetPath, folderName), path.join(process.cwd(), targetPath, newName))
        return NextResponse.json({ name: newName }, { status: 200 })
      }
      else {
        return NextResponse.json({ error: "Invalid option" }, { status: 400 })
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
