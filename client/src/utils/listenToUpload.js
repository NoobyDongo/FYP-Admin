import { startLoadingEvent, stopLoadingEvent } from "@/components/Progress/useProgress/useProgress.js";
import { io } from 'socket.io-client';
import { hostname, imageUploadWs, server, ws, wsPort } from '../config.js';

export default function listenToUpload(asyncFunc, formdata, callback) {

  const socket = io(ws); // Replace with your server URL
  console.log(`http://${hostname}:${wsPort}`, server, process.env)

  socket.on('connect', async () => {
    console.log('Connected with socket ID:', socket.id);

    let body = {
      socket: socket.id,
      form: formdata,
    };
    try {
      await asyncFunc(body).then((res) => {
        socket.disconnect();
        socket.close();
        callback?.(res)
      });
    } catch (err) {
      socket.disconnect();
      socket.close();
      callback?.(res)
    }
  });

  socket.on(imageUploadWs.start, (data) => {
    const { name, ...others } = data
    console.log("image upload start", data);
    startLoadingEvent(name, others);
  });
  socket.on(imageUploadWs.end, (data) => {
    const { name, ...others } = data
    console.log("image upload end", data);
    setTimeout(stopLoadingEvent(name, others), 500);
  });
}
