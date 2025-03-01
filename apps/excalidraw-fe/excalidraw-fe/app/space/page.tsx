import { BACKEND_URL } from "@/config";
import axios from "axios";
import Space from "../components/space";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RenderSpaces from "./renderSpaces";
import  DeleteModel  from "../components/DeleteModel";

async function getUserSpaces() {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get("jwt").value;

        const res = await axios.post(`${BACKEND_URL}/space`,{}, {
            headers:{
                cookie: `jwt=${jwtToken}`
            },
            withCredentials:true
        })
        console.log(res.data.spaces);
        return res.data.spaces;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403) {
                console.log("You are not authenticated to view this.")
                //redirect to the sign in page.               
            } 
        }
    }
}
export default async function UserSpace() {
    const spaces = await getUserSpaces();
    if(!spaces){
        redirect('/signin');
    }
    
    return (
        <>
            <RenderSpaces spaces={spaces}/>
        </>
    );
}