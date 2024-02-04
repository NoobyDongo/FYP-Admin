require('dotenv').config({ path: './config.env' });
//https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
//https://medium.com/@mohammadaliasghar523/creating-a-real-time-chat-app-with-next-js-and-websockets-e41fd131949c
const { createServer } = require('http')
const { parse } = require('url')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'
const wsPort = process.env.NEXT_PUBLIC_WS_PORT
const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT
const wsKey = process.env.WS_KEY
const hostname = process.env.NEXT_PUBLIC_HOSTNAME

console.log("In dev mode", dev)

const app = next({ dev, hostname, serverPort })
const handle = app.getRequestHandler()

const UploadWsServer = createServer((req, res) => {
  if (req.method === 'POST') {
    const secretKey = req.headers[process.env.SK_INDICATOR]
    console.log("received secretKey", secretKey)

    if (secretKey !== wsKey) {
      res.statusCode = 401
      console.log("Unauthorized", secretKey)
      res.end('Unauthorized')
      return
    }

    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      const { socket: socketId, key, value } = JSON.parse(body)

      new Promise(resolve => setTimeout(resolve, 1000)).then(() => {

        uploadWebsocket.to(socketId).emit(key, value)


        res.statusCode = 200
        res.end('Message sent successfully')
      })


    })
  } else {
    res.statusCode = 400
    res.end('Bad request')
  }
})
const uploadWebsocket = new Server(UploadWsServer, {
  cors: {
    origin: UploadWsServer,
    methods: ["GET", "POST"]
  }
})
uploadWebsocket.on('connection', (socket) => {
  console.log('Upload: A user connected')

  socket.on('disconnect', () => {
    console.log('Upload: A user disconnected')
  })
})

UploadWsServer.listen(wsPort, () => {
  console.log(`> WebSocket server listening on port ${wsPort}`)
})

app.prepare().then(() => {

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      /*
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
      */
      await handle(req, res, parsedUrl)

    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(serverPort, () => {
      console.log(`> Ready on http://${hostname}:${serverPort}`)
    })
})