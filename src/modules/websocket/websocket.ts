import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import { ApiServer } from '../server/apiServer';
import { Message, MessageContent } from '../interfaces/interfaces';
import { MessageService } from '../../services/MessageService';

interface WebSocketMessage {
  message: any;
  meta: 'join' | 'leave' | 'message';
  room: string;
}

class WebSocketSingleton {
  private static instance: WebSocketSingleton;
  private rooms: Record<string, Record<string, WebSocket>> = {};
  private wss: WebSocketServer;

  private constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });
  }

  public sendMessageToUuid(){
    
  }
  public sendMessageToRoom(room:string, message:Message){
    console.log(`Sending message to room ${room}: ${JSON.stringify(message)}`)
    if (this.rooms[room]) {
      Object.values(this.rooms[room])
        .forEach((clientWs: WebSocket) => {
          clientWs.send(JSON.stringify(message));
        });
    }else{
      console.log(`Room ${room} does not exist`);
    }
  }
  public kickClient(uuid_info:string,room: string): void{
    console.log(`${uuid_info} - Leaving room ${room}`);
    if (!this.rooms[room]?.[uuid_info]) return;
    delete this.rooms[room][uuid_info];
  };
  public async joinRoom(uuid_info:string,room: string, ws: WebSocket): Promise<void>{  
    console.log(`${uuid_info} - JOINING room ${room}`);
    if (!this.rooms[room]) this.rooms[room] = {}; // create the room
    let data:Message & {messages:MessageContent[]}  = {
      messages:[],
      meta:"pull_from_db",
      room:room
    }
    const messageService = new MessageService()
    const messageDB = await messageService
      .findAll({where:{room:room},order:{create_date:"ASC"}})
    data.messages = messageDB.map((item)=>{
      return { 
        address: item.address,
        amount: item.amount,
        url: item.url,
        timestamp: item.create_date
      }
    }) 
    ws.send(JSON.stringify(data))
    if (!this.rooms[room][uuid_info]) this.rooms[room][uuid_info] = ws; // join the room
  }
  
  public init(): void {
    try{
      this.wss.on('connection', (ws: WebSocket) => {
        const uuid_info = v4();
        console.log('Client connected');
        ws.on('message', (dataBuffer: Buffer) => {
          const data = dataBuffer.toString().trim();
          if(!["{","["].includes(data[0])){
            console.log(data)
            return;
          }
          const { message, meta, room }: WebSocketMessage = JSON.parse(dataBuffer.toString());
          switch (meta) {
            case 'join':
              console.log("JOINING")
              this.joinRoom(uuid_info,room,ws);
              console.log(this.rooms)
            break;
            case 'leave':
              console.log("LEAVING")

              this.kickClient(uuid_info,room);
            break;
              case 'message':
              //this.sendMessage(room, message);
            break;
            default:
              console.warn(`Unknown message meta: ${meta}`);
            }
        })
        
        ws.on('close', () => {
          try{
            console.log('Client disconnected');
            // Optionally, remove the client from all rooms they might be in
            for (const room in this.rooms) {
              if (this.rooms[room][uuid_info]) {
                delete this.rooms[room][uuid_info];
              }
            }
          }catch(e){
            console.error(e);
          }
        })
      });
    }catch(e){
        console.error(e);
    }
}

  public close(callback?: () => void): void {
    console.log('Closing WebSocket server...');
    this.wss.close(callback);
  }

  public getRooms(): Record<string, Record<string, WebSocket>> {
    return this.rooms;
  }

  public static getInstance(): WebSocketSingleton {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocketSingleton(ApiServer.getInstance().server);
    } 
    return WebSocketSingleton.instance;
  }
}

const webSocketSingleton = WebSocketSingleton.getInstance();
export { webSocketSingleton };