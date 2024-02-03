require('dotenv').config({path: './config.env.local'});
//https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
//https://medium.com/@mohammadaliasghar523/creating-a-real-time-chat-app-with-next-js-and-websockets-e41fd131949c
const { createServer } = require('http')
const { parse } = require('url')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'
const wsPort = process.env.NEXT_PUBLIC_WS_PORT
const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT
const authPort = process.env.NEXT_PUBLIC_AUTH_PORT
const wsKey = process.env.WS_KEY
const apiPort = process.env.NEXT_PUBLIC_API_PORT
const hostname = process.env.NEXT_PUBLIC_HOSTNAME

console.log("In dev mode", dev)

const { default: hashString } = require('./util/hash/_hashString.js')
const { default: generateUniqueHashedString } = require('./util/hash/_hashString.js')

const app = next({ dev, hostname, serverPort })
const handle = app.getRequestHandler()

const UploadWsServer = createServer((req, res) => {
  if (req.method === 'POST') {
    const secretKey = req.headers['x-secret-key']

    if (secretKey !== wsKey) {
      res.statusCode = 401
      res.end('Unauthorized')
      return
    }

    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      const { socket: socketId, key, value } = JSON.parse(body)

      uploadWebsocket.to(socketId).emit(key, value)

      res.statusCode = 200
      res.end('Message sent successfully')
    })
  } else {
    res.statusCode = 400
    res.end('Bad request')
  }
})
const uploadWebsocket = new Server(UploadWsServer, {
  cors: {
    origin: UploadWsServer,
    methods: ["GET"]
  }
})
uploadWebsocket.on('connection', (socket) => {
  console.log('Upload: A user connected')

  socket.on('disconnect', () => {
    console.log('Upload: A user disconnected')
  })
})

const authServer = createServer((req, res) => {
  if (req.method === 'POST') {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      const { username, password } = JSON.parse(body)
      /*
            const response = await axios.post('http://backend-api-url', {
              username,
              password
            });
      */
      if (username === 'admin' && password === hashString('admin')) {
        res.statusCode = 200
        res.end("success")
      } else {
        res.statusCode = 401
        res.end("fail")
      }
    })
  } else {
    res.statusCode = 400
    res.end('Bad request')
  }
})
const currentUsers = []
const authWebsocket = new Server(authServer, {
  cors: {
    origin: authServer,
    methods: ["GET"]
  }
})
authWebsocket.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })

  socket.on('login', async ({ username, password }) => {
    if (username === 'admin' && password === hashString('admin')) {

      return generateUniqueHashedString(password + Math.random() * 100000)
    }
  })
})

UploadWsServer.listen(wsPort, () => {
  console.log(`> WebSocket server listening on port ${wsPort}`)
})

authServer.listen(authPort, () => {
  console.log(`> Authtication Server listening on port ${authPort}`)
})

app.prepare().then(() => {

  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
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