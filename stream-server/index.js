const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { spawn, exec } = require("child_process");
const process = require("process");
const dotenv = require('dotenv');
const { Client } = require('pg');
const https = require('https');

dotenv.config();

const app = express();


let server = null;

if(process.env.NODE_ENV === "production"){
    server = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/mawahib.tv//privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/mawahib.tv//fullchain.pem'),
    }, app);
}else{
    server = http.createServer(app);
}

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

client.connect(err => {
    if(err) return console.log('error connecting');
    console.log('connected to db')
})

const videoLiveActive = (t) => {
    client.query(`UPDATE videos SET status = 2001 WHERE video_uid = '${t}'`)
    .then(r => {})
    .catch(err => console.log(err));
}

const videoLiveInactive = (t) => {
    client.query(`UPDATE videos SET status = 2002 WHERE video_uid = '${t}'`)
    .then(r => {})
    .catch(err => console.log(err));
}

// client.query('select * from users').then(r => {
//     console.log(r);
// })

/**
 * @type {socketIo.Socket}
 */
let io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


let streams = {};


/**
 * 
 * @param {socketIo.Socket} socket 
 */
const handleSocket = (socket) => {

    socket.on('disconnected', () => {
        'socket disconnected'
    });

    socket.on('join-room', (e) => {
        socket.join(e.roomId);
    });

    socket.on('send-comment', e => {
        //save comment to database
        //send comment to all users
        io.to(e.roomId).emit('new-comment', e);
    })

    socket.on('data', (e) => {
        if(streams[e.roomId]){
            console.log('recieved sdata')
            streams[e.roomId].stdin.write(e.data);
        }else{
            streams[e.roomId] = spawn("ffmpeg", [
                '-i','-',
                '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
                '-c:a', 'aac', '-ar', '44100', '-b:a', '64k',
                '-y', //force to overwrite
                '-use_wallclock_as_timestamps', '1', // used for audio sync
                '-async', '1', // used for audio sync
                '-bufsize', '1000',
                '-f',
                'flv',
                "../last-test2.flv"
            ])
            console.log('stream should start here')
            
            videoLiveActive(e.roomId);
            io.to(e.roomId).emit('begin')
        }
    });

    socket.on('comment', e => {
        console.log(e);
    });

    socket.on('end', e => {
        videoLiveInactive(e.roomId);
        io.to(e.roomId).emit('end-stream')
    })

    socket.on('disconnect', () => {
        // ffmpeg.kill();
        console.log('disconnected: ', socket.id)
    })

    // socket.on('end-stream', e => {
    //     //handle end stream
    // })
}

io.on('connection', handleSocket);

server.listen(4005, () => {
    console.log('server started')
})
