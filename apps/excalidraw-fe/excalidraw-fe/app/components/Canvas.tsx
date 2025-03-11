"use-client"
import { useEffect, useRef, useState } from "react"
import { canvasLogic } from "../canvas/[roomId]/draw";
import { useRouter } from "next/navigation";
import { MenubarBar } from "../canvas/[roomId]/draw/toolbar";

export default function Canvas({ roomId, ws, jwt }: { roomId: string, ws: WebSocket, jwt: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [type, setType] = useState("");
    const mouseXRef = useRef<number>(0);
    const mouseYRef = useRef<number>(0);
    const currentXPivot = useRef<number>(0);
    const currentYPivot = useRef<number>(0);
    const totalScale = useRef<number>(1);


    const router = useRouter();
    //mouse event handler references.
    const mouseDownHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseMoveHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const mouseUpHandlerRef = useRef<(e: MouseEvent) => void | null>(null);
    const zoomInEventHandlerRef = useRef<(e: WheelEvent) => void | null>(null);


    //keyboard event handler references.
    const keyboardEventHandlerRef = useRef<(e: KeyboardEvent) => void | null>(null);
    
    useEffect(() => {
        if (canvasRef.current) {
            if (!jwt) {
                router.push(`${'/signin'}`);
            }
            canvasLogic(canvasRef.current, roomId, ws, type,setType, keyboardEventHandlerRef, mouseDownHandlerRef, mouseUpHandlerRef, mouseMoveHandlerRef, zoomInEventHandlerRef, jwt, router, mouseXRef, mouseYRef,
                totalScale, currentXPivot, currentYPivot
            );
        }
    }, [type])
    return (
        <div>
            <div className="absolute w-screen flex items-center justify-center ">
                <MenubarBar type={type} setType={setType}/>
            </div>
            <div>
                <canvas className="bg-blue-950" ref={canvasRef} width={window.visualViewport.width} height={window.visualViewport.height}> </canvas>
            </div>
        </div>
    )
}