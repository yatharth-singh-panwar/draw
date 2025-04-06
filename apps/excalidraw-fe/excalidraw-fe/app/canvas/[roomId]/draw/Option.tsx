interface optionProps {
    visible: boolean,
    strokeColor: String,
    background: String,
    strokeWidth: Number,
    setStrokeColor: React.Dispatch<React.SetStateAction<String>>,
    setBackground : React.Dispatch<React.SetStateAction<String>>,
    setStokeWidth : React.Dispatch<React.SetStateAction<Number>>,
}
export function Option(props: optionProps) {
return (
        // props.visible &&
        <div className="p-1 w-56 h-96 bg-gray-900 rounded-xl">
            <div className="w-full flex p-2 flex-col items-center gap-3">
                <div className="stroke w-full text-base flex flex-col mb-5 ">
                    <div className="mb-1 font-semibold">Stroke</div>
                    <div className="px-0 strokeColor flex justify-between">
                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-strokeOptions-white rounded-md ${props.strokeColor == "bg-strokeOptions-white" ? "border-[2px] rounded-md border-gray-200" : ""}`} onClick={()=>{props.setStrokeColor("bg-strokeOptions-white")}}></div>
                        
                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-strokeOptions-red rounded-md ${props.strokeColor == "bg-strokeOptions-red" ? "border-[2px] rounded-md border-gray-200" : ""}`} onClick={()=>{props.setStrokeColor("bg-strokeOptions-red")}}></div>

                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-strokeOptions-green rounded-md ${props.strokeColor == "bg-strokeOptions-green" ? "border-[2px] rounded-md border-gray-200" : ""}`} onClick={()=>{props.setStrokeColor("bg-strokeOptions-green")}}></div>

                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-strokeOptions-blue rounded-md ${props.strokeColor == "bg-strokeOptions-blue" ? "border-[2px] rounded-md border-gray-200" : ""}`}  onClick={()=>{props.setStrokeColor("bg-strokeOptions-blue")}}></div>

                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-strokeOptions-orange rounded-md ${props.strokeColor == "bg-strokeOptions-orange" ? "border-[2px] rounded-md border-gray-200" : ""}`}  onClick={()=>{props.setStrokeColor("bg-strokeOptions-orange")}}></div>
                            
                        <div className="h-7 border-[1px] rounded-lg border-gray-600 mx-1"> </div>
                        <div className = {`w-7 h-7 ${props.strokeColor} rounded-md`}></div>
                    </div>
                </div>

                <div className="bg w-full text-base flex flex-col mb-5">
                    <div className="mb-1 font-semibold">Background</div>
                    <div className="px-0 bgColor flex  justify-between">
                        <div className="w-7 h-7 bg-[#00000000] rounded-md" onClick={()=>{props.setBackground("transparent")}}></div>
                        
                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-background-pink rounded-md  ${props.background == "bg-background-pink" ? "border-[2px] rounded-md border-gray-200" : ""}` } onClick={()=>{props.setBackground("bg-background-pink")}}></div>


                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-background-green rounded-md  ${props.background == "bg-background-green" ? "border-[2px] rounded-md border-gray-200" : ""}` } onClick={()=>{props.setBackground("bg-background-green")}}></div>

                        
                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-background-blue rounded-md  ${props.background == "bg-background-blue" ? "border-[2px] rounded-md border-gray-200" : ""}` } onClick={()=>{props.setBackground("bg-background-blue")}}></div>

                        <div className={`w-7 h-7 hover:border-[2px] hover:rounded-md hover:border-gray-300 bg-background-peach rounded-md  ${props.background == "bg-background-peach" ? "border-[2px] rounded-md border-gray-200" : ""}` } onClick={()=>{props.setBackground("bg-background-peach")}}></div>
                        <div className="h-7 border-[1px] rounded-lg border-gray-600 mx-1"> </div>
                        <div className={`w-7 h-7 ${props.background} rounded-md`}></div>
                    </div>
                </div>

                <div className="StrokeWidth w-full text-base flex flex-col mb-5">
                    <div className="mb-1 font-semibold">Stroke Width</div>
                    <div className="px-0 StrokeWidth flex  justify-between">
                        <div className={`w-9 h-9 bg-slate-900 rounded-md flex items-center justify-center hover:border-[1px] border-gray-300 ${props.strokeWidth == 1 ? "border-[1px] rounded-md border-gray-200":""}`} onClick={()=>{props.setStokeWidth(1)}}>
                            <div className="w-1/2 rounded-md h-[1px] bg-white"></div>
                        </div>
                        <div className={`w-9 h-9 hover:border-[1px] border-gray-300 bg-slate-900 rounded-md flex items-center justify-center ${props.strokeWidth == 2 ? "border-[1px] rounded-md border-gray-200":""}`}onClick={()=>{props.setStokeWidth(2)}}>
                            <div className="w-1/2 rounded-md h-[3px] bg-white"></div>
                        </div>
                        <div className={`w-9 h-9 hover:border-[1px] border-gray-300 bg-slate-900 rounded-md flex items-center justify-center ${props.strokeWidth == 3 ? "border-[1px] rounded-md border-gray-200":""}`} onClick={()=>{props.setStokeWidth(3)}}>
                            <div className="w-1/2 rounded-md h-[6px] bg-white"></div>
                        </div>

                        <div className="h-7 border-[1px] rounded-lg border-gray-600 mx-1"> </div>
                        <div className="w-9 h-9 hover:border-[1px] border-gray-300 bg-slate-900 rounded-md flex items-center justify-center">
                            <div className={`w-1/2 rounded-md ${props.strokeWidth === 1 ? 'h-[1px]' : ''} ${props.strokeWidth === 2 ? 'h-[3px]' : ''} ${props.strokeWidth === 3 ? 'h-[6px]' : ''} bg-white`}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}