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
import CommentRoutes from './routes/v1/comment.routes';
import CategoryRoutes from './routes/v1/category.routes';
import PlaylistRoutes from './routes/v1/playlist.routes';
import PurchasesRoutes from './routes/v1/purchases.routes';
import EventRoutes from './routes/v1/event.routes';

//metrics 
import * as expressMetrics from 'express-status-monitor';

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as upload from 'express-fileupload';
import initAdminPanel from './admin';
//enable env file
dotenv.config();

//initialize app
const app: express.Express = express();

//add app middleware
app.use(expressMetrics());
app.use(bodyParser.json());
app.use(cors());

//connect to database
db.connect();

//initialize admin panel
let adminPanel = initAdminPanel(db.db);

//apply routes
app.use('/api/v1/utils', upload(), UtilsRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', upload(), UserRoutes);
app.use('/api/v1', SubscriptionRoutes);
app.use('/api/v1/channel', upload(), ChannelRoutes);
app.use('/api/v1/like', LikeRoutes);
app.use('/api/v1/video', VideoRoutes);
app.use('/api/v1/comment', CommentRoutes);
app.use('/api/v1/category', upload(), CategoryRoutes);
app.use('/api/v1/playlist', PlaylistRoutes);
app.use('/api/v1/purchases', PurchasesRoutes);
app.use('/api/v1/event', EventRoutes);
app.use('/api/v1/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/admin', adminPanel);
// app.use('/public', express.static)
app.get('/', (req, res) => {res.send('OK')});

if(process.env.NODE_ENV === "production"){
    const httpsServer = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/mawahib.tv//privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/mawahib.tv//fullchain.pem'),
    }, app);

    httpsServer.listen(process.env.PORT || 4000, () => {
        console.log('secure serve started')
    });
}else {
    app.listen(process.env.PORT || 4000, () => {
        console.log('server started on: ' + process.env.PORT);
    });
}