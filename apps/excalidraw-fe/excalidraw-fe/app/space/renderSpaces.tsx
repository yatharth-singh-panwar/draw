"use client"
import { useEffect, useState } from "react"
import Space from "../components/space"
export interface spaceObj{
    id: number,
    slug: string,
    createdAt: string,
    adminId: string
}

export default function RenderSpaces({spaces} :{spaces: spaceObj[]}){
    const [spacesArray, setSpacesArray] = useState(spaces);
    return <>
        <div className="flex flex-row items-center justify-center p-10 gap-0">  
            {spacesArray.map(space => (
                <div className="w-80 h-full flex items-center justify-center" key={space.id}>
                    <div>
                        <Space id={space.id} name={space.slug} spacesSetter = {setSpacesArray} spacesArray={spacesArray}></Space>
                    </div>
                </div>
            ))}
        </div>
        </>
    
}