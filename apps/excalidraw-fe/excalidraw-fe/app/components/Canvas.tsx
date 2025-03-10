"use-client"
import { useEffect, useRef, useState } from "react"
import { canvasLogic } from "../canvas/[roomId]/draw";
import { Square, Circle, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Canvas({ roomId, ws, jwt }: { roomId: string, ws: WebSocket, jwt: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [type, setType] = useState("");
    const scaleFactor = useRef<number>(1);
    const mouseXRef = useRef<number>(0);
    const mouseYRef = useRef<number>(0);
    const currentXPivot = useRef<number>(0);
    const currentYPivot = useRef<number>(0);
    const totalScale = useRef<number>(1);
    const totalXTranslate = useRef<number>(0);
    const totalYTranslate = useRef<number>(0);


    const router = useRouter();
    //mouse event handler references.
    const mouseDownHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseMoveHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseUpHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const zoomInEventHandlerRef = useRef<(e: WheelEvent) => void | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            if (!jwt) {
                router.push(`${'/signin'}`);
            }
            canvasLogic(canvasRef.current, roomId, ws, type, mouseDownHandlerRef, mouseUpHandlerRef, mouseMoveHandlerRef, zoomInEventHandlerRef, jwt, router, scaleFactor, mouseXRef, mouseYRef,
                totalScale, totalXTranslate, totalYTranslate, currentXPivot, currentYPivot 
            );
        }
    }, [type])
    return (
        <div>
            <div className="absolute w-screen flex items-center justify-center gap-7 p-2" >
                <div>
                    <button className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("rect")}><Square /></button>
                </div>

                <div>
                    <button className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("circle")}><Circle /></button>
                </div>

                <div>
                    <button className="h-10 w-10 bg-blue-800 flex items-center justify-center rounded-lg hover:bg-blue-900" onClick={() => setType("pencil")}><Pencil /></button>
                </div>
            </div>
            <div>
                <canvas className="bg-yellow-200" ref={canvasRef} width={window.visualViewport.width} height={window.visualViewport.height}> </canvas>
            </div>
        </div>
    )
}