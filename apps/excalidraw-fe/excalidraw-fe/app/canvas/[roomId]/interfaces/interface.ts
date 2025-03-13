export interface shapeDimentions {
    type: "rect" | "circle" | "pencil" | "eraser",
    startX?: number,
    startY?: number,
    finalWidth?: number, //For rectangular shape
    finalHeight?: number, //For rectangular shape 
    radius?: number  //For circle shape
    arr?: pencilStroke[] //for strokes of the pencil
}

export interface pencilStroke {
    startX: number,
    startY: number,
    endX: number,
    endY: number
}
export interface shapePaths {
    path: Path2D,
    dimentions: shapeDimentions
}
export interface shapesWithId {
    id: Number,
    dimentions: shapeDimentions
}