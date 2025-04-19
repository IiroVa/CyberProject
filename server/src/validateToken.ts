import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"


interface CustomRequest extends Request {
    user?: JwtPayload
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {

    const token: string | undefined = req.header('authorization')?.split(" ")[1]

    if(!token){res.status(401).json({message: "Access denied, missing token"})}else{
        try {

            const verified: JwtPayload = jwt.verify(token, process.env.ACCESSTOKENSECRET as string) as JwtPayload
            req.user = verified
            console.log("verified")
            next()
    
        } catch (error: any) {
            if(error instanceof jwt.TokenExpiredError){

                res.status(403).json({message: "Token Expired"})

            }else if (error instanceof jwt.JsonWebTokenError) {
                console.log('Invalid token!'); // Token ei ole kelvollinen
                res.status(402).json({message: "Access denied invalid token."})
            }else{
                console.log("Internal server error")
                res.status(400).json({message: "Internal server error"})
            }
            
        }
    }
    
}