import { ClientData } from "./GameServer";

export class Room {
    
    clients: [ClientData, ClientData]

    moves: string[] =  []

    constructor(public host: ClientData, public roomID: string) {
        this.clients = [host, undefined]
        
    }

}