import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as db from './database';
import * as cors from 'cors';
import UtilsRoutes from './routes/v1/utils.routes';
import AuthRoutes from './routes/v1/auth.routes';
import UserRoutes from './routes/v1/users.routes';
import ChannelRoutes from './routes/v1/channel.routes';
import SubscriptionRoutes from './routes/v1/subscriptions.routes';
import VideoRoutes from './routes/v1/video.routes';
import CommentRoutes from './routes/v1/comment.routes';
import * as path from 'path';
import * as fs from 'fs';
import * as upload from 'express-fileupload';
import {natsWrapper} from './nats-wrapper';
import { UserCreatedListener } from './utils/events/user-created-listener';
import { UserUpdatedListener } from './utils/events/user-updated-event';
import { UserDeletedListener } from './utils/events/user-deleted-event';
import { ChannelCreatedListener } from './utils/events/channel-created-event';
import { ChannelUpdatedListener } from './utils/events/channel-updated-event';
import { ChannelDeletedListener } from './utils/events/channel-deleted-event';
import { ChannelSubscriptionListener } from './utils/events/channel-subscription-event';
import { ChannelUnsubscribeListener } from './utils/events/channel-unsubscribe-event';
import { VideoCreatedListener } from './utils/events/video-created-event';
import { VideoUpdatedListener } from './utils/events/video-updated-evet';
import { VideoDislikeListener } from './utils/events/video-dislike-event';
import { VideoLikeListener } from './utils/events/video-like-event';
import { VideoDeletedListener } from './utils/events/video-deleted-event';
import { CommentCreatedListener } from './utils/events/comment-create-event';
import { CommentUpdatedListener } from './utils/events/comment-updated-event';
import { CommentDeletedListener } from './utils/events/comment-deleted-event';
import { CategoryCreatedListener } from './utils/events/category-created-event';
import { CategoryUpdatedListener } from './utils/events/category-updated-event';
import { CategoryDeletedListener } from './utils/events/category-deleted-event';
import { VideoViewListener } from './utils/events/video-view-event';
import * as DbOptions from './database';
//enable env file
dotenv.config();

//initialize app
const app: express.Express = express();

//add app middleware
app.use(bodyParser.json());
app.use(cors());
app.use(upload());

//connect to nats
try{
    DbOptions.connect();
    natsWrapper.connect('mawahib', 'query-service', 'http://localhost:4222').then();

    //init listeners
    natsWrapper.client.on('connect', () => {
        //user listeners
        new UserCreatedListener(natsWrapper.client).listen();
        new UserUpdatedListener(natsWrapper.client).listen();
        new UserDeletedListener(natsWrapper.client).listen();
        //channel listeners
        new ChannelCreatedListener(natsWrapper.client).listen();
        new ChannelUpdatedListener(natsWrapper.client).listen();
        new ChannelDeletedListener(natsWrapper.client).listen();
        new ChannelSubscriptionListener(natsWrapper.client).listen();
        new ChannelUnsubscribeListener(natsWrapper.client).listen();
        //video listeners
        new VideoCreatedListener(natsWrapper.client).listen();
        new VideoUpdatedListener(natsWrapper.client).listen();
        new VideoDislikeListener(natsWrapper.client).listen();
        new VideoLikeListener(natsWrapper.client).listen();
        new VideoDeletedListener(natsWrapper.client).listen();
        new VideoViewListener(natsWrapper.client).listen();
        //comment events
        new CommentCreatedListener(natsWrapper.client).listen();
        new CommentUpdatedListener(natsWrapper.client).listen();
        new CommentDeletedListener(natsWrapper.client).listen();
        //category events
        new CategoryCreatedListener(natsWrapper.client).listen();
        new CategoryUpdatedListener(natsWrapper.client).listen();
        new CategoryDeletedListener(natsWrapper.client).listen();
    })

    
    natsWrapper.client.on('close', () => {
        console.log('Nats Connection closed!');
        process.exit();
    });
    process.on('SIGTERM', () => natsWrapper.client.close());
    process.on('SIGINT', () => natsWrapper.client.close());
}catch(err){
    console.log(err);
}

//connect to database
db.connect();

//apply routes
app.use('/api/v1/q/utils', UtilsRoutes);
app.use('/api/v1/q/auth', AuthRoutes);
app.use('/api/v1/q/user', UserRoutes);
app.use('/api/v1/q', SubscriptionRoutes);
app.use('/api/v1/q/channel', ChannelRoutes);
app.use('/api/v1/q/comments', CommentRoutes);
app.use('/api/v1/q/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/v1/q/videos', VideoRoutes);
// app.use('/public', express.static)

app.listen(process.env.PORT, () => {
    console.log('server started');
});