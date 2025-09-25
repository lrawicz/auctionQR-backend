import { Observer } from "../events/Observer";
import { Message } from "../interfaces/interfaces";
import { MessageService } from "../../services/MessageService";
import { webSocketSingleton } from "./websocket";

export class WebSocketNotifier implements Observer {
    public async update(message: Required<Message>): Promise<void> {
        const messageService = new MessageService ()
        console.log(`WebSocketNotifier: Sending message to room ${message.room}`);
        const data = await messageService.findAll({where:{
            room:message.room,
            address:message.content.address,
            amount:message.content.amount,
            url:message.content.url
        }})
        if(data.length>0){
            console.log("Message already exists in DB, skipping...")
            return;
        }

        await messageService.create({
            address:message.content.address,
            amount:message.content.amount,
            room:message.room,
            url:message.content.url,
        })
        webSocketSingleton.sendMessageToRoom(message.room, message);
    }
}
