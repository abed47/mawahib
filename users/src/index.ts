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
import * as path from 'path';
import * as fs from 'fs';
import * as upload from 'express-fileupload';
import { natsWrapper } from './nats-wrapper';
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
  natsWrapper.connect('mawahib', 'users-service', 'http://localhost:4222').then();

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
app.use('/api/v1/u/utils', UtilsRoutes);
app.use('/api/v1/u/auth', AuthRoutes);
app.use('/api/v1/u/user', UserRoutes);
app.use('/api/v1/u', SubscriptionRoutes);
app.use('/api/v1/u/channel', ChannelRoutes);
app.use('/api/v1/u/uploads', express.static(path.join(__dirname, '../uploads')));
// app.use('/public', express.static)

app.listen(process.env.PORT, () => {
    console.log('server started');
});