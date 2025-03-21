import { Router, type Request, type Response } from "express";

const todoRouter = Router();

todoRouter.get('/',(req:Request,res:Response)=>{
    res.send('Hello');
    return;
})

export default todoRouter;

