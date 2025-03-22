import { serve } from "bun";
import { verify } from 'jsonwebtoken';
import { handleLogin, handleSignup } from "./controllers/AuthControllers";
import { addTodo, deleteTodo, getTodos, updateTodo } from "./controllers/TodoController";

const authMiddleware = (req: Request, next: (req: Request) => Promise<Response>) => {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
        const token = authHeader.startsWith('Bearer') ? authHeader.split('Bearer ')[1] : null;
        if (!token) {
            return Response.json({ type: "error", message: "JWT Token Not Present" }, { status: 401 })
        }
        try {
            const payload = verify(token, process.env.JWT_SECRET_KEY as string);
            if (typeof payload === 'string') return Response.json({ type: "error", message: "Invalid JWT Token" }, { status: 401 });
            if (!payload || !payload.userId) return Response.json({ type: "error", message: "Invalid JWT Token" }, { status: 401 });

            (req as { userId?: string }).userId = payload.userId;
            return next(req);
            
        } catch (e) {
            return Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 })
        }
    }
    else return Response.json({ type: "error", message: "Auth Header Not Present" }, { status: 401 })
}

const server = serve({
    port: 3001,
    routes: {
        "/": new Response('Hello from API'),
        "/signup": { POST: handleSignup },
        "/login": { POST: handleLogin },
        "/user/todos": {
            GET: (req) => authMiddleware(req, getTodos),
            POST: (req) => authMiddleware(req, addTodo),
            DELETE: (req) => authMiddleware(req, deleteTodo),
            PATCH: (req) => authMiddleware(req, updateTodo)
        }
    }
})

console.log(`Listening on http://localhost:${server.port}`);