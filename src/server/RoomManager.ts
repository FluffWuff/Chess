import { ClientData, GameServer } from "./GameServer";
import { Room } from "./Room";

export class RoomManager {

    private rooms: Map<String, Room>

    constructor(gameServer: GameServer) {
        this.rooms =  new Map<String, Room>()
    }

    createRoom(clientData: ClientData): string {
        let roomID = this.generateRoomID()

        let room = new Room(clientData, roomID)       
        this.rooms.set(roomID, room)
        console.log(this.rooms)
        return roomID
    }

    deleteRoom(roomID: string) {

    }

    getRoom(roomID: string): Room {
        return this.rooms.get(roomID)
    }

    updateRoom(room: Room) {
        this.rooms.set(room.roomID, room)
    }

    private generateRoomID(): string {
        let outString: string = '';
        let inOptions: string = '0123456789';
        for (let i = 0; i < 4; i++)
          outString += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
        return outString;
    }

}