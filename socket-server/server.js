/**
 * Librerias
 */
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { callSendAPI } = require('../qa-facebook')
// const bodyParser = require('body-parser')

/**
 * Instanciamos  
 */
// app.use(bodyParser.json())

server.listen(9090, ()=>console.log('server up 9090'))

app.get('/webhooks', (req, res) => {

  let VERIFY_TOKEN = 'test-token-face'

  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

      if (token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403)
      }
})

app.post('/webhooks', (req, res) => {
  const data = req.body

  if(data.object === 'page') {
      data.entry.forEach(pageEntry => {
          pageEntry.messaging.forEach(messagingEvent => {
              if (messagingEvent.message) {
                  receiveMessage(messagingEvent)
              }
          })
      })
      res.sendStatus(200)
  }
})

app.get('/enviar', (req, res) => {
  io.sockets.emit('newMessageFacebook', req)
})

// Initialize sockets
io.on('connection', (socket) => {
  console.log('User connected')
  socket.on('responseMessageFacebook', (data) => {
    callSendAPI(data)
    console.log(data)
  })
})
