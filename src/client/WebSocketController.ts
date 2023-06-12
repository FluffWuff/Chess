import { ServerMessage, ClientMessage } from "../data/Data.js";

export interface WebSocketListener {
    onMessage(message: ServerMessage): void
}

export class WebSocketController {

    connection: WebSocket
    connectionReady = false

    constructor(private messageListener: WebSocketListener, onWebSocketReady?: (controller: WebSocketController) => void) {
        let url: string = (window.location.protocol.startsWith("https") ? "wss://" : "ws://") + window.location.host;
        console.log(url)
        this.connection = new WebSocket(url);

        let that = this;

        this.connection.onopen = function () {
            that.connectionReady = true;

            if (onWebSocketReady != null) {
                onWebSocketReady(that);
            }
        };

        this.connection.onmessage = function (message) {
            try {
                var serverMessage: ServerMessage = JSON.parse(message.data);
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ',
                    message.data);
                return;
            }

            that.messageListener.onMessage(serverMessage);
        };

    }

    public send(message: ClientMessage) {
        if (!this.connectionReady) {
            console.log("Not conneceted yet")
            return;
        }
        this.connection.send(JSON.stringify(message));
    }


}