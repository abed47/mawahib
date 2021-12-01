import { Message, Stan, Subscription } from 'node-nats-streaming';
import { User } from '../../database/models';
import Listener from './base-listener';
import { Subjects } from './subjects';
import { UserCreatedEvent } from './user-created-event';

export class UserCreatedListener extends Listener<UserCreatedEvent>{
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName = 'user-service';

    async onMessage(data: any, msg: Message){
        console.log('message recieved', msg, data);
        
        try{
            await User.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}