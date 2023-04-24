import { ClientData } from "./GameServer";

export class Room {
    
    clients: [ClientData, ClientData]

    constructor(public host: ClientData, public sessionID: string) {

    }

}