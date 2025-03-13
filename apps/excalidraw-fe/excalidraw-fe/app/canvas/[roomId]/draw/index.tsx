import { Dispatch, Ref, RefObject, useState, SetStateAction } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { shapesWithId, shapePaths, shapeDimentions, pencilStroke } from '../interfaces/interface';
import { getExistingShapes, deleteChats, pushDrawingTodb } from '../apiCalls/api';

let shapePaths: shapePaths[] = [];
let shapesWithId: shapesWithId[] = [];
let idOfshapesToDelete: Number[] = [];
const stroke: pencilStroke[] = [];

//Function to clear the canvas and render all the existing shapes.
function rerenderCanvas(canvas: HTMLCanvasElement, drawings: shapeDimentions[]) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //reset the shape paths
    shapePaths.length = 0;

    //render all the existing shapes in the canvas.
    drawings.forEach(shape => {
        const path = new Path2D();
        if (shape.type == "rect") {
            path.rect(shape.startX, shape.startY, shape.finalWidth, shape.finalHeight);
        }
        else if (shape.type == "circle") {
            path.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
        }
        else if (shape.type == 'pencil') {
            shape.arr?.forEach((stroke) => {
                path.moveTo(stroke.startX, stroke.startY);
                path.lineTo(stroke.endX, stroke.endY);
            });
        }
        ctx.stroke(path);
        shapePaths.push({ path: path, dimentions: shape });
    })

}

