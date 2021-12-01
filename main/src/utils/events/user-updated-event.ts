import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { User } from "../../database/models";

export interface UserUpdatedEvent{
    subject: Subjects.UserUpdated;
    data:any
}

export class UserUpdatedListener extends Listener<UserUpdatedEvent>{
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
    queueGroupName = 'user-service';

    async onMessage(data: any, msg: Message){        
        try{
            await User.update(data, {where:{id: data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent>{
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
}