import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const data = await req.json();
  const todo = await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
    },
  });
  return NextResponse.json(todo);
}
