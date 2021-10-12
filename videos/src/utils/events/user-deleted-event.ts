import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface UserDeleteEvent{
    subject: Subjects.UserDeleted;
    data:any
}

export class UserDeletedPublisher extends Publisher<UserDeleteEvent>{
    subject: Subjects.UserDeleted = Subjects.UserDeleted;
}