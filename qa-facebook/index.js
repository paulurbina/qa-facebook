const app = require('express')()
const bodyParser = require('body-parser')
const request = require('request')
const APP_TOKEN = 'EAANojZAZBeuLQBAGMbFGy2QzjcEeihjlzgWKcIn1y8yAkKhP01ioHR8sgJ8otppUm82XZCQ6TwuXeYMZCSSQFahgds4FpIKayZATA8vaV2ZBfnYdkbo5LAFqHHjPsqEqNJR5tPRyEciKHvVam1ZCak878BDvJ9tPDE5SFJU5YNoXgZDZD'

app.use(bodyParser.json())

app.set('port', 8000)
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
                console.log(messagingEvent)
                if (messagingEvent.message) {
                    receiveMessage(messagingEvent)
                }
            })
        })
        res.sendStatus(200)
    }
})

const receiveMessage = (event) => {
    console.log(event)
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

//app.listen(app.get('port'), () => console.log('Server on port 8000'))


module.exports = {
    callSendAPI
}