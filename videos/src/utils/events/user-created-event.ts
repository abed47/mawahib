import { Subjects } from "./subjects";

export interface UserCreatedEvent{
    subject: Subjects.UserCreated;
    data:any
}