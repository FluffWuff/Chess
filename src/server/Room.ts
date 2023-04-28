import { ClientData } from "./GameServer";

export class Room {
    
    clients: [ClientData, ClientData]

    boardInformation: string

    constructor(public host: ClientData, public roomID: string) {
        this.clients = [host, undefined]
        
    }

}