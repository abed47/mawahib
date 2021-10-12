import { Message, Stan, Subscription } from 'node-nats-streaming';
import Listener from './base-listener';
import { Subjects } from './subjects';
import { UserCreatedEvent } from './user-created-event';