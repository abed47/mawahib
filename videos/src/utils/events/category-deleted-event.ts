import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Category from "../../database/models/category";

export interface CategoryDeletedEvent{
    subject: Subjects.CategoryDeleted;
    data:any
}

export class CategoryDeletedListener extends Listener<CategoryDeletedEvent>{
    subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Category.destroy({where:{id: data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CategoryDeletedPublisher extends Publisher<CategoryDeletedEvent>{
    subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
}