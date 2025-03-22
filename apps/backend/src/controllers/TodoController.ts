import client from "@repo/db/client";

export const getTodos = async (req:Request) => {
    try{
        const userId = (req as {userId?:string}).userId;
        const user = await client.user.findUnique({where:{id:userId}, include:{todos:true}});
        if(!user) {
            return Response.json({
                type:"error",
                message:"Error Fetching User Todos",
            }, {status:500})
        }
        const todos = user.todos;
        if(todos.length === 0){
            return Response.json({
                type:"success",
                message:"User does not have any todos",
                todos
            }, {status:200})
        }
        return Response.json({
            type:"success",
            message:"User Todos",
            todos,
        }, {status:200})
    } catch(e){
        return Response.json({
            type:"error",
            message:"Internal Server Error",
        }, {status:500})
    }
}

export const addTodo = async (req:Request) => {
    try{
        const userId = (req as {userId?:string}).userId;
        const body = await req.json();
        const {title, description} = body as unknown as { title: string, description: string };
        if(!title || !description) {
            return Response.json({
                type:"error",
                
            })
        }
        return Response.json({
            type:"error",
            message:"Todo Added Successfully",
        }, {status:200})
    } catch(e){
        return Response.json({
            type:"error",
            message:"Internal Server Error",
        }, {status:500})
    }
}