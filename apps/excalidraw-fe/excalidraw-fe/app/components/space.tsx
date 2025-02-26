
import { Button } from "./buttons/button";

export default function Space({name}: {name: string}){
    return(
        <div className="w-72 h-72 rounded-lg border border-1 p-6">
            <div>

            </div>

            <div className="">
                <div className="flex justify-between flex-col">
                    
                    <div className="flex items-center justify-center rounded-sm w-full h-48 border">
                        {name}
                    </div>

                    {/* Feature -> Add a list of all the users in this room */}

                    <div className="flex justify-between m-2 h-full">
                        <Button text="Join"></Button>
                        <Button hoverColor="" color="bg-red-700" text="Delete space"/>
                    </div>
                </div>
            </div>
        </div>
    )
}