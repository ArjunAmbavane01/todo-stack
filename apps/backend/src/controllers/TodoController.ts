import client from "@repo/db/client";

export const getTodos = async (req: Request) => {
    try {
        const userId = (req as { userId?: string }).userId;
        const user = await client.user.findUnique({ where: { id: userId }, include: { todos: true } });
        if (!user) return Response.json({ type: "error", message: "Error Fetching User Todos" }, { status: 500 })

        const todos = user.todos;
        if (todos.length === 0) return Response.json({ type: "success", message: "User does not have any todos", todos }, { status: 200 })

        return Response.json({ type: "success", message: "User Todos", todos, }, { status: 200 })
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 })
    }
}

export const getChannelTodos = async (req: Request) => {
    try {
        const userId = (req as { userId?: string }).userId;
        const todos = await client.todo.findMany({where:{NOT:{id:userId}}})
        if (todos.length === 0) return Response.json({ type: "success", message: "User does not have any todos", todos }, { status: 200 })

        return Response.json({ type: "success", message: "Channel Todos", todos, }, { status: 200 })
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 })
    }
}

export const addTodo = async (req: Request) => {
    try {
        const userId = (req as { userId?: string }).userId as string;
        const body = await req.json();
        const { title, description } = body as { title: string, description: string };
        if (!title || !description) return Response.json({ type: "error", message: "Invalid Todo Body" }, { status: 400 })

        const todo = await client.todo.create({ data: { title, description, completed: false, userId } })
        return Response.json({ type: "success", message: "Todo Added Successfully", todoId: todo.id }, { status: 200 })
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error", }, { status: 500 })
    }
}

export const deleteTodo = async (req: Request) => {
    try {
        const userId = (req as { userId?: string }).userId as string;
        const body = await req.json();
        const { todoId } = body as { todoId: string };

        if (!todoId) return Response.json({ type: "error", message: "Todo id not present" }, { status: 400 })

        try {
            await client.todo.delete({ where: { id: todoId, userId } });
            return Response.json({ type: "success", message: "Todo Deleted Successfully", }, { status: 200 });
        } catch (e) {
            return Response.json({ type: "error", message: "Todo not found", }, { status: 404 });
        }
    } catch (e) {
        return Response.json({ type: "error", message: "Internal Server Error", }, { status: 500 })
    }
}

export const updateTodo = async (req: Request) => {
    try {
        const userId = (req as { userId?: string }).userId as string;
        const body = await req.json();
        const { title, description, completed, todoId } = body as { title: string | null, description: string | null, completed: boolean | null, todoId: string | null };
        const updateBody = {} as unknown as { title: string, description: string, completed: boolean, todoId: string };
        if (title) updateBody.title = title;
        if (description) updateBody.description = description;
        if (completed) updateBody.completed = completed;

        if (!todoId) return Response.json({ type: "error", message: "Todo id not present" }, { status: 400 });
        if (Object.keys(updateBody).length === 0) return Response.json({ type: "error", message: "No Valid Keys To update" }, { status: 400 });

        try {
            await client.todo.update({ where: { id: todoId, userId }, data: updateBody });
            return Response.json({
                type: "success",
                message: "Todo Updated Successfully",
            }, { status: 200 });
        } catch (e) {
            return Response.json({
                type: "error",
                message: "Todo not found",
            }, { status: 404 });
        }
    } catch (e) {
        return Response.json({
            type: "error",
            message: "Internal Server Error",
        }, { status: 500 })
    }
}