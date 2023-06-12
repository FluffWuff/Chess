import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as ws from 'ws';
import { RoomManager } from './RoomManager';
import { ClientMessageNewClient, ServerMessage, ServerMessageSendChessMove } from '../data/Data';

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
        this.gameServerExpress.use(serveStatic('./htdocs/'))
        const server = this.gameServerExpress.listen(5500)
        console.log("Server listening on port 5500")

        this.wsServer = new ws.Server({ noServer: true });

        let that = this;

        server.on('upgrade', (request, socket, head) => {
            that.wsServer.handleUpgrade(request, socket, head, socket => {

                that.onWebSocketConnect(socket);
                console.log("Hier!");
                socket.on('message', (message: ws.Data) => {
                    console.log({ m: "New message", m1: message});
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
        
    }

    onWebSocketClientMessage(socket: ws, messageJson: ws.Data) {
        let message = JSON.parse(<string>messageJson)
        let clientData: ClientData = this.socketToClientDataMap.get(socket)

        //console.log(message)

        switch (message.type) {
            case "newClient":
                clientData = {
                    socket: socket,
                    name: message.name,
                    currentRoom: null
                }
                this.socketToClientDataMap.set(socket, clientData)
                console.log("new Client connected")
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
                //room = this.roomManager.getRoom(message.roomID)
                //room.moves.push(message.move)
                let sendChessMove: ServerMessageSendChessMove = {
                    type: "sendChessMove",
                    from: message.from,
                    to: message.to
                }
                //this.sendMessageToClient(room.clients[0].socket, sendChessMove)
                //this.sendMessageToClient(room.clients[1].socket, sendChessMove)
                this.sendToAllClientsExceptOne(socket, sendChessMove)
                break
        }

    }

    onWebSocketClientClosed(socket: ws) {

    }

    sendMessageToClient(client: ws, message: ServerMessage) {
        let messageAsJson = JSON.stringify(message)
        client.send(messageAsJson)
    }


    sendToAllClientsExceptOne(dontSendToclientSocket: ws, message: ServerMessage) {
        let messageAsJson = JSON.stringify(message);

        for (let client of this.socketToClientDataMap.keys()) {
            if (client != dontSendToclientSocket) {
                client.send(messageAsJson);
            }
        }
    }
}

new GameServer()