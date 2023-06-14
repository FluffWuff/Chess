export type ClientMessage = ClientMessageNewClient | ClientMessageSendChessMove | ClientMessageNewRoomRequest | ClientMessageEnterRoomCode

export type ClientMessageNewClient = {
    type: "newClient",
    name: string
}


export type ClientMessageNewRoomRequest = {
    type: "newRoom",

}

export type ClientMessageSendChessMove = {
    type: "sendChessMove",
    roomID: string,
    from: string,
    to: string,
    whichPlayer: boolean
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
    from: string,
    to: string,
    whichPlayer: boolean
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
    whitePiecePlayer: string,
    blackPiecePlayer: string,
    roomID: string,
    whichPiece: boolean
}