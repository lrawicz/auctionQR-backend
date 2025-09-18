import { Observer } from "../events/Observer";
import { Message } from "../interfaces/interfaces";
import { MessageService } from "../message/MessageService";
import { webSocketSingleton } from "./websocket";

export class WebSocketNotifier implements Observer {
    public async update(message: Required<Message>): Promise<void> {
        const messageService = new MessageService ()
        console.log(`WebSocketNotifier: Sending message to room ${message.room}`);
        let data = await messageService.findAll({where:{
            room:message.room,
            address:message.message.address,
            amount:message.message.amount,
            url:message.message.url
        }})
        if(data.length>0){
            console.log("Message already exists in DB, skipping...")
            return;
        }
        await messageService.create({
            address:message.message.address,
            amount:message.message.amount,
            room:message.room,
            url:message.message.url,
        })
        webSocketSingleton.sendMessageToRoom(message.room, message);
    }
}
