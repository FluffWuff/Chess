export type ClientMessage = ClientMessageNewClient | ClientMessageSendChessMove | ClientMessageNewRoom | ClientMessageEnterRoomCode

export type ClientMessageNewClient = {
    type: "newClient",
    name: string
}


export type ClientMessageNewRoom = {
    type: "newRoom",

}

export type ClientMessageSendChessMove = {
    type: "sendChessMove",
    roomID: string,
    move: string
}

export type ClientMessageEnterRoomCode = {
    type: "enterRoomCode",
    roomID: string
}

//
export type ServerMessage = ServerMessageNewClient | ServerMessageSendChessMove | ServerMessageNewRoom | ServerMessageInvalidRoomCode | ServerMessageStartingGame

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

export type ServerMessageInvalidRoomCode = {
    type: "invalidRoomCode",
    roomID: string
}

export type ServerMessageStartingGame = {
    type: "startingGame",
    clientName: string,

}