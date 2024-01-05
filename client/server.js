//https://nextjs.org/docs/pages/building-your-application/configuring/custom-server
//https://medium.com/@mohammadaliasghar523/creating-a-real-time-chat-app-with-next-js-and-websockets-e41fd131949c
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')


const dev = process.env.NEXT_PUBLIC_APP_ENV !== 'production'
console.log("In dev", dev, process.env)
const hostname = 'localhost'
const wsPort = 3001
const serverPort = 3000
const wsKey = "5093258a6fc320f715eab0543cea2a76"
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, serverPort })
const handle = app.getRequestHandler()


const server = createServer((req, res) => {
  if (req.method === 'POST') {
    const secretKey = req.headers['x-secret-key'];

    if (secretKey !== wsKey) {
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const { socket:socketId, key, value } = JSON.parse(body);

      io.to(socketId).emit(key, value);

      res.statusCode = 200;
      res.end('Message sent successfully');
    });
  } else {
    handle(req, res);
  }
});

const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: server,
    methods: ["GET", "POST"]
  }
});;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(wsPort, () => {
  console.log(`WebSocket server listening on port ${wsPort}`);
}); 

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
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