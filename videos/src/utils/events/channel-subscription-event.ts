import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface ChannelSubscriptionEvent{
    subject: Subjects.ChannelSubscription;
    data:any
}

export class ChannelSubscriptionPublisher extends Publisher<ChannelSubscriptionEvent>{
    subject: Subjects.ChannelSubscription = Subjects.ChannelSubscription;
}