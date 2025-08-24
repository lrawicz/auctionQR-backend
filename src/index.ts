import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid'
const rooms:Record<string,Record<string,WebSocket>> = {};

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.get('/qr', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


wss.on('connection', (ws:WebSocket) => {
  const uuid_info = v4();
  console.log('Client connected');

  const leave = (room:string) => {
    console.log(`${uuid_info} - Leaving room ${room}`)
    if(! rooms[room][uuid_info]) return;
    delete rooms[room][uuid_info]
  };
  
  ws.on('message', (data:any) => {
    const { message, meta, room } = JSON.parse(data.toString());
    switch(meta){
      case "join":
          console.log(`${uuid_info} - JOINING room ${room}`)
          if(! rooms[room]) rooms[room] = {}; // create the room
          if(! rooms[room][uuid_info]) rooms[room][uuid_info] = ws; // join the room
        break;
      case "leave":
        leave(room);
        break;
      case "message":
        Object.entries(rooms[room]).map((item)=>{
          item[1].send(JSON.stringify(message))
        })
        break;

    }

    })

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
