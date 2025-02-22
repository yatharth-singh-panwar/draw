"use-client"
import { useEffect, useRef, useState } from "react"
import { canvasLogic } from "../canvas/[roomId]/draw";
import {Square, Circle, Pencil} from "lucide-react";

export default function Canvas({roomId, ws} : {roomId: string, ws: WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [type, setType] = useState("");

    //mouse event handler references.
    const mouseDownHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseMoveHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseUpHandlerRef = useRef<(e: MouseEvent) => void | null>(null);

    useEffect(()=>{
        if(canvasRef.current){
            canvasLogic(canvasRef.current, roomId, ws, type, mouseDownHandlerRef, mouseUpHandlerRef, mouseMoveHandlerRef);
        }
    }, [type])
    return(
        <div>
            <div className="absolute w-screen flex items-center justify-center gap-7 p-2" >
                <div> 
                    <button className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("rect")}><Square/></button>                    
                </div>

                <div> 
                    <button  className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("circle")}><Circle/></button>                    
                </div>

                <div> 
                    <button  className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("pencil")}><Pencil/></button>                    
                </div>
            </div>
            <div>
                <canvas ref  = {canvasRef} width={2000} height={1000}> </canvas>
            </div>
        </div>
    )
}