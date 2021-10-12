import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { User } from "../../database/models";

export interface UserDeleteEvent{
    subject: Subjects.UserDeleted;
    data:any
}

export class UserDeletedListener extends Listener<UserDeleteEvent>{
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await User.destroy({where:{id: data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class UserDeletedPublisher extends Publisher<UserDeleteEvent>{
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
}