export async function canvasLogic(canvas: HTMLCanvasElement, roomId: string, ws: WebSocket, type: string, setType: Dispatch<SetStateAction<string>>, keyboardEventHandlerRef: RefObject<any>, mouseDownHandlerRef: RefObject<any>, mouseUpHandlerRef: RefObject<any>, mouseMoveHandlerRef: RefObject<any>,
    zoomInEventHandlerRef: RefObject<any>, jwt: string, router: AppRouterInstance,
    mouseXRef: RefObject<number>, mouseYRef: RefObject<number>, totalScale: RefObject<number>, totalYTranslate: RefObject<number>, totalXTranslate: RefObject<number>) {

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.strokeStyle = "red"
    ctx.lineWidth = 4
    let drawings: shapeDimentions[] = [];
    ws.onmessage = function (event) {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "chat") {
            const newShape: shapeDimentions = JSON.parse(messageData.msg);
            if (drawings.length == 0) {
                return;
            }
            drawings.push(newShape);
            rerenderCanvas(canvas, drawings);
        }
    };
    const response = await getExistingShapes(roomId, jwt, router);
    drawings = response[0];
    shapesWithId = response[1];

    rerenderCanvas(canvas, drawings);

    let clicked = false;
    let startX: number, startY: number, endX: number, endY: number;

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

    if (keyboardEventHandlerRef.current) {
        window.removeEventListener("keydown", keyboardEventHandlerRef.current);
    }

    mouseDownHandlerRef.current = (e) => {
        clicked = true;
        if (type == "eraser") {
            console.log("The type is eraser")
        }
        if (totalScale.current > 1) {

            //1. Find the current x and y coordinates on canvas system.
            const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
            const curY = (e.clientY - totalYTranslate.current) / totalScale.current;

            //2. Set the StartX and StartY
            startX = curX;
            startY = curY;
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
                if (totalScale.current > 1) {
                    const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                    const curY = (e.clientY - totalYTranslate.current) / totalScale.current;
                    const width = curX - startX;
                    const height = curY - startY;

                    rerenderCanvas(canvas, drawings);
                    ctx.strokeRect(startX, startY, width, height);
                }
                else {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    rerenderCanvas(canvas, drawings);
                    ctx.strokeRect(startX, startY, width, height);
                }
            }
            else if (type == 'circle') {
                let radius;
                if (totalScale.current > 1) {
                    const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                    radius = curX - startX;
                    if (radius < 0) {
                        return;
                    }
                    rerenderCanvas(canvas, drawings);
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                else {
                    radius = e.clientX - startX;
                    if (radius < 0) {
                        return;
                    }
                    rerenderCanvas(canvas, drawings);
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
            else if (type == 'pencil') {
                if (!clicked) return;
                ctx.lineWidth = 3;
                const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                const curY = (e.clientY - totalYTranslate.current) / totalScale.current;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(curX, curY);
                ctx.stroke();
                const pencilObj: pencilStroke = { startX: startX, startY: startY, endX: curX, endY: curY };
                stroke.push(pencilObj);
                startX = curX;
                startY = curY;
            }
            else if (type == 'eraser') {
                if (!clicked) return;
                shapePaths.forEach(drawing => {
                    // console.log(drawing.dimentions);
                    if (ctx.isPointInStroke(drawing.path, e.clientX, e.clientY)) {
                        drawings = drawings.filter((drawingItem) => drawingItem !== drawing.dimentions);
                        const drawingDimentionString = JSON.stringify(drawing.dimentions);
                        const drawingId = Number((shapesWithId.find((item) => {
                            const idDimentionString = JSON.stringify(item.dimentions);
                            return idDimentionString === drawingDimentionString;
                        })).id);
                        idOfshapesToDelete.push(drawingId);
                        rerenderCanvas(canvas, drawings);
                        //Also keep a track of the drawings delted so that after the event is mouseup,
                        // it can be deleted from the database as well
                    }
                })
            }
        }
    }

    //3) Get the ending x and y coordinates of the user ending mouse click.
    mouseUpHandlerRef.current = (e) => {
        clicked = false;
        let newDrawing: shapeDimentions;
        let endX = (e.clientX - totalXTranslate.current) / totalScale.current;
        let endY = (e.clientY - totalYTranslate.current) / totalScale.current;

        if (type == 'rect') {
            if (totalScale.current > 1) {
                const finalWidth = endX - startX;
                const finalHeight = endY - startY;
                newDrawing = { type: "rect", startX: startX, startY: startY, finalWidth: finalWidth, finalHeight: finalHeight }
            }
            else {
                endX = e.clientX;
                endY = e.clientY;

                const finalWidth = endX - startX;
                const finalHeight = endY - startY
                newDrawing = { type: "rect", startX: startX, startY: startY, finalWidth: finalWidth, finalHeight: finalHeight }
            }
            drawings.push(newDrawing);
        }
        else if (type == 'circle') {
            const radius = endX - startX;
            if (radius < 0) {
                return;
            }
            newDrawing = { type: "circle", startX: startX, startY: startY, radius: radius };
        }

        else if (type == "pencil") {
            newDrawing = { type: "pencil", arr: stroke }
        }
        else if (type == 'eraser') {
            deleteChats(roomId, idOfshapesToDelete, jwt);
            idOfshapesToDelete = [];
            return;
        }

        drawings.push(newDrawing);
        pushDrawingTodb(newDrawing, ws, roomId);
    }


    // Declare a flag in a proper scope (e.g. module-level or component-level)
    let zooming = false;

    zoomInEventHandlerRef.current = (e: WheelEvent) => {
        if (e.ctrlKey) {
            const zoomFactor = 1.01;
            if (!zooming) {
                // First zoom event of this sessio  n:
                // Convert the mouse (screen) coordinates to canvas coordinates.
                // Formula: canvasX = (screenX - totalTranslateX) / totalScale
                const pivotX = (e.clientX - totalXTranslate.current) / totalScale.current;
                const pivotY = (e.clientY - totalYTranslate.current) / totalScale.current;
                // Lock the pivot in canvas coordinates.
                mouseXRef.current = pivotX;
                mouseYRef.current = pivotY;
                zooming = true;
            } else {
                // Subsequent zoom events in the same session:
                // Save the old scale.
                const oldScale = totalScale.current;
                // Update the overall scale factor.
                totalScale.current *= zoomFactor;
                // To keep the locked pivot fixed on the screen,
                // first compute the screen coordinate of the locked pivot using the old transform:
                const screenPivotX = mouseXRef.current * oldScale + totalXTranslate.current;
                const screenPivotY = mouseYRef.current * oldScale + totalYTranslate.current;
                // Now update the translation so that after scaling, the pivot stays at the same screen coordinate.
                totalXTranslate.current = screenPivotX - mouseXRef.current * totalScale.current;
                totalYTranslate.current = screenPivotY - mouseYRef.current * totalScale.current;

                // Reset the transformation and apply the new one.
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.translate(totalXTranslate.current, totalYTranslate.current);
                ctx.scale(totalScale.current, totalScale.current);

                rerenderCanvas(canvas, drawings);
            }
        }
    };

    // When Ctrl is released, reset zooming so that a new pivot can be captured next time.
    window.addEventListener("keyup", (e) => {
        if (e.key === "Control") {
            zooming = false;
            console.log("Ctrl released, resetting pivot capture.");
        }
    });

    keyboardEventHandlerRef.current = (e: KeyboardEvent) => {
        if (e.key === "1") {
            console.log("Reached at 1");
            setType("rect");
        }
        if (e.key === "2") {
            setType("circle");
        }
        if (e.key === "3") {
            setType("pencil");
        }
        if (e.key === "4") {
            setType("eraser");
        }
    }

    canvas.addEventListener("mousedown", mouseDownHandlerRef.current);
    canvas.addEventListener("mousemove", mouseMoveHandlerRef.current);
    canvas.addEventListener("mouseup", mouseUpHandlerRef.current);
    canvas.addEventListener("wheel", zoomInEventHandlerRef.current);
    window.addEventListener("keydown", keyboardEventHandlerRef.current);
}