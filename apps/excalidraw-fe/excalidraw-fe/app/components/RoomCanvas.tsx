"use client"
import { useEffect, useState } from "react";
import Canvas from "../components/Canvas"
import { WS_URL } from "@/config";

export function RoomCanvas({roomId} : {roomId: string}){
    const [socket, setSocket] = useState<WebSocket|null>(null);

    useEffect(()=>{
        const ws =  new WebSocket(WS_URL);
        ws.onopen = ()=>{
            setSocket(ws);
        }
        // ws.onclose = () => {
        //     console.log("WebSocket closed. Attempting to reconnect...");
        //     setTimeout(() => {
        //         setSocket(new WebSocket(WS_URL));
        //     }, 3000); // Try reconnecting after 3 seconds
        // };

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
        <Canvas roomId = {roomId} ws = {socket}/>
    </div>
}