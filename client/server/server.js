//https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
//https://medium.com/@mohammadaliasghar523/creating-a-real-time-chat-app-with-next-js-and-websockets-e41fd131949c
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const axios = require('axios')

const dev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'
console.log("In dev mode", dev)

const { wsPort, serverPort, authServerPort, wsKey, apiPort, hostname } = require('../server.config.js');

const app = next({ dev, hostname, serverPort })
const handle = app.getRequestHandler()

const websocketServer = createServer((req, res) => {
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

      io.to(socketId).emit(key, value)

      res.statusCode = 200
      res.end('Message sent successfully')
    })
  } else {
    res.statusCode = 400
    res.end('Bad request')
  }
})

const { Server } = require('socket.io')
const io = new Server(websocketServer, {
  cors: {
    origin: websocketServer,
    methods: ["GET", "POST"]
  }
})
io.on('connection', (socket) => {
  console.log('A user connected')

  socket.on('disconnect', () => {
    console.log('A user disconnected')
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

      const response = await axios.post('http://backend-api-url', {
        username,
        password
      });

      res.json(response.data);
      res.statusCode = 200
      res.end(JSON.stringify(response))
    })
  } else {
    res.statusCode = 400
    res.end('Bad request')
  }
})

websocketServer.listen(wsPort, () => {
  console.log(`> WebSocket server listening on port ${wsPort}`)
})

authServer.listen(authServerPort, () => {
  console.log(`> Authtication Server running on http://${hostname}:${authServerPort}`)
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