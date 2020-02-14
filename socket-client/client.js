/**
 * Librerias
 */
const app = require('express')()
const server = require('http').Server(app)

const io = require('socket.io-client')
const socket = io('http://localhost:9090');

/**
 * Instanciamos  
 */
server.listen(8086, () => console.log('client up!'))

app.get('/send', (req, res) => {
    const data = {
        recipient: {
            id: '2697921220289196'
        },
        message: {
            text: 'enviando desde cliente' 
        }
    }
    socket.emit('responseMessageFacebook', data );
        //id: 1231, 
        //text: 'enviando desde cliente' 
})

socket.on('newMessageFacebook',  (data) => {
    // Enviar a Facebook
    console.log(data)
  })