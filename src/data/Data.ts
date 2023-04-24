export type ClientMessage = ClientMessageNewClient

export type ClientMessageNewClient = {

}

//
export type ServerMessage = null

export type ServerMessageNewClient = {
    type: "newClient",
    name: string,
}

export type ServerMessageSendChessMove = {
    type: "sendChessMove",
    move: string
}
