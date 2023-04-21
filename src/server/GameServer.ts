import * as express from 'express'
import * as ws from 'ws'
import * as serveStatic from 'serve-static';
import { Room } from './GameRoom.js'

export type ClientData = {

}

class GameServer {
    gameServerExpress: express.Express = express()
    wsServer: ws.Server     

    rooms: Map<String, Room> = new Map()

    constructor() {
        this.gameServerExpress.use(serveStatic('./htodcs/'))
        const server = this.gameServerExpress.listen(5600)
        console.log("Server listening on port 5600")

        this.wsServer = new ws.Server({ noServer: true });

        let that = this;

        /**
         * To open a websocket connection a client send a http upgrade-request to the http-server.
         * The http-server then passes the underlying tcp-connection to the websocket server.
         */
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
    }

    onWebSocketConnect(socket: ws) {

    }

    onWebSocketClientMessage(socket: ws, message: ws.Data) {

    }

    onWebSocketClientClosed(socket: ws) {

    }

}

new GameServer()