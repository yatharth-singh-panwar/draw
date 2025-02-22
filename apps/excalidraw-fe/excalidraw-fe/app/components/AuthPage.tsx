export default function AuthPage({isSignin} : {isSignin: boolean}){
    return(
        <div className="w-full h-screen flex items-center justify-center">
            <div className="border-white border-2 rounded-lg w-96 h-96">
                <div className="w-full h-full flex flex-col items-center justify-center p-2 gap-10">
                    <div>
                        <p>Enter your email</p>
                        <input className="mt-2 rounded-lg h-10 w-full text-black p-2" type="text" placeholder="email"></input>
                    </div>
                    <div>
                        <p>Enter your password</p>
                        <input className="mt-2 rounded-lg h-10 w-full text-black p-2" type="password" placeholder="password"></input>
                    </div>
                    <div>
                        <button className="p-2 w-36 h-12 rounded-lg bg-blue-700 hover:bg-blue-500">
                                {isSignin ? "Sign in":"Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}