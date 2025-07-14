import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// DELETE /api/todo/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!id) {
    return new Response("Missing todo id", { status: 400 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return new Response("Todo not found", { status: 404 });
  }
  if (todo.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.todo.delete({
    where: { id },
  });

  return new Response("Todo Deleted", { status: 200 });
}

// PUT /api/todo/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const id = params.id;

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!id) {
    return new Response("Missing todo id", { status: 400 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id },
  });

  if (!todo) {
    return new Response("Todo not found", { status: 404 });
  }
  if (todo.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const { title, completed } = await request.json();

  const updated = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  });

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
