import express from 'express';
import ws from 'ws';
import serveStatic from 'serve-static';
import { RoomManager } from './RoomManager.js';
import { ClientMessageNewClient, ServerMessage, ServerMessageSendChessMove } from '../data/Data.js';

export type ClientData = {
    socket: ws,
    name: string,
    currentRoom: string
}

export class GameServer {
    gameServerExpress: express.Express = express()
    wsServer: ws.Server

    roomManager: RoomManager

    socketToClientDataMap: Map<ws, ClientData> = new Map()

    constructor() {
        this.gameServerExpress.use(serveStatic('./htodcs/'))
        const server = this.gameServerExpress.listen(5600)
        console.log("Server listening on port 5600")

        this.wsServer = new ws.Server({ noServer: true });

        let that = this;

        server.on('upgrade', (request, socket, head) => {
            that.wsServer.handleUpgrade(request, socket, head, socket => {

                that.onWebSocketConnect(socket);

                socket.on('message', (message: ws.Data) => {
                    that.onWebSocketClientMessage(socket, message);
                })

                socket.on('close', () => {
                    that.onWebSocketClientClosed(socket);
                })

            });
        });

        this.roomManager = new RoomManager(this)
    }

    onWebSocketConnect(socket: ws) {
        this.socketToClientDataMap.set(socket, {
            socket: socket,
            name: null,
            currentRoom: null
        })
        console.log("Neuer Spieler connected")
    }

    onWebSocketClientMessage(socket: ws, messageJson: ws.Data) {
        let message = JSON.parse(<string>messageJson)
        let clientData: ClientData = this.socketToClientDataMap.get(socket)

        switch (message.type) {
            case "newClient":
                clientData = {
                    socket: socket,
                    name: message.name,
                    currentRoom: null
                }
                this.socketToClientDataMap.set(socket, clientData)
                break
            case "newRoom":
                let roomID = this.roomManager.createRoom(clientData)
                clientData.currentRoom = roomID
                this.sendMessageToClient(socket, {
                    type: "newRoom",
                    roomID: roomID
                })
                break
            case "enterRoomCode":
                let room = this.roomManager.getRoom(message.roomID)
                if (typeof room == undefined) { //RoomCode is invalid
                    this.sendMessageToClient(socket, {
                        type: "invalidRoomCode",
                        roomID: message.roomID
                    })
                    break
                }
                clientData.currentRoom = message.roomID
                room.clients[1] = clientData
                this.sendMessageToClient(socket, {
                    type: "startingGame",
                    clientName: room.host.name
                })
                this.sendMessageToClient(room.host.socket, {
                    type: "startingGame",
                    clientName: clientData.name
                })
                break
            case "sendChessMove":
                room = this.roomManager.getRoom(message.roomID)
                room.moves.push(message.move)
                let sendChessMove: ServerMessageSendChessMove = {
                    type: "sendChessMove",
                    from: message.from,
                    to: message.to
                }
                this.sendMessageToClient(room.clients[0].socket, sendChessMove)
                this.sendMessageToClient(room.clients[1].socket, sendChessMove)
                break
        }

    }

    onWebSocketClientClosed(socket: ws) {

    }

    sendMessageToClient(client: ws, message: ServerMessage) {
        let messageAsJson = JSON.stringify(message)
        client.send(messageAsJson)
    }



}

new GameServer()