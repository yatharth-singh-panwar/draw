"use client"
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas"
import { WS_URL } from "@/config";

export function RoomCanvas({roomId, jwt} : {roomId: string, jwt : string}){
    const [socket, setSocket] = useState<WebSocket|null>(null);
    useEffect(()=>{
        const ws =  new WebSocket(`${WS_URL}?token=${jwt}`);
        ws.onopen = ()=>{
            setSocket(ws);
        }

        return () => {
            ws.close(); // Close WebSocket when component unmounts
        };
    }, [])

    if(!socket){
        return <div>
            Connecting to websocket server.
        </div>
    }

    return <div>
        <Canvas roomId = {roomId} ws = {socket} jwt={jwt}/>
    </div>
}