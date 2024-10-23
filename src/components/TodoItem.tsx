"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types";
import { useState } from "react";
import { TodoFormData } from "@/lib/zod";
import { TodoDialog } from "./TodoDialog";
import { ConfirmDialog } from "./ConfirmDialog";

export function TodoItem({ todo }: { todo: Todo }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: TodoFormData) => {
      await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setEditDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setDeleteDialogOpen(false);
    },
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow gap-4">
      <div className="flex items-center space-x-4">
        <Checkbox
          checked={todo.isCompleted}
          onCheckedChange={() => toggleMutation.mutate()}
        />
        <div>
          <h3
            className={`font-medium ${
              todo.isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-sm text-gray-500">{todo.description}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditDialogOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </div>

      <TodoDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        onSubmit={(data) => editMutation.mutate(data)}
        todo={todo}
        mode="edit"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Todo"
        description="Are you sure you want to delete this todo? This action cannot be undone."
      />
    </div>
  );
}
