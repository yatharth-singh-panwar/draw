import { Pencil } from "lucide-react";
export default function Navbar({ toggleNewSpaceDialogBox}) {
    return (
        <div className=" sticky-top flex fixed z-50 items-center justify-between w-full h-20 border-b border-grayLine border-opacity-50 px-10">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Pencil className="h-7 w-7 text-primary" />
                <span className="font-semibold text-lg">Draw</span>
            </div>
            <div>
                <button className="h-14 w-36 flex items-center justify-center bg-primary hover:bg-primary-dark text-lg rounded-lg" onClick={toggleNewSpaceDialogBox}>
                    New Space
                </button>
            </div>
        </div>
    )
} 