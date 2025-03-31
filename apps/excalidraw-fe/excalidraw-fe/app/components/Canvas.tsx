"use-client"
import { useEffect, useRef, useState } from "react"
import { canvasLogic } from "../canvas/[roomId]/draw";
import { useRouter } from "next/navigation";
import { MenubarBar } from "../canvas/[roomId]/draw/toolbar";
import { Game } from "../canvas/[roomId]/draw/Game";
import { toolTypes } from "../canvas/[roomId]/interfaces/interface";

export default function Canvas({ roomId, ws, jwt }: { roomId: string, ws: WebSocket, jwt: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [type, setType] = useState("rect");
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
    const panEventHandler = useRef<(e: WheelEvent) => void | null>(null);

    //initialize a new game objec to keep track of the local variables for the canvas.
    const [game, setGame] = useState<Game>();

    //keyboard event handler references.
    const keyboardEventHandlerRef = useRef<(e: KeyboardEvent) => void | null>(null);
    useEffect(() => {
        if (canvasRef.current) {
            if (!jwt) {
                router.push(`${'/signin'}`);
            }
            console.log(game);
            if (game) {
                game.currentType = type as toolTypes;
            }
        }
    }, [type, game])

    useEffect(() => {
        if (canvasRef.current) {
            if (!jwt) {
                router.push(`${'/signin'}`);
            }
            const game = new Game();
            setGame(game);
            canvasLogic(canvasRef.current, roomId, ws,panEventHandler, keyboardEventHandlerRef, mouseDownHandlerRef, mouseUpHandlerRef, mouseMoveHandlerRef, zoomInEventHandlerRef, jwt, router, mouseXRef, mouseYRef,
                totalScale, currentXPivot, currentYPivot, game, setType
            );
        }
    }, [canvasRef])
    return (
        <div>
            <div className="absolute w-screen flex items-center justify-center ">
                <MenubarBar type={type} setType={setType} game={game} jwt={jwt} roomId={roomId} router={router}/>
            </div>
            <div>
                <canvas className="bg-blue-950" ref={canvasRef} width={window.visualViewport.width} height={window.visualViewport.height}> </canvas>
            </div>
        </div>
    )
}