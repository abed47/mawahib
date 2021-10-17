import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Category from "../../database/models/category";

export interface CategoryCreatedEvent{
    subject: Subjects.CategoryCreated;
    data:any
}

export class CategoryCreatedListener extends Listener<CategoryCreatedEvent>{
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Category.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CategoryCreatedPublisher extends Publisher<CategoryCreatedEvent>{
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
}