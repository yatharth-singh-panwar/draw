"use client"
import { Pencil } from "lucide-react"
import { useRef } from "react"
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
 

async function authenticateUser(username:string, password:string, isSignin: boolean){
    if(isSignin){
        try{
            const response = await axios.post(`${BACKEND_URL}/signin`, {
                username: username,
                password: password
            },{
                withCredentials:true
            })
            //200 status code. sign in successfull
            const res = response.data;
            toast("Authentication successful", {
                description: res.data,
            });
        
            return true;
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 400) {
                    toast("Authentication failed", {
                        description: error.response.data.msg,
                    });
                } else if (error.response.status === 404) {
                    toast("Authentication failed", {
                        description: error.response.data.msg,
                    });
                } else if (error.response.status === 500) {
                    
                    toast("Authentication failed", {
                        description: error.response.data.msg,
                    });
                } else {
                    
                    toast("Authentication failed", {
                        description: error.response.data.msg,
                    });
                }
            }
        }
    }
    else{
        try{
            await axios.post(`${BACKEND_URL}/signup`, {
            username: username,
            password: password
            })
        }
        catch(e){
            return e;
        }
    }
}

export default function AuthPage({isSignin} : {isSignin: boolean}){
    const username = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const router = useRouter();

    return(
       <div className="w-full h-full">
       <div className="w-full h-screen flex items-center justify-center">
        <div>
            
        </div>
        <div className="border border-white rounded-lg w-80 h-96">
            <div className="w-full h-full flex flex-col items-center justify-center p-2 gap-8">
                <div className="flex items-center space-x-3 justify-center">
                    <Pencil className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">Draw</span>
                </div>
                <div>
                    <p className="text-lg p-1">Enter your username</p>
                    <input ref={username} className="mt-2 rounded-lg h-10 w-full text-black p-2" type="text" placeholder="username"></input>
                </div>
                <div>
                    <p className="text-lg p-1">Enter your password</p>
                    <input ref={password} className="mt-2 rounded-lg h-10 w-full text-black p-2" type="password" placeholder="password"></input>
                </div>
                <div>
                    <button onClick=
                        {
                            async ()=>{
                                const res = await authenticateUser(username.current.value, password.current.value, isSignin)
                                if(res && isSignin){
                                    router.push('/space');
                                }
                                }
                        } className="p-2 w-36 h-12 rounded-lg bg-blue-700 hover:bg-blue-500">
                        {isSignin ? "Sign in":"Sign up"}
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div> 
    )
}

