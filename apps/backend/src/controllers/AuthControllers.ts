import client from "@repo/db/client";
import {sign} from 'jsonwebtoken';
import {compare, genSalt, hash} from 'bcrypt';

export const handleSignup = async (req:Request) => {
    try {
        const body = await req.json();
        const { username, password } = body as unknown as { username: string, password: string };

        const salt = await genSalt(10);
        const hashedPassword = await hash(password,salt);
        const newUser = await client.user.create({ data: {username,password:hashedPassword} })
        return Response.json({
            status: "success",
            message: "User Signup Successful"
        }, { status: 200 })
    } catch (e) {
        return Response.json({
            status: "error",
            message: "Internal Server Error",
        }, { status: 500 })
    }
}

export const handleLogin = async (req:Request) => {
    try {
        const body = await req.json();
        const { username, password } = body as unknown as { username: string, password: string };

        const user = await client.user.findFirst({ where: {username} })
        if(!user){
            return Response.json({
                status: "error",
                message: "User Not Found",
            }, { status: 404 })
        }
        const verifyPass = await compare(password,user.password);
        if(!verifyPass) {
            return Response.json({
                status: "error",
                message: "Wrong Password",
            }, { status: 401 })
        }
        const jwtToken = sign({userId:user.id},process.env.JWT_SECRET_KEY as string)
        return Response.json({
            status: "success",
            message: "User Login Successful",
            token: jwtToken
        }, { status: 200 })
    } catch (e) {
        return Response.json({
            status: "error",
            message: "Internal Server Error",
        }, { status: 500 })
    }
}