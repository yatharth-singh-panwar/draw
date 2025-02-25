import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from "../../../../config"
import { RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
//interface for all the types of shapes.
interface shapeDimentions{
    type: "rect" | "circle",
    startX: number,
    startY: number,
    finalWidth ?: number, //For rectangular shape
    finalHeight ?: number, //For rectangular shape 
    radius ?: number  //For circle shape
}


//get all the existing shapes and then render it.
async function getExistingShapes(roomId : string, jwt:string, router: AppRouterInstance){
    console.log(jwt);
    if (!jwt) {
        console.log("reached the state")
        router.push('/signin');
        return [];
    }
    let res;
    try{
        res = await axios.get(`${BACKEND_URL}`+`/chats/${roomId}`,{
            headers:{
                cookie:`jwt=${jwt}`
            },
            withCredentials:true
        });

    }
    catch(error){
        if(axios.isAxiosError(error) && error.response){
            if(error.response.status == 403){
                router.push('/signin');
                return [];
            }
        }
    }

    const data = res.data.chats;
    console.log("The existing shapes are ", data);

    const shapes = data.map((x : {message:string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    })
    return shapes;
}
//Function to clear the canvas and render all the existing shapes.

function rerenderCanvas(canvas:HTMLCanvasElement, drawings : [shapeDimentions]){
    const ctx = canvas.getContext("2d");
    if(!ctx){
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //render all the existing shapes in the canvas.
    drawings.forEach(shape=>{
        if(shape.type == "rect"){
            ctx.strokeRect(shape.startX, shape.startY, shape.finalWidth, shape.finalHeight);
        }
        else if(shape.type == "circle"){
            ctx.beginPath();
            ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    })
    
}

function pushDrawingTodb(drawing: shapeDimentions, ws: WebSocket, roomId: string){
    if(drawing == undefined || drawing.type==="circle" && drawing.radius == undefined  ||
        drawing.type==='rect' && (drawing.finalWidth ==undefined || drawing.finalHeight == undefined) 
    ){
        return;
    }
    if(drawing.type =="circle" && drawing.radius < 0){
        console.log("Cannot push to db as the circle is smaller than 0");
        return;
    }
    ws.send(JSON.stringify({
        type: "chat",
        msg: JSON.stringify(drawing),
        roomId: roomId
    }));
}


export async function canvasLogic(canvas: HTMLCanvasElement, roomId: string, ws : WebSocket, type:string, mouseDownHandlerRef: RefObject<any>, mouseUpHandlerRef: RefObject<any>, mouseMoveHandlerRef: RefObject<any>, jwt:string, router: AppRouterInstance){

    const ctx = canvas.getContext("2d"); 
    if(!ctx){
        return;
    }

    ctx.strokeStyle="white"

    const drawings = await getExistingShapes(roomId, jwt, router);
    rerenderCanvas(canvas, drawings);

    let clicked = false;
    let startX : number, startY : number, endX : number, endY : number;

    if (mouseDownHandlerRef.current) {
        canvas.removeEventListener("mousedown", mouseDownHandlerRef.current);
    }
    if (mouseMoveHandlerRef.current) {
        canvas.removeEventListener("mousemove", mouseMoveHandlerRef.current);
    }
    if (mouseUpHandlerRef.current) {
        canvas.removeEventListener("mouseup", mouseUpHandlerRef.current);
    }

    //In order to make a resizable rectangle that the user gives.
    //1) Catch the x and y coordinates of the user's starting mouse click.
    mouseDownHandlerRef.current = (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    };
    //2) Preview the rectangle as the user moves the mouse .
    mouseMoveHandlerRef.current = (e) => {
        if(clicked){
            console.log(type);
            if(type == 'rect'){
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                rerenderCanvas(canvas, drawings);
                ctx.strokeRect(startX, startY, width, height);
            }
            else if( type == 'circle' ){
                const radius = e.clientX - startX;
                if(radius < 0){
                    return;
                }
                rerenderCanvas(canvas, drawings);
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }

    //3) Get the ending x and y coordinates of the user ending mouse click.
    mouseUpHandlerRef.current = (e) => {
        clicked= false;
        endX =  e.clientX;
        endY = e.clientY;
        let newDrawing: shapeDimentions;

        if(type == 'rect'){
            const width = endX - startX;
            const height = endY - startY;
            const finalWidth = endX - startX;
            const finalHeight = endY - startY
            newDrawing = {type: "rect", startX: startX, startY: startY, finalWidth: finalWidth, finalHeight: finalHeight}
            drawings.push(newDrawing);
        }
        else if( type == 'circle' ){
            const radius = endX - startX;
            if(radius <0){
                return;
            }
            newDrawing = {type:"circle", startX, startY, radius};
        }

        drawings.push(newDrawing);
        pushDrawingTodb(newDrawing, ws, roomId);
    }
    canvas.addEventListener("mousedown", mouseDownHandlerRef.current);
    canvas.addEventListener("mousemove", mouseMoveHandlerRef.current);
    canvas.addEventListener("mouseup", mouseUpHandlerRef.current);
}

