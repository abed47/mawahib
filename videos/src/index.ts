import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as db from './database';
import * as cors from 'cors';
import VideoRoutes from './routes/v1/video.routes';
import * as upload from 'express-fileupload';
import * as path from 'path';
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
    natsWrapper.connect('mawahib', 'video-service', 'http://localhost:4222').then();
  
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
app.use('/api/v1/v/videos', VideoRoutes);
app.use('/api/v1/v/uploads', express.static(path.join(__dirname, '../uploads')));


app.listen(process.env.PORT, () => {
    console.log('server started');
});