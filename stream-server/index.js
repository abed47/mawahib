const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const { spawn, exec } = require("child_process");
const process = require("process")

const app = express();


const server = http.createServer(app);



const ffmpeg = (url, key) => {
    return spawn("ffmpeg", [
        '-f', 'lavfi', '-i', 'anullsrc',
    '-i', '-',
    '-vcodec', 'copy',
    '-acodec', 'aac',
    '-f', 'flv',
        `${url}7ec04d6542701a3357dbaf8da2fa46c0k91dd168726453777233f8054969fb5de`
    ]) 
}


/**
 * @type {socketIo.Socket}
 */
let io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


io.on('connection', (socket) => {
    

    console.log('connected ', socket.id);

    socket.on('disconnected', () => {
        'socket disconnected'
    }); 

    socket.on('data', (e) => {
        // ffmpeg.stdin.write(e.stream)
        console.log('data', e)
        let ff = ffmpeg(e.rtmpsUrl, e.rtmpsKey);
        
        ff.stdin.write(e.data);
        ff.on('error', e => console.log('error: ', e));
        ff.stderr.on('data', (data) => {
            console.log('FFmpeg STDERR:', data.toString());
          })
        ff.stderr.on('error', (e) => console.log('str error', e))
        ff.on('close', e => console.log('close', e))
    })
});

io.on('data', (args) => {
    console.log(args)
})

server.listen(4005, () => {
    console.log('server started')
})