"use client";

import { AddTodoButton } from "@/components/AddTodoButton";
import { TodoList } from "@/components/TodoList";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((res) => res.json()),
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  return (
    <div className="relative min-h-screen flex justify-center items-center">
      <Image
        className="dark:invert fixed top-4 left-4"
        src="https://nextjs.org/icons/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      />
      <main className="max-w-4xl mx-auto w-full flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center gap-4 w-full">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <AddTodoButton />
        </div>
        <TodoList todos={todos} />
      </main>
    </div>
  );
}
