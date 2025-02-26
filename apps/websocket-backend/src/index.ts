import { WebSocket, WebSocketServer } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { prismaClient } from "@repo/db/src/index";

dotenv.config();

const wss = new WebSocketServer({ port:8080 });
const JWT_KEY = process.env.JWT_PASS;
console.log("The jwt key is ", JWT_KEY);

interface user{
  ws: WebSocket,
  rooms: string[],
  userId: string 
}

//In memory storage
const users : user[] =[];


//1.The request will contain the token in the query parameter.

function authenticateUser(token: string): string | null {
  try {
    console.log("Authenticating token:", token);
    
    const decoded = jwt.verify(token,"YatharthSingh");
    console.log("Decoded token:", decoded);

    return decoded as string; 
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}

wss.on('connection', function connection(ws, request) {
  //1. Extract the token from the query parameter
  const url = request.url;
  if(!url){
    ws.close();
    return;
  }
  const queryParams = new URLSearchParams(request.url?.split('?')[1]);
  const token = queryParams?.get("token") || "";
  const userId = authenticateUser(token);
  console.log("The userId is", userId);
  if (userId == null) {
    ws.close()
    return null;
  }
  
  users.push(
    {
      ws: ws, 
      rooms: [], 
      userId: userId
    }
  )
  
  ws.on('message', async function message(data){
    let parsedData;
    if(typeof data != "string"){
        parsedData = JSON.parse(data.toString());
    }
    else{
        parsedData = JSON.parse(data)
    }
  
  
    // "type" : 'join_room',
    // "room_id": "7"
    
    const type = parsedData.type;
    switch (type) {
      case "join_room":
        const FindUser = users.find(x => x.ws == ws)
        const roomId = parsedData.roomId;
        FindUser?.rooms.push(roomId);
        break;
  
      case "leave_room":
        const leaveusr = users.find(x=> x.ws == ws);
        if(!leaveusr){
          return;
        }
        const leaveroomId = parsedData.roomId;
        leaveusr?.rooms.filter(x => x != leaveroomId); 
        break;

      case "chat":
        const msg = parsedData.msg;
        const msgRoomId = parsedData.roomId;
        //Keep the messages in redis queue . After some time , send all the messages to the db.
        try{
          await prismaClient.chat.create({
            data:{
              message: msg,
              userId: userId,
              roomId: Number(msgRoomId)
            }
          })
          ws.send(JSON.stringify({
            msg: "The data has been added successfully."
          }))
        }
        catch(e){
          ws.send(JSON.stringify({
            msg:e
          }))
        }
        
        //Find all the users that the message needs to be sent to.
        //in other words find all the users in the given room.
        const relevantUsers = users.forEach(usr =>{
            if(usr.rooms.includes(msgRoomId)){
              usr.ws.send(JSON.stringify({
                type: "chat",
                msg: msg,
                roomId: msgRoomId
              }))
            } 
        })
    }
  
  })
      
})

