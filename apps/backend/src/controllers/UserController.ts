import client from "@repo/db/client";
import { withCORS } from "..";

export const handleGetUsername = async (req:Request) => {
    try {
        const userId = (req as { userId?: string }).userId;
        const user = await client.user.findFirst({ where: {id:userId} })
        return withCORS(Response.json({ type: "success", username:user?.username }, { status: 200 }));
    } catch (e) {
        return withCORS(Response.json({ type: "error", message: "Internal Server Error" }, { status: 500 }));
    }
}

