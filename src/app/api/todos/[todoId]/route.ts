import { prisma } from "@/lib/db";
import { todoSchema } from "@/lib/zod";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Type for route params
interface RouteParams {
  params: {
    todoId: string;
  };
}

// Schema for patch request
const patchTodoSchema = todoSchema.partial().extend({
  isCompleted: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { todoId } = params;

    // Verify todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = patchTodoSchema.parse(body);

    // Update todo
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: validatedData,
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { todoId } = params;

    // Verify todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Delete todo
    await prisma.todo.delete({
      where: { id: todoId },
    });

    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
