import client from "@repo/db/client";
import {sign} from 'jsonwebtoken';

export const handleSignup = async (req:Request) => {
    try {
        const body = await req.json();
        const { username, password } = body as { username: string, password: string };

        const hashedPassword = await Bun.password.hash(password);
        await client.user.create({ data: {username,password:hashedPassword} })

        return Response.json({ type: "success", message: "User Signup Successful" }, { status: 200 })
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 })
    }
}

export const handleLogin = async (req:Request) => {
    try {
        const body = await req.json();
        const { username, password } = body as { username: string, password: string };

        const user = await client.user.findFirst({ where: {username} })
        if(!user) return Response.json({ type: "error", message: "User Not Found" }, { status: 404 })
        
        const verifyPass = await Bun.password.verify(password,user.password);
        if(!verifyPass) return Response.json({ type: "error", message: "Wrong Password" }, { status: 401 })
        
        const jwtToken = sign({userId:user.id},process.env.JWT_SECRET_KEY as string)
        return Response.json({ type: "success", message: "User Login Successful", token: jwtToken, username:user.username }, { status: 200 })
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 })
    }
}