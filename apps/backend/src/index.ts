import { serve } from "bun";
import { verify } from 'jsonwebtoken';
import { handleLogin, handleSignup } from "./controllers/AuthControllers";
import { addTodo, deleteTodo, getChannelTodos, getTodos, updateTodo } from "./controllers/TodoController";
import { handleGetUsername } from "./controllers/UserController";

const PORT = 3001;

const authMiddleware = (req: Request, next: (req: Request) => Promise<Response>) => {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
        const token = authHeader.startsWith('Bearer') ? authHeader.split('Bearer ')[1] : null;
        if (!token) {
            return Response.json({ type: "error", message: "JWT Token Not Present" }, { status: 401 })
        }
        try {
            const payload = verify(token, process.env.JWT_SECRET_KEY!);
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

export function withCORS(response: Response): Response {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

const server = serve({
    port: PORT,
    routes: {
        "/": new Response('Hello from API'),
        "/signup": { 
            OPTIONS: () => withCORS(new Response(null, { status: 204 })),
            POST: handleSignup
         },
        "/login": {
            OPTIONS: () => withCORS(new Response(null, { status: 204 })),
            POST: handleLogin
        },
        "/user": {
            OPTIONS: () => withCORS(new Response(null, { status: 204 })),
            POST: handleGetUsername
        },
        "/user/todos": {
            OPTIONS: () => withCORS(new Response(null, { status: 204 })),
            GET: (req) => authMiddleware(req, getTodos),
            POST: (req) => authMiddleware(req, addTodo),
            DELETE: (req) => authMiddleware(req, deleteTodo),
            PATCH: (req) => authMiddleware(req, updateTodo)
        },
        "/channel/todos": {
            OPTIONS: () => withCORS(new Response(null, { status: 204 })),
            GET: (req) => authMiddleware(req, getChannelTodos),
        }
    }
})

console.log(`Listening on http://localhost:${server.port}`);