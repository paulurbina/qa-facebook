
const request = require('request')
const APP_TOKEN = 'EAANojZAZBeuLQBAGMbFGy2QzjcEeihjlzgWKcIn1y8yAkKhP01ioHR8sgJ8otppUm82XZCQ6TwuXeYMZCSSQFahgds4FpIKayZATA8vaV2ZBfnYdkbo5LAFqHHjPsqEqNJR5tPRyEciKHvVam1ZCak878BDvJ9tPDE5SFJU5YNoXgZDZD'



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
