import * as express from 'express'
import * as ws from 'ws'
import * as serveStatic from 'serve-static';
import { RoomManager } from './RoomManager.js';

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
        let message = JSON.parse(<string> messageJson)
        let clientData: ClientData = this.socketToClientDataMap.get(socket)

        switch(message.type) {

        }

    }

    onWebSocketClientClosed(socket: ws) {

    }

}

new GameServer()