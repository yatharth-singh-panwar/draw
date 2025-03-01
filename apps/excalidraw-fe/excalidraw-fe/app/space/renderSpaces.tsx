"use client"
import { useEffect, useRef, useState } from "react"
import Space from "../components/space"
import Navbar from "../components/Navbar"
import axios from "axios";
import { toast } from "sonner";
import { BACKEND_URL } from "@/config";

export interface spaceObj {
    id: number,
    slug: string,
    createdAt: string,
    adminId: string
}

async function createNewSpace(spaceName : string, setnewSpaceToggle: Function, spacesArray,setSpacesArray){
    try{
        const res = await axios.post(`${BACKEND_URL}/roomjoin`,{
            "name": spaceName
        },{
            withCredentials:true
        })
        const newRoom  = res.data.newRoom;
        toast.message("Room creation successfull !");
        setnewSpaceToggle(false);
        setSpacesArray(prevArray => [...prevArray, newRoom])
    }
    catch(e){
        toast.error("New space creation failed. Try again.");
    }    
}
export default function RenderSpaces({ spaces }: { spaces: spaceObj[] }) {
    const [spacesArray, setSpacesArray] = useState(spaces);
    const [newSpaceToggle, setnewSpaceToggle] = useState(false);
    const name = useRef<HTMLInputElement>(null);
    return <>
        <Navbar toggleNewSpaceDialogBox={setnewSpaceToggle}></Navbar>
        {newSpaceToggle &&
            <div className="fixed z-20 inset-0 bg-black bg-opacity-90 flex items-center justify-center">
                <div className="p-11 flex flex-col items-center justify-center w-96 h-72 border border-gray-50 rounded-lg">
                    <div>
                        <p className="text-lg">Enter the name of the new space.</p>
                        <input ref={name} type="text" className="w-72 h-12 p-0 text-lg opacity-85 text-black rounded-sm px-2 py-1 mt-2 mb-7" />
                    </div>
                    <div className="flex justify-between m-2 h-10 w-full gap-2">
                        <button onClick={() => {setnewSpaceToggle(!newSpaceToggle)}} className="w-1/2 bg-red-600 hover:bg-red-800 px-6 py-2 rounded-lg transition-colors">Cancel</button>
                        <button onClick={() => {createNewSpace(name.current.value, setnewSpaceToggle, spacesArray, setSpacesArray)}} className="w-1/2 bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg transition-colors">Confirm</button>
                    </div>
                </div>

            </div>
        }
        <div className="pt-28 flex flex-row items-center justify-center p-10 gap-0">
            {spacesArray.map(space => (
                <div className="w-80 h-full flex items-center justify-center" key={space.id}>
                    <div>
                        <Space id={space.id} name={space.slug} spacesSetter={setSpacesArray} spacesArray={spacesArray}></Space>
                    </div>
                </div>
            ))}
        </div>
    </>

}