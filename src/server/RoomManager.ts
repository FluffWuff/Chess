import { ClientData, GameServer } from "./GameServer.js";
import { Room } from "./Room.js";

export class RoomManager {

    rooms: Map<String, Room> = new Map<String, Room>()

    constructor(gameServer: GameServer) {

    }

    createRoom(clientData: ClientData): string {
        let roomID = this.generateRoomID()

        let room = new Room(clientData, roomID)       
        this.rooms.set(roomID, room)

        return roomID
    }

    deleteRoom(roomID: string) {

    }

    private generateRoomID(): string {
        let outString: string = '';
        let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++)
          outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        return outString;
    }


}