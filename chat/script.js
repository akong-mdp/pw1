const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/view/index.html')

})

io.on('connection', (socket) => {
    socket.on('chat', (msg) => {
        io.emit('chat', msg)
    })
})

http.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})