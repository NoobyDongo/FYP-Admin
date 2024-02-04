import fs from 'fs';
import path from 'path';
import authServer from "@/utils/api/authServer.js";
import { dirKey, dirOption } from "../../../config.js";
import BadRequest from "@/utils/api/response/badRequest.js";
import Response from "@/utils/api/response/response.js";


export async function GET(req) {
  return await authServer(req, dirKey, async () => {
    const option = req.nextUrl.searchParams.get("option");
    const targetPath = req.nextUrl.searchParams.get("path") || "public";
    const folderName = req.nextUrl.searchParams.get("folderName") || "_blank";

    if (option === dirOption.create) {
      const newDirectoryName = await generateUniqueDirectoryName(targetPath, folderName);
      await createDirectory(targetPath, newDirectoryName)
      return Response({ name: newDirectoryName })
    }
    else if (option === dirOption.remove) {
      await removeDirectory(targetPath, folderName)
      return Response()
    }
    else if (option === dirOption.rename) {
      const newName = req.nextUrl.searchParams.get("newName");
      if (!newName)
        return BadRequest("newName is undefined")
      fs.renameSync(path.join(process.cwd(), targetPath, folderName + ""), path.join(process.cwd(), targetPath, newName + ""))
      return Response({ name: newName })
    }
    else {
      return BadRequest("Invalid option")
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
    const directoryPath = path.join(process.cwd(), dirpath, folderName + "");

    if (fs.existsSync(directoryPath)) {
      fs.rm(directoryPath, { recursive: true }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    } else {
      resolve()
    }
  });
};


const createDirectory = (dirpath, folderName) => {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(process.cwd(), dirpath, folderName + "");

    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
