
import e, { NextFunction, Request, Response, Router } from 'express'

import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import { User, IUser } from './models/User'
import { validateToken } from './validateToken'









const router: Router = Router();

router.post("/register",
    
   
    body("password").isLength({min: 5}).escape(),
    body("CToken").escape(),body("password").trim().escape(), body("password").isLength({min:14}),body("password").custom(async value=>{
        
        let characters: string[] = Array.from(value)
        let flagUpper: boolean = false;
        let flagLower: boolean = false;
        let flagNumber: boolean = false;
        

        let numberRegex = /^\d+$/;
        for(let i = 0; i < characters.length; i++){
            let tester: string = characters[i].toUpperCase()
            let number: boolean = numberRegex.test(characters[i])
            if(number){
                continue;
            }
            if(characters[i] === tester){
                
                flagUpper = true
            }

        }
            
        

        for(let i = 0; i < characters.length; i++){
            let tester: string = characters[i].toLowerCase()
            let number: boolean = numberRegex.test(characters[i])
            if(number){
                continue;
            }
            if(characters[i] === tester){
                
                flagLower = true
            }

        }
        

        characters.forEach((e)=>{
            let number: boolean = numberRegex.test(e)
            if(number){
                flagNumber = true;
            }

        })
        
        
        
        
        if(flagUpper == false|| flagLower==false || flagNumber ==false){
            
            throw new Error('Password does not fullfill requirements.');
        }



        
        
    }),
    

     (req: Request, res: Response, next: NextFunction) => {
        console.log("YYYYY")
        const errors: Result<ValidationError> = validationResult(req)

        if(!errors.isEmpty()) {
            console.log(errors);
            res.status(401).json({errors: errors.array()})

            return
            
        }
        next()
    },
        
    async (req: Request, res: Response)=>{
        try {

            let success = false;
            let CToken = req.body.CToken
            if(!CToken){
                res.status(400).json({message: "Captcha token missing"})
            }
            
            const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${CToken}`, {

            })   
            if(recaptchaResponse.ok){
                
                success = true
            }
            if(!success){
                res.status(400).json({message: "Captcha token invalid"})
            }     
            
            const existingUser: IUser | null = await User.findOne({username: req.body.username})
            console.log("hei"+existingUser)
            
            
            
            if (existingUser) {
                
                
                
                res.status(400).json({message: "Username is already in use. Please choose another one."})
                        
                    
                    
                    
                
                
            }else{
                
                    const salt: string = bcrypt.genSaltSync(10)
                    const hash: string = bcrypt.hashSync(req.body.password, salt)
                    
                    
                    const newUser: IUser = new User({
                        username: req.body.username,
                        password: hash,
                        
                    })
                    await newUser.save()
                    res.status(200).json({message: "User registered successfully"})


                }
            
    
            
    
        } catch (error: any) {
            console.error(`Error during registration: ${error}`)
            res.status(500).json({error: "Internal Server Error"})
        }
    
        }
    
)

router.post("/login",
    body("username").trim().escape(),
    body("password").escape(),
    body("CToken").escape(),

    (req: Request, res: Response, next: NextFunction) => {
       console.log("JEEJEE" + req.body.username)
       const errors: Result<ValidationError> = validationResult(req)

       if(!errors.isEmpty()) {
           console.log(errors);
           res.status(400).json({errors: errors.array()})
           return
           
       }
       next()
   },
    async (req: Request, res: Response) => {
        try {

            let success = false;
            let CToken = req.body.CToken
            if(!CToken){
                res.status(410).json({message: "Captcha token missing"})
            }
            console.log("638HEREWEARE")
            const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${CToken}`, {

            })   
            if(recaptchaResponse.ok){
                console.log("639HEREWEARE")
                success = true
            }
            if(!success){
                res.status(410).json({message: "Captcha token invalid"})
            }      
            
            
            const user: IUser | null = await User.findOne({username: req.body.username})

            //console.log(user)

            if (!user) {
                console.log("2XXXXX" + req.body.username)
                res.status(401).json({message: "Login failed"})
            }else{
               
                if (user.password && bcrypt.compareSync(req.body.password, user.password)) {
                    const accessTokenjwtPayload: JwtPayload = {
                        
                        username: user.username.toLowerCase(),
                        
                    }
                    const accessToken: string = jwt.sign(accessTokenjwtPayload, process.env.ACCESSTOKENSECRET as string, { expiresIn: '15m' })
                    const refreshTokenjwtPayload: JwtPayload = {
                        
                        username: user.username.toLowerCase(),
                    }
                    const refreshToken: string = jwt.sign(refreshTokenjwtPayload, process.env.REFRESHTOKENSECRET as string, { expiresIn: '30d' })


                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 30 * 1000
                    }

                    )
                    res.status(200).json({success: true, token: accessToken})
                }else{
                    res.status(403).json({message: "Login failed"})
                    }
                
                
                

            }

            



        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
)


router.post("/secret",validateToken,
    async (req: Request, res: Response) => {
        try {

            res.status(200).json({message: "Secret data accessed successfully"})



        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
)
export default router;
