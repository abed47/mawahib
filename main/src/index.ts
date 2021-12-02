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
import LikeRoutes from './routes/v1/like.routes';
import CommentRoutes from './routes/v1/like.routes';
import CategoryRoutes from './routes/v1/category.routes';

import * as path from 'path';
import * as fs from 'fs';
import * as upload from 'express-fileupload';
//enable env file
dotenv.config();

//initialize app
const app: express.Express = express();

//add app middleware
app.use(bodyParser.json());
app.use(cors());
app.use(upload());

//connect to database
db.connect();

//apply routes
app.use('/api/v1/utils', UtilsRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1', SubscriptionRoutes);
app.use('/api/v1/channel', ChannelRoutes);
app.use('/api/v1/like', LikeRoutes);
app.use('/api/v1/video', VideoRoutes);
app.use('/api/v1/comment', CommentRoutes);
app.use('/api/v1/category', CategoryRoutes);
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use('/public', express.static)
app.get('/', (req, res) => {res.send('working')})
app.listen(process.env.PORT, () => {
    console.log('server started on: ' + process.env.PORT);
});