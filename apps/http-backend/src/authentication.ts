import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_KEY = process.env.JWT_PASS;

export function authentication(req: Request, res : Response, next: NextFunction){
    console.log("cookies recieved are ", req.cookies);
    const tokenId = req.cookies.jwt;
    console.log("authentication reached the token is", tokenId);
    if(!tokenId){
        res.status(403).send({
            msg:"You are not authenticated to view this endpoint."
        })
        return;
    }
    console.log(tokenId);
    try{
        const decodedToken = jwt.verify(tokenId as string, JWT_KEY as string) as string;
        req.headers['userid'] = decodedToken;
        console.log("Decoded token userid is",decodedToken);
        next();
    }
    catch(error){
        res.status(403).send({
            msg:"You are not authenticated to view this endpoint. Invalid token Id"
        })
    }

}