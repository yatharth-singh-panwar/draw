import axios from "axios"
import { BACKEND_URL } from "@/config";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { shapeDimentions } from "../interfaces/interface";
//get all the existing shapes and then render it.
export async function getExistingShapes(roomId: string, jwt: string, router: AppRouterInstance) {
    if (!jwt) {
        router.push('/signin');
        return [];
    }
    let res;
    try {
        res = await axios.get(`${BACKEND_URL}` + `/chats/${roomId}`, {
            headers: {
                cookie: `jwt=${jwt}`
            },
            withCredentials: true
        });

    }
    catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status == 403) {
                router.push('/signin');
                return [];
            }
        }
    }

    const data = res.data.chats;

    const shapesWithId = data.map((x: { id: Number, message: string }) => {
        const messageData = JSON.parse(x.message);
        const id = Number(x.id);
        const finalObj = { id: id, dimentions: messageData }
        return finalObj;
    })

    const shapes = data.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    })
    return [shapes, shapesWithId];
}

export async function deleteChats(roomId: string, chats: Number[], jwt: string) {
    console.log("Id of the chats to be deleted is",chats);
    const stringifiedChat = JSON.stringify(chats);
    try {
        await axios.delete(`${BACKEND_URL}` + `/space/${roomId}/chat`, {
            data: {
                chats: stringifiedChat
            },
            headers: {
                cookie: `jwt=${jwt}`
            },
            withCredentials: true
        })
    }
    catch(e){
        console.log(e);
    }
}


export function pushDrawingTodb(drawing: shapeDimentions, ws: WebSocket, roomId: string) {
    if (drawing == undefined || drawing.type === "circle" && drawing.radius == undefined ||
        drawing.type === 'rect' && (drawing.finalWidth == undefined || drawing.finalHeight == undefined)
    ) {
        return;
    }
    if (drawing.type == "circle" && drawing.radius < 0) {
        ("Cannot push to db as the circle is smaller than 0");
        return;
    }
    ws.send(JSON.stringify({
        type: "chat",
        msg: JSON.stringify(drawing),
        roomId: roomId
    }));
}