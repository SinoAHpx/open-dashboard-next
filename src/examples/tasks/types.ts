export interface Task {
  id: string;
  name: string;
  avatar: string;
  email: string;
  progress: number;
  status: "in-progress" | "completed" | "pending" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  tags: string[];
}

export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];
