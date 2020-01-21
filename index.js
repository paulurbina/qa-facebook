const app = require('express')()
const bodyParser = require('body-parser')
const request = require('request')
const APP_TOKEN = 'EAANojZAZBeuLQBAJ3AnFbHV6So1oPS4rb4dcs19gZB1I2MpFA3y1u9cDV8x30w9nsDbcVyJVoNNO0fccZAQmTvsYQCrn8viytB7eQZABVKYpWygp2Ec9HleSikvABaWhZCSrUjTYD9F10qZC0sREuuwVw2oT9ZAkExJPVvtVqi8koepuFWQBclSO'


app.use(bodyParser.json())

app.set('port', process.env.PORT || 8000)
app.get('/', (req, res) => {
    res.send('hola')
})

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

const receiveMessage = (event) => {
    const senderId = event.sender.id
    const messageText = event.message.text

    evaluateMessage(senderId, messageText)
}

const evaluateMessage = (recipientId, message) => {
    let finalMessage = ''
    if(isContainerMessage(message, 'hola')) {
        finalMessage = 'buenos dias'
    } else {
        finalMessage = 'no puedo hacer nada'
    }

    sendMessageText(recipientId, finalMessage)
}

const sendMessageText = (recipientId, message) => {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: message
        }
    }

    callSendAPI(messageData)
}

const callSendAPI = (messageData) => {
    request({
        uri: 'https://graph.facebook.com/v5.0/me/messages',
        qs: { "access_token": APP_TOKEN },
        method: 'POST',
        json: messageData
    }, (err, res, data) => {
        if (err) throw err
        console.log('Message send!')
    })
}

const isContainerMessage = (sentence, word) => sentence.indexOf(word) > -1

app.listen(app.get('port'), () => console.log('Server on port 8000'))