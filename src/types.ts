export type Todo = {
  id: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};
