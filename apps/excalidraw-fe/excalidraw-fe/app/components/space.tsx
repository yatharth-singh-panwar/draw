"use client"
import { useRouter } from "next/navigation";
import { useState, SetStateAction, Dispatch } from "react";
import DeleteModel from "./DeleteModel";
import { spaceObj } from "../space/renderSpaces";

export default function Space({ name, id, spacesSetter, spacesArray }: { name: string, id: number, spacesSetter: Dispatch<spaceObj[]>, spacesArray: spaceObj[] }) {
    const router = useRouter();
    const [deleteMsg, setDeleteMsg] = useState<Boolean>(false);
    return (
        <div className="w-72 h-72 rounded-lg border border-1 flex items-center justify-center">
            {deleteMsg &&
                <div>
                    <DeleteModel spacesSetter={spacesSetter} spacesArray={spacesArray} setDeleteMsg={setDeleteMsg} roomId={id} />
                </div>}
            {!deleteMsg &&
                <div className="">
                    <div className="flex justify-between flex-col">

                        <div className="flex items-center justify-center rounded-sm w-full h-48 border">
                            {name}
                        </div>

                        {/* Feature -> Add a avatar of all the users in this room */}

                        <div className="flex justify-between m-2 h-full gap-3">
                            <button onClick={() => { router.push(`canvas/${id}`) }} className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg transition-colors">Join</button>
                            <button onClick={() => { setDeleteMsg(true) }} className="bg-red-600 hover:bg-red-800 px-6 py-2 rounded-lg transition-colors">Delete space</button>
                        </div>
                    </div>
                </div>}
        </div>

    )
}