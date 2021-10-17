import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Category from "../../database/models/category";

export interface CategoryUpdatedEvent{
    subject: Subjects.CategoryUpdated;
    data:any
}

export class CategoryUpdatedListener extends Listener<CategoryUpdatedEvent>{
    subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Category.update(data, { where: { id: data.id } });
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CategoryUpdatedPublisher extends Publisher<CategoryUpdatedEvent>{
    subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
}