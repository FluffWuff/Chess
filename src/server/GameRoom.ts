import { ClientData } from "./GameServer.js";

export class Room {
    
    clients: [ClientData, ClientData]

    constructor(public host: ClientData, public sessionID: string) {

    }

}