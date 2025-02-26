"use client"
import { useRouter } from "next/navigation";

function deleteRoom(name: string, id: number){

}

export default function Space({name, id}: {name: string, id:number}){
    const router = useRouter();
    return(
        <div className="w-72 h-72 rounded-lg border border-1 p-6">
            <div>

            </div>

            <div className="">
                <div className="flex justify-between flex-col">
                    
                    <div className="flex items-center justify-center rounded-sm w-full h-48 border">
                        {name}
                    </div>

                    {/* Feature -> Add a avatar of all the users in this room */}

                    <div className="flex justify-between m-2 h-full">
                        <button onClick={()=>{router.push(`canvas/${id}`)}} className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg transition-colors">Join</button>
                        <button onClick={()=>{ deleteRoom(name,id)}} className="bg-red-600 hover:bg-red-800 px-6 py-2 rounded-lg transition-colors">Delete space</button>
                    
                    </div>
                </div>
            </div>
        </div>
    )
}