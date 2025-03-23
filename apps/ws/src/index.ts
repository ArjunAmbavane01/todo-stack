import client from "@repo/db/client";
import { serve, type ServerWebSocket } from "bun";
import { verify, type JwtPayload } from "jsonwebtoken";

const PORT = 8080;

type WSData = {userId:string};

type WSMsgType = {
    type:"add"|"delete"|"update"|"join"|"left",
    username?:string,
    todoId?:string,
    title?:string,
    description?:string,
    completed?:string
};

const rooms = [];

const getUsername = async (userId:string) => {
    const user = await client.user.findFirst({where:{id:userId}});
    if(user) return user.username;
    return null;
}

const wss = serve({
    port: PORT,
    fetch(req, server) {
        try {
            const authHeader = req.headers.get("authorization");
            const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split('Bearer ')[1] : null;
            const payload = token && verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
            if(payload){
                if (server.upgrade(req, {
                    data: { userId:payload.userId } as WSData
                })) {
                    return;
                }
            }
        } catch (e) {
            return new Response("Upgrade failed", { status: 500 });
        }
    },
    websocket: {
        async open(ws: ServerWebSocket) {
            if(ws.data){
                const userId = (ws.data as WSData).userId;
                const username = await getUsername(userId);
                if(username){
                    const msg = JSON.stringify({
                        type:"join",
                        username
                    } as WSMsgType)
                    ws.subscribe("todo-channel");
                    ws.publish("todo-channel", msg);
                }
                else {
                    ws.send('User Not Found');
                    ws.close();
                }
            }
        },
        message(ws: ServerWebSocket, message:string) {
            ws.publish("todo-channel", JSON.stringify(message));
        },
        async close(ws:ServerWebSocket){
            if(ws.data){
                const userId = (ws.data as WSData).userId;
                const username = await getUsername(userId);
                const msg = JSON.stringify({
                    type:"left",
                    username
                } as WSMsgType)
                ws.publish("the-group-chat", msg);
                ws.unsubscribe("the-group-chat");
            }
        }
    },
});

console.log(`Listening on port ${wss.port}`);