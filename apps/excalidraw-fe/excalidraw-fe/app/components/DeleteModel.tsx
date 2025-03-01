"use client"
import { BACKEND_URL } from "@/config";
import axios from "axios"
import { Dispatch, } from "react";
import { Toaster, toast } from "sonner";
import { spaceObj } from "../space/renderSpaces";
function DeleteSpace(roomId: Number, spacesSetter: Dispatch<spaceObj[]>, spacesArray : spaceObj[]){
    try{
        axios.delete(`${BACKEND_URL}/space/${roomId}`,{
            withCredentials:true
        })
        console.log("The spaces array reached here is", spacesArray);
        console.log(spacesArray.filter((space) => space.id !== roomId) as spaceObj[]);
        spacesSetter(spacesArray.filter((space) => space.id !== roomId) as spaceObj[]);
    }   
    catch(e){
        toast.error("Failed to delete the space. Please try again.");
        return e;
    }
}

export default function DeleteModel({setDeleteMsg, roomId, spacesSetter, spacesArray}:{setDeleteMsg: Function, roomId: Number,spacesSetter: Dispatch<spaceObj[]>, spacesArray:spaceObj[]}){
    return(
        <div className="h-full w-48 opacity-90 flex justify-center items-center">
            <div className="flex flex-col gap-10 border border-1 rounded-xl w-72 h-48 p-3">
                <div className="text-center text-white">
                    <p className="text-lg">Are you sure you want to delete the space ?</p>
                </div>
                <div className="flex flex-row w-full justify-center gap-8">
                    <div><button onClick={()=>{
                        DeleteSpace(roomId, spacesSetter, spacesArray);
                    }} className="w-24 h-12 bg-primary hover:bg-primary-dark rounded-lg">Yes</button></div>
                    <div><button onClick={()=>{setDeleteMsg(false)}}  className="w-24 h-12 bg-red-600 hover:bg-red-800 rounded-lg">Cancel</button></div>
                </div>
            </div>
        </div>
    )
}