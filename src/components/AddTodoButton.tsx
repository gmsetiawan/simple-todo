"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoDialog } from "./TodoDialog";
import { TodoFormData } from "@/lib/zod";

export function AddTodoButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: TodoFormData) => {
      await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
    },
  });

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Todo</Button>
      <TodoDialog
        open={open}
        setOpen={setOpen}
        onSubmit={(data) => mutation.mutate(data)}
        mode="add"
      />
    </>
  );
}
