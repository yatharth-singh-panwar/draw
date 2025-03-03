import axios, { AxiosError } from 'axios';
import { BACKEND_URL } from "../../../../config"
import { RefObject, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
//interface for all the types of shapes.
interface shapeDimentions {
    type: "rect" | "circle" | "pencil",
    startX?: number,
    startY?: number,
    finalWidth?: number, //For rectangular shape
    finalHeight?: number, //For rectangular shape 
    radius?: number  //For circle shape
    arr?: pencilStroke[] //for strokes of the pencil
}

interface pencilStroke {
    startX: number,
    startY: number,
    endX: number,
    endY: number
}


//get all the existing shapes and then render it.
async function getExistingShapes(roomId: string, jwt: string, router: AppRouterInstance) {
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

    const shapes = data.map((x: { message: string }) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    })
    return shapes;
}


//Function to clear the canvas and render all the existing shapes.
function rerenderCanvas(canvas: HTMLCanvasElement, drawings: [shapeDimentions]) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = '#000000';
    // ctx.fill();

    //render all the existing shapes in the canvas.
    drawings.forEach(shape => {
        if (shape.type == "rect") {
            ctx.strokeRect(shape.startX, shape.startY, shape.finalWidth, shape.finalHeight);
        }
        else if (shape.type == "circle") {
            ctx.beginPath();
            ctx.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if (shape.type == 'pencil') {
            shape.arr?.forEach((stroke) => {
                ctx.beginPath();
                ctx.moveTo(stroke.startX, stroke.startY);
                ctx.lineTo(stroke.endX, stroke.endY);
                ctx.stroke();
            });
        }
    })

}

