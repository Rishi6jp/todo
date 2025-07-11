import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function DELETE(request: Request, { params } : { params: { id: string}}){
    const session = await getServerSession(authOptions);
    const todo_id = params.id;

    if(!session){
        return new Response("Unautharized", {status: 401});
    }
    const todo = await prisma.todo.findUnique({
        where: {
            id: todo_id,
        }
    })

    if(!todo){
        return new Response("Todo not found", { status: 404 })
    }
    if(todo.userId !== session.user.id){
        return new Response("Forbidden", { status: 403})
    }

    await prisma.todo.delete({
        where : {id : todo_id}
    })

    return new Response("Todo Deleted", {status: 200});
}

export async function POST(request: Request, { params } : { params: { id: string}}){
    const session = await getServerSession(authOptions);
    const todo_id = params.id;

    if(!session){
        return new Response("Unautharized", {status: 401});
    }
    const todo = await prisma.todo.findUnique({
        where: {
            id: todo_id,
        }
    });
    
    if(!todo){
        return new Response("Todo not found", { status: 404 })
    }
    if(todo.userId !== session.user.id){
        return new Response("Forbidden", { status: 403})
    }

    const {title ,completed } = await request.json();
    
    await prisma.todo.update({
        where: {
            id: todo_id
        },
        data: {
            title: title,
            completed: completed
        }
    })

    return new Response("Todo Updated", {status: 200});
}
