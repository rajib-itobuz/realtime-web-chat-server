import { WebSocketServer } from 'ws';
import { v4 as uuidV4 } from 'uuid';

const port = 5000;

// websocket
const wss = new WebSocketServer({ port: 8080 });
const client = {};

wss.on('connection', (ws) => {
    console.log('New client connected');
    let userName = null;
    let chatroomId = null;
    let uid = null;

    ws.on('message', (message) => {
        const eventReceived = JSON.parse(message);
        if (eventReceived.event === 'chatroomconnect') {
            uid = uuidV4();
            userName = eventReceived.username;
            chatroomId = eventReceived.message;


            if (client[eventReceived.message]) {
                client[eventReceived.message].push({ ws, uid, name: eventReceived.username });
                client[eventReceived.message].forEach(e => e.ws.send(`${userName} has joined`));
            }
            else {
                client[eventReceived.message] = [{ ws, uid, name: eventReceived.username }]
            }
        }
        else if (eventReceived.event === "message") {
            client[eventReceived.uid].forEach(e => {
                if (e.ws != ws)
                    e.ws.send(`${userName} : ${eventReceived.message}`);
            })
        }

    });

    ws.on('close', () => {
        console.log("Client Disconnected");
        if (uid && userName)
            client[chatroomId].slice({ ws, uid, name: userName }, 1);
        client[chatroomId].forEach(e => e.ws.send(`${userName} has left`));

    });
});