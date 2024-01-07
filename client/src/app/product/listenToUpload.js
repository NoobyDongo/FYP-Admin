'use client';
import { startLoadingEvent, stopLoadingEvent } from "@/utils/hooks/useProgress/useProgress";
import { io } from 'socket.io-client';
import { imageUploadWsKey, ws } from '../../../config.js';

export default function listenToUpload(asyncFunc, formdata, callback) {

  const socket = io(ws); // Replace with your server URL

  socket.on('connect', async () => {
    console.log('Connected with socket ID:', socket.id);

    let body = {
      socket: socket.id,
      form: formdata,
    };
    await asyncFunc(body).then((res) => {
      socket.disconnect();
      socket.close();
      callback?.(res)
    });
  });

  socket.on(imageUploadWsKey.start, (data) => {
    const {name, ...others} = data
    console.log("image upload start", data);
    startLoadingEvent(name, others);
  });
  socket.on(imageUploadWsKey.end, (data) => {
    const {name, ...others} = data
    console.log("image upload end", data);
    setTimeout(stopLoadingEvent(name, others), 500);
  });
}
