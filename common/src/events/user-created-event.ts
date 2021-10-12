import { Subjects } from "./subjects";

export interface UserCreatedEvent{
    subject: Subjects.UserCreated;
    data:{
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        password: string
    }
}