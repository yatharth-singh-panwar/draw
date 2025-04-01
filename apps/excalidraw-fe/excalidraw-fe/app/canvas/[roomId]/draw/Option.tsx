interface optionProps {
    visible: boolean,
    strokeColor: String,
    background: String,
    strokeWidth: 1 | 2 | 3 
}
export function Option() {
    return (
        // props.visible &&
        <div className="p-2 w-56 h-96 bg-gray-950 rounded-md">
            <div className="w-full flex p-1 flex-col">
                <div className="stroke w-full text-base flex flex-col mb-5 ">
                    <div className="mb-1">Stroke</div>
                    <div className="px-0 strokeColor flex justify-between">
                        <div className="w-7 h-7 bg-white rounded-md  "></div>
                        <div className="w-7 h-7 bg-[#e03131] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#2f9e44] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#1971c2] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#f08c00] rounded-md"></div>
                        <div className="h-full w-[3px] bg-white"> </div>
                        <div className="w-7 h-7 bg-[#f08c00] rounded-md"></div>
                    </div>
                </div>

                <div className="bg w-full text-base flex flex-col mb-5">
                    <div className="mb-1">Background</div>
                    <div className="px-0 bgColor flex  justify-between">
                        <div className="w-7 h-7 bg-[#00000000] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#ffc9c9] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#b2f2bb] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#a5d8ff] rounded-md"></div>
                        <div className="w-7 h-7 bg-[#ffec99] rounded-md"></div>
                        <div className="h-full w-[1px] bg-gray-300"></div>
                        <div className="w-7 h-7 bg-[#f08c00] rounded-md"></div>
                    </div>
                </div>

                <div className="StrokeWidth w-full text-base flex flex-col mb-5">
                    <div className="mb-1">Stroke Width</div>
                    <div className="px-0 StrokeWidth flex  justify-between">
                        <div className="w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center">
                            <div className="w-1/2 rounded-md h-[1px] bg-white"></div>
                        </div>
                        <div className="w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center">
                            <div className="w-1/2 rounded-md h-[3px] bg-white"></div>
                        </div>
                        <div className="w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center">
                            <div className="w-1/2 rounded-md h-[6px] bg-white"></div>
                        </div>

                        <div className="h-full w-[1px] bg-gray-300"></div>
                        <div className="w-9 h-9 bg-slate-900 rounded-md"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}