import { shapePaths, shapesWithId, pencilStroke, toolTypes } from "../interfaces/interface";
export class Game{
    public shapePaths: shapePaths[] ;
    public shapesWithId: shapesWithId[];
    public idOfshapesToDelete: Number[];
    public stroke: pencilStroke[];
    public clicked = false;
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;
    public zooming = false;
    public currentType : toolTypes; 

    constructor(){
        this.currentType = "rect";
        this.idOfshapesToDelete = [];
        this.stroke = [];
        this.shapesWithId=[];
        this.shapePaths = [];
    }
}