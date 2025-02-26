import express, {Request, Response} from "express";
import {string, z} from "zod";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { prismaClient } from "@repo/db/src/index";
import { authentication } from "./authentication";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
// Removed unnecessary variable assignment

app.use(cors({
    origin: "http://localhost:3000", // Change this to match your frontend URL
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
    console.log("Cookies:", req.cookies);
    next();
});

const JWT_KEY = process.env.JWT_PASS;

if (!JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
}
//Signup endpoint
app.post('/signup', async (req  : Request, res : Response)=>{
    const username  = req.body.username;
    const pass = req.body.pass;
    
    //input validation using zod.
    const newUser = z.object({
        username : z.string(),
        pass : z.string()
    })
    try{
        newUser.parse({
            username : username,
            pass : pass
        })        
    }
    catch(e){
        res.status(401).send({
            msg: "Zod input validation failed",
            error: e
        })
    }

    //Check for the user in the database.
    const user = await prismaClient.user.findUnique({
        where:{
            userName: username
        }
    })

    if(user){
        res.status(404).send({
            msg:"The user alreday exists in the database, please add a new user"
        })
    }

    //insert the user details in the database.
    try{
        await prismaClient.user.create({
            data:{
                userName: username,
                password: pass,
                avatar:""
            },
        })

        res.send({  
            msg:"User has been created successfully."
        })
    }
    catch(e){
        res.send({  
            msg:"User could not be created."
        })

    }

})

//Signin endpoint
app.post('/signin', async (req: Request, res: Response)=> {
    const userName = req.body.username;
    const password = req.body.password;
    const signInStructure = z.object({
        userName: string(),
        pass: string()
    })
    try{
        signInStructure.parse({userName: userName, pass: password});
    }
    catch(e){
        res.status(400).send({
            msg:"Input validation error",
            error: e
        })
    }

    //search for the user in the database.
    let userid;
    try{
        const user = await prismaClient.user.findUnique({
            where:{
                userName:userName,
                password:password
            }
        })

        if(!user){
            res.status(404).send({
                msg:"No user found. Try again"
            })
            return;
        }  
        userid = user.id;  
    }
    catch(e){
        res.status(500).send({
            msg:"internal server error"
        })
    }

    //give a signed jwt token to the user.

    //Find the userId and put it in the jwtToken
    const jwtToken =  jwt.sign(userid as string, JWT_KEY);
    // @audit-issue - Do not set secure to true for security reasons.
    res.cookie("jwt", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, // Disable secure in development
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "lax" for local testing
    });
    res.status(200).send({  
        msg:"Signed in successfully"
    })
})

app.use(authentication);

//Create room endpoint
app.post('/roomjoin',async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.headers['userid'];
    console.log("The userId is ",userId);
    const slug = req.body.name;
    try{
        const room  = await prismaClient.room.create({
            data:{
                slug: slug,
                adminId:userId as string
            }
        })
        res.json({
            roomId: room.id
        })
    }
    catch(e){
        res.json({
            msg:"A room with that name already exists. Please try a different room name.",
            error:e
        })
    }        
    return;

})


//get all the existing shapes in the database
app.get('/chats/:roomId', async(req: Request, res:Response)=>{
    const roomId = parseInt(req.params.roomId as string, 10);
    try{
        const chats = await prismaClient.chat.findMany({
            where:{
                roomId: roomId,
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        })
        res.json({
            chats
        })
    }
    catch(e){
        res.json({
            messages: []
        })
    }
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})


// get all the user rooms in the database
app.post("/space", async (req, res) => {
    const userId = req.headers['userid'] as string;
    if(!userId){
        return
    }
    try {
        const spaces = await prismaClient.room.findMany({
            where: {
                adminId: userId
            }
        });
        res.status(200).send({
            spaces
        });
    } catch (e) {
        res.status(500).send({
            msg: "Internal server error",
            error: e
        });
    }
});
app.listen(4000)