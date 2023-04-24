export type ClientMessage = ClientMessageNewClient | ClientMessageSendChessMove | ClientMessageNewRoom

export type ClientMessageNewClient = {
    type: "newClient",
    name: string
}


export type ClientMessageNewRoom = {
    type: "newRoom",

}

export type ClientMessageSendChessMove = {
    type: "sendChessMove",
    move: string
}


//
export type ServerMessage = ServerMessageNewClient | ServerMessageSendChessMove | ServerMessageNewRoom

export type ServerMessageNewClient = {
    type: "newClient",
    name: string,
}

export type ServerMessageSendChessMove = {
    type: "sendChessMove",
    move: string
}

export type ServerMessageNewRoom = {
    type: "newRoom",
    roomID: string
}