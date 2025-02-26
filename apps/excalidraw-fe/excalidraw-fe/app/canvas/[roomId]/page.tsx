import { RoomCanvas } from "@/app/components/RoomCanvas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function CanvasPage({params}:{ params:{
    roomId: string
}}){
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value as string;
    if(!jwt){
        redirect('/signin');
    }
    const roomId = (await params).roomId;

    return(
        <RoomCanvas roomId= {roomId} jwt={jwt}/>
    )
}   