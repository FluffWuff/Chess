import { ClientData, GameServer } from "./GameServer";
import { Room } from "./Room";

export class RoomManager {

    private rooms: Map<String, Room> = new Map<String, Room>()

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

    getRoom(roomID: string): Room {
        return this.rooms.get(roomID)
    }

    private generateRoomID(): string {
        let outString: string = '';
        let inOptions: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++)
          outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        return outString;
    }

}