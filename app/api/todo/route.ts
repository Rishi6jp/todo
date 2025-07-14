import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function POST(request: Request){
    const session = await getServerSession(authOptions)

    if(!session){
        return new Response("Unautharized", {status: 401});
    }

    const { title } = await request.json();
    const todo = await prisma.todo.create({
        data: {
            title, 
            userId: session.user.id,
        }
    })

    return new Response(JSON.stringify(todo),{
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }});
}

export async function GET() {
    const session = await getServerSession(authOptions);

    if(!session){
        return new Response("Unautharized", {status: 401});
    }

    const todos = await prisma.todo.findMany({
        where: {
            userId: session.user.id
        }
    })
    return new Response(JSON.stringify(todos), {
        status: 200,
        headers :{
            "Content-Type": "application/json",
        }
    });
}
