"use client"
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Square, Circle, Pencil, Eraser, GrabIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Game } from "./Game";
import { getExistingShapes } from "../apiCalls/api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function MenubarBar({ type, setType, game, roomId, router, jwt }: { type: string, setType: Dispatch<SetStateAction<string>>, game: Game, roomId: string, router: AppRouterInstance, jwt: string }) {
    return (
        //Set the width accordinly afterwards
        <Menubar className="bg-gray-950 h-14 p-2 w-fit flex items-center justify-center gap-0 px-2">
            <MenubarMenu>
                <MenubarTrigger className={`${type === "pan" ? "bg-primary-dark" : "hover:bg-gray-800"} w-10 rounded-md relative`} onClick={() => { setType("pan") }}>
                    <GrabIcon size={30} />
                    <p className="absolute -bottom-1 right-1 scale-[0.8] ">{1}</p>
                </MenubarTrigger>
            </MenubarMenu>
            <div className="h-full w-[1px] bg-gray-300">
            </div>
            <MenubarMenu>
                <MenubarTrigger className={`${type === "rect" ? "bg-primary-dark" : "hover:bg-gray-800"} w-10 rounded-md relative`} onClick={() => { setType("rect") }}>
                    <Square size={30} />
                    <p className="absolute -bottom-1 right-1 scale-[0.8] ">{2}</p>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className={`${type === "circle" ? "bg-primary-dark" : "hover:bg-gray-800"} w-10 rounded-md relative`} onClick={() => { setType("circle") }}>
                    <Circle size={30} />
                    <p className="absolute -bottom-1 right-1 scale-[0.8] ">{3}</p>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className={`${type === "pencil" ? "bg-primary-dark" : "hover:bg-gray-800"} w-10 rounded-md relative`} onClick={() => { setType("pencil") }}>
                    <Pencil size={30} />
                    <p className="absolute -bottom-1 right-1 scale-[0.8] ">{4}</p>
                </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger className={`${type === "eraser" ? "bg-primary-dark" : "hover:bg-gray-800"} w-10 rounded-md relative`} onClick={async () => {
                    const res = await getExistingShapes(roomId, jwt, router);
                    game.shapesWithId = res[1];
                    setType("eraser")
                }}>
                    <Eraser size={30} />
                    <p className="absolute -bottom-1 right-1 scale-[0.8] ">{5}</p>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    )
}
