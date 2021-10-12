import { Message, Stan, Subscription } from 'node-nats-streaming';
import Listener from './base-listener';
import { Subjects } from './subjects';
import { UserCreatedEvent } from './user-created-event';

export class UserCreatedListener extends Listener<UserCreatedEvent>{
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName = 'user-service';

    onMessage(data: any, msg: Message){
        console.log('message recieved', msg);

        msg.ack();
    }
}