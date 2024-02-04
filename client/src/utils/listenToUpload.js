import startLoadingEvent from "@/components/Progress/useProgress/startLoadingEvent.js";
import stopLoadingEvent from "@/components/Progress/useProgress/stopLoadingEvent.js";
import { imageUploadWs, ws } from '../config.js';
import { io } from "socket.io-client";

export default async function listenToUpload(asyncFunc, formdata, callback) {

  const socket = io(ws)


  socket.on("connect", async () => {

    socket.on(imageUploadWs.start, (data) => {
      const { name, ...others } = data
      startLoadingEvent(name, others);
    });
    socket.on(imageUploadWs.end, (data) => {
      const { name, ...others } = data
      setTimeout(stopLoadingEvent(name, others), 500);
    });

    let body = {
      socket: socket.id,
      form: formdata,
    }

    try {
      await asyncFunc(body).then((res) => {
        socket.off(imageUploadWs.start)
        socket.off(imageUploadWs.end)
        callback?.(res)
        socket.close()
        socket.disconnect()
      });
    } catch (err) {
      socket.off(imageUploadWs.start)
      socket.off(imageUploadWs.end)
      socket.close()
      socket.disconnect()
      callback?.({error:err})
    }
  })
}