function pushDrawingTodb(drawing: shapeDimentions, ws: WebSocket, roomId: string) {
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


export async function canvasLogic(canvas: HTMLCanvasElement, roomId: string, ws: WebSocket, type: string, mouseDownHandlerRef: RefObject<any>, mouseUpHandlerRef: RefObject<any>, mouseMoveHandlerRef: RefObject<any>,
    zoomInEventHandlerRef: RefObject<any>, jwt: string, router: AppRouterInstance) {

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.strokeStyle = "red"

    ws.onmessage = function (event) {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "chat") {
            const newShape: shapeDimentions = JSON.parse(messageData.msg);
            drawings.push(newShape);
            rerenderCanvas(canvas, drawings);
        }
    };
    const drawings = await getExistingShapes(roomId, jwt, router);
    rerenderCanvas(canvas, drawings);

    let clicked = false;
    let startX: number, startY: number, endX: number, endY: number, scaleFactor: number, mouseXCoordinate: number, mouseYCoordinate: number;
    let setted = false;

    if (mouseDownHandlerRef.current) {
        canvas.removeEventListener("mousedown", mouseDownHandlerRef.current);
    }
    if (mouseMoveHandlerRef.current) {
        canvas.removeEventListener("mousemove", mouseMoveHandlerRef.current);
    }
    if (mouseUpHandlerRef.current) {
        canvas.removeEventListener("mouseup", mouseUpHandlerRef.current);
    }

    if (zoomInEventHandlerRef.current) {
        canvas.removeEventListener("wheel", zoomInEventHandlerRef.current);
    }
    const stroke: pencilStroke[] = [];

    //In order to make a resizable rectangle that the user gives.
    //1) Catch the x and y coordinates of the user's starting mouse click.
    canvas.addEventListener('click', (e) => {
        console.log("X coordinate is ", e.clientX);
        console.log("Y coordinate is ", e.clientY);
    })
    mouseDownHandlerRef.current = (e) => {
        clicked = true;
        if (setted) {
            const clientY = e.clientY;
            const clientX = e.clientX;
            const xDistance = Number((mouseXCoordinate - clientX) / scaleFactor) // This is the distance between mouseX on canvas original and the point
            startX = mouseXCoordinate - xDistance;
            const yDistance = Number((mouseYCoordinate - clientY) / scaleFactor) // This is the distance between mouseY on canvas original and the point
            startY = mouseYCoordinate - yDistance;
            console.log("xDistance ", xDistance);
            console.log("yDistance", yDistance);
            console.log("Correct X location (start)", startX);
            console.log("Correct Y location (start)", startY);
        }
        else {
            startX = e.clientX;
            startY = e.clientY;
        }
    };
    //2) Preview the rectangle as the user moves the mouse .
    mouseMoveHandlerRef.current = (e) => {
        if (clicked) {
            if (type == 'rect') {
                if (!setted) {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    rerenderCanvas(canvas, drawings);
                    ctx.strokeRect(startX, startY, width, height);
                }
                else {
                    const xDistance = Number((mouseXCoordinate - e.clientX) / scaleFactor) // This is the distance between mouseX on canvas original and the point
                    const curX = mouseXCoordinate - xDistance;
                    const yDistance = Number((mouseYCoordinate - e.clientY) / scaleFactor) // This is the distance between mouseY on canvas original and the point
                    const curY = mouseYCoordinate - yDistance;
                    const width = curX - startX;
                    const height = curY - startY;
                    rerenderCanvas(canvas, drawings);
                    ctx.strokeRect(startX, startY, width, height);
                }
            }
            else if (type == 'circle') {
                const radius = e.clientX - startX;
                if (radius < 0) {
                    return;
                }
                rerenderCanvas(canvas, drawings);
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            else if (type == 'pencil') {
                if (!clicked) return;
                ctx.lineWidth = 2;
                const currentX = e.clientX;
                const currentY = e.clientY;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
                const pencilObj: pencilStroke = { startX: startX, startY: startY, endX: currentX, endY: currentY };
                stroke.push(pencilObj);
                (stroke);
                startX = e.clientX;
                startY = e.clientY;
            }
        }
    }

    //3) Get the ending x and y coordinates of the user ending mouse click.
    mouseUpHandlerRef.current = (e) => {
        clicked = false;
        let newDrawing: shapeDimentions;

        if (type == 'rect') {
            if (!setted) {
                const finalWidth = endX - startX;
                const finalHeight = endY - startY
                newDrawing = { type: "rect", startX: startX, startY: startY, finalWidth: finalWidth, finalHeight: finalHeight }
            }
            else {
                const xDistance = Number((mouseXCoordinate - e.clientX) / scaleFactor) // This is the distance between mouseX on canvas original and the point
                const endX = mouseXCoordinate - xDistance;
                const yDistance = Number((mouseYCoordinate - e.clientY) / scaleFactor) // This is the distance between mouseY on canvas original and the point
                const endY = mouseYCoordinate - yDistance;
                const finalWidth =  endX - startX;
                const finalHeight = endY - startY;
                newDrawing = { type: "rect", startX: startX, startY: startY, finalWidth: finalWidth, finalHeight: finalHeight }
            }
            drawings.push(newDrawing);
        }
        else if (type == 'circle') {
            const radius = endX - startX;
            if (radius < 0) {
                return;
            }
            newDrawing = { type: "circle", startX, startY, radius };
        }

        else if (type == "pencil") {
            newDrawing = { type: "pencil", arr: stroke }
        }

        drawings.push(newDrawing);
        pushDrawingTodb(newDrawing, ws, roomId);
    }
    zoomInEventHandlerRef.current = (e: WheelEvent) => {
        if (!setted) {
            if (e.ctrlKey) {
                const deltaX = e.deltaX / 2;
                const deltaY = e.deltaY / 2;
                // ctx.translate(canvas.width/2, canvas.height/2);
                if (deltaX < 0 || deltaY < 0) {
                    return;
                }
                mouseXCoordinate = e.clientX;
                mouseYCoordinate = e.clientY;
                ctx.translate(e.clientX, e.clientY);
                ctx.scale(5, 5);
                //If this line is not included, then all the rerender will happen wrt the current mouse
                //Location as the origin. This will leads to erros as our all drawings are stored
                // WRT the origin which is 0,0.
                ctx.translate(-e.clientX, -e.clientY);
                scaleFactor = 5;
                setted = true;
                rerenderCanvas(canvas, drawings);
            }
        }
    }


    canvas.addEventListener("mousedown", mouseDownHandlerRef.current);
    canvas.addEventListener("mousemove", mouseMoveHandlerRef.current);
    canvas.addEventListener("mouseup", mouseUpHandlerRef.current);
    canvas.addEventListener("wheel", zoomInEventHandlerRef.current);
}

