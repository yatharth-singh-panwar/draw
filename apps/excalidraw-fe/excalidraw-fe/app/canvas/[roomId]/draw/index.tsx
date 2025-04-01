import { Dispatch, Ref, RefObject, useState, SetStateAction } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { shapesWithId, shapePaths, shapeDimentions, pencilStroke } from '../interfaces/interface';
import { getExistingShapes, deleteChats, pushDrawingTodb } from '../apiCalls/api';
import { Game } from './Game';

//Function to clear the canvas and render all the existing shapes.
function rerenderCanvas(canvas: HTMLCanvasElement, drawings: shapeDimentions[], game: Game) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }
    ctx.save(); // Save the current transformation state
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity transform
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the whole canvas
    ctx.restore(); // Restore the transformation (your pan/zoom state)
    //reset the shape paths

    game.shapePaths.length = 0;


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
        game.shapePaths.push({ path: path, dimentions: shape });
    })

}


export async function canvasLogic(canvas: HTMLCanvasElement, roomId: string, ws: WebSocket, panEventHandler: RefObject<any>, keyboardEventHandlerRef: RefObject<any>, mouseDownHandlerRef: RefObject<any>, mouseUpHandlerRef: RefObject<any>, mouseMoveHandlerRef: RefObject<any>,
    zoomInEventHandlerRef: RefObject<any>, jwt: string, router: AppRouterInstance,
    mouseXRef: RefObject<number>, mouseYRef: RefObject<number>, totalScale: RefObject<number>, totalYTranslate: RefObject<number>, totalXTranslate: RefObject<number>, game: Game, setType: Dispatch<SetStateAction<string>>) {

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    ctx.strokeStyle = "red"
    ctx.lineWidth = 3

    let drawings: shapeDimentions[] = [];
    ws.onmessage = function (event) {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "chat") {
            const newShape: shapeDimentions = JSON.parse(messageData.msg);
            if (drawings.length == 0) {
                return;
            }
            drawings.push(newShape);
            rerenderCanvas(canvas, drawings, game);
        }
    };

    //Get existing shapes and re - render the canvas with the new drawings.
    const response = await getExistingShapes(roomId, jwt, router);
    drawings = response[0];
    game.shapesWithId = response[1];

    rerenderCanvas(canvas, drawings, game);

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
        game.clicked = true;
        if (game.currentType == "eraser") {
        }

        if (game.currentType == 'pan') {
            game.startX = e.clientX;
            game.startY = e.clientY;

        }
        else {
            //1. Find the current x and y coordinates on canvas system.
            const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
            const curY = (e.clientY - totalYTranslate.current) / totalScale.current;

            //2. Set the StartX and StartY
            game.startX = curX;
            game.startY = curY;
        }

    };
    //2) Preview the rectangle as the user moves the mouse .
    mouseMoveHandlerRef.current = (e) => {
        if (game.clicked) {
            if (game.currentType == 'rect') {
                const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                const curY = (e.clientY - totalYTranslate.current) / totalScale.current;
                const width = curX - game.startX;
                const height = curY - game.startY;

                rerenderCanvas(canvas, drawings, game);
                ctx.strokeRect(game.startX, game.startY, width, height);
            }
            else if (game.currentType == 'circle') {
                let radius;

                const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                radius = curX - game.startX;
                if (radius < 0) {
                    return;
                }
                rerenderCanvas(canvas, drawings, game);
                ctx.beginPath();
                ctx.arc(game.startX, game.startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            else if (game.currentType == 'pencil') {
                if (!game.clicked) return;
                ctx.lineWidth = 3;
                const curX = (e.clientX - totalXTranslate.current) / totalScale.current;
                const curY = (e.clientY - totalYTranslate.current) / totalScale.current;
                ctx.beginPath();
                ctx.moveTo(game.startX, game.startY);
                ctx.lineTo(curX, curY);
                ctx.stroke();
                const pencilObj: pencilStroke = { startX: game.startX, startY: game.startY, endX: curX, endY: curY };
                game.stroke.push(pencilObj);
                game.startX = curX;
                game.startY = curY;
            }
            else if (game.currentType == 'eraser') {
                if (!game.clicked) return;
                const eraserSize = 55; // Adjust this value to increase/decrease the eraser size
                const curX = e.clientX;
                const curY = e.clientY;

                // Interpolate points between the previous and current cursor positions
                const steps = 10; // Number of interpolation steps
                const deltaX = (curX - game.startX) / steps;
                const deltaY = (curY - game.startY) / steps;

                for (let i = 0; i <= steps; i++) {
                    const interpolatedX = game.startX + deltaX * i;
                    const interpolatedY = game.startY + deltaY * i;

                    game.shapePaths.forEach(drawing => {
                        const eraserPath = new Path2D();
                        eraserPath.rect(interpolatedX - eraserSize / 2, interpolatedY - eraserSize / 2, eraserSize, eraserSize);

                        if (ctx.isPointInPath(eraserPath, drawing.dimentions.startX, drawing.dimentions.startY) ||
                            ctx.isPointInStroke(drawing.path, interpolatedX, interpolatedY)) {
                            drawings = drawings.filter((drawingItem) => drawingItem !== drawing.dimentions);
                            const drawingDimentionString = JSON.stringify(drawing.dimentions);
                            const drawingId = Number((game.shapesWithId.find((item) => {
                                const idDimentionString = JSON.stringify(item.dimentions);
                                return idDimentionString === drawingDimentionString;
                            })).id);
                            game.idOfshapesToDelete.push(drawingId);
                            rerenderCanvas(canvas, drawings, game);
                        }
                    });
                }
                game.startX = curX;
                game.startY = curY;
            }
            else if (game.currentType == "pan") {
                mouseXRef.current = e.clientX;
                mouseYRef.current = e.clientY;

                const deltaX = mouseXRef.current - game.startX;
                const deltaY = mouseYRef.current - game.startY;

                // Update the translation values
                totalXTranslate.current += deltaX;
                totalYTranslate.current += deltaY;

                // Reset the canvas transform and clear it
                ctx.setTransform(1, 0, 0, 1, 0, 0);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Apply the new transform
                ctx.setTransform(
                    totalScale.current,
                    0,
                    0,
                    totalScale.current,
                    totalXTranslate.current,
                    totalYTranslate.current
                );

                // Re-render the canvas
                rerenderCanvas(canvas, drawings, game);

                // Update the starting position for the next pan
                game.startX = mouseXRef.current;
                game.startY = mouseYRef.current;
            }
        }
    }

    //3) Get the ending x and y coordinates of the user ending mouse click.
    mouseUpHandlerRef.current = (e) => {
        game.clicked = false;
        let newDrawing: shapeDimentions;
        let endX = (e.clientX - totalXTranslate.current) / totalScale.current;
        let endY = (e.clientY - totalYTranslate.current) / totalScale.current;

        if (game.currentType == 'rect') {

            const finalWidth = endX - game.startX;
            const finalHeight = endY - game.startY;
            newDrawing = { type: "rect", startX: game.startX, startY: game.startY, finalWidth: finalWidth, finalHeight: finalHeight }


            drawings.push(newDrawing);
        }
        else if (game.currentType == 'circle') {
            const radius = endX - game.startX;
            if (radius < 0) {
                return;
            }
            newDrawing = { type: "circle", startX: game.startX, startY: game.startY, radius: radius };
        }

        else if (game.currentType == "pencil") {
            newDrawing = { type: "pencil", arr: game.stroke }
            game.stroke = [];
        }
        else if (game.currentType == 'eraser') {
            deleteChats(roomId, game.idOfshapesToDelete, jwt);
            game.idOfshapesToDelete = [];
            return;
        }
        else if (game.currentType == "pan") {
            game.startX = e.clientX;
            game.startY = e.clientY;
            return;
        }

        drawings.push(newDrawing);
        pushDrawingTodb(newDrawing, ws, roomId);
    }


    zoomInEventHandlerRef.current = (e: WheelEvent) => {
        if (!e.ctrlKey) {
            let zoomFactor;
            if (e.deltaY > 0) {
                zoomFactor = 1.05;
            }
            else{
                zoomFactor = 1 / 1.05;
            }

            if (!game.zooming) {
                // First zoom event of this session:
                // Convert the mouse (screen) coordinates to canvas coordinates.
                // Formula: canvasX = (screenX - totalTranslateX) / totalScale
                const pivotX = (e.clientX - totalXTranslate.current) / totalScale.current;
                const pivotY = (e.clientY - totalYTranslate.current) / totalScale.current;
                // Lock the pivot in canvas coordinates.
                mouseXRef.current = pivotX;
                mouseYRef.current = pivotY;
                game.zooming = true;
            } else {
                // Subsequent zoom events in the same session:
                // Save the old scale.
                const oldScale = totalScale.current;
                // Prevent zooming out below 1x:
                if (zoomFactor.current == 1) {
                    return
                }

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

                rerenderCanvas(canvas, drawings, game);
                game.zooming = false;

            }
        }
    };

    keyboardEventHandlerRef.current = async (e: KeyboardEvent) => {
        if (e.key === "1") {
            game.currentType == 'rect';
            setType("rect")
        }
        if (e.key === "2") {
            game.currentType == "circle";
            setType("circle")
        }
        if (e.key === "3") {
            game.currentType == "pencil";
            setType("pencil")
        }
        if (e.key === "4") {
            game.currentType == "eraser";
            const res = await getExistingShapes(roomId, jwt, router);
            game.shapesWithId = res[1];
            setType("eraser")
        }
        if (e.key == '5') {
            game.currentType = "pan";
            setType('pan');
        }
    }

    canvas.addEventListener("mousedown", mouseDownHandlerRef.current);
    canvas.addEventListener("mousemove", mouseMoveHandlerRef.current);
    canvas.addEventListener("mouseup", mouseUpHandlerRef.current);
    canvas.addEventListener("wheel", zoomInEventHandlerRef.current);
    window.addEventListener("keydown", keyboardEventHandlerRef.current);
    canvas.addEventListener("wheel", panEventHandler.current);
}