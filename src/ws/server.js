// Copyright (C) 2019 Beezig Team (RoccoDev, ItsNiklass)
// 
// This file is part of "Beezig API Server".
// 
// "Beezig API Server" is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// "Beezig API Server" is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with "Beezig API Server".  If not, see <http://www.gnu.org/licenses/>.

const WebSocketServer = require('ws').Server
const HttpServer = require('http')

const Connection = require('./connection.js')

let connectionsPool = []
let messagesRegistry = {}

const interval = setInterval(() => {
    connectionsPool.forEach((conn) => {
        let ws = conn.entity
        if (ws.isAlive === false) return ws.terminate()

        ws.alive = false
        ws.ping(() => { })
    })
}, 30000)

function connect(expressServer) {
    let httpServer = HttpServer.createServer(expressServer)

    let webSocketServer = new WebSocketServer({
        server: httpServer,
        autoAcceptConnections: true
    })

    webSocketServer.on('connection', (connection) => {
        connection.alive = true

        connection.on('pong', clientHeartbeat)

        let ourEntity = new Connection(undefined, connection)
        connectionsPool.push(ourEntity)

        connection.on('close', (code, reason) => {
            connectionsPool = connectionsPool.filter(item => item !== ourEntity)
        })

        connection.on('message', (data) => {
            try {
                let message = JSON.parse(data)

                /* Return an error if the opcode is invalid */
                if (!messagesRegistry[message.opcode]) {
                    ourEntity.send({
                        opcode: 0x0,
                        data: 'Invalid message code.'
                    })
                }

                messagesRegistry[message.opcode].call(message.data, ourEntity)
            } catch (error) {
                ourEntity.send({
                    opcode: 0x0,
                    data: 'Invalid JSON message.'
                })
            }
        })
    })

    httpServer.listen(process.env.PORT || 8080)
}

function clientHeartbeat() {
    this.alive = true
}

function registerMessage(name) {
    let Class = require(`./messages/${name}.js`)
    let instance = new Class()
    messagesRegistry[instance.opcode()] = instance
}

function register() {
    registerMessage('online_users')
}

module.exports = {
    connect: connect,
    pool: connectionsPool,
    messages: messagesRegistry,
    register: register
}
