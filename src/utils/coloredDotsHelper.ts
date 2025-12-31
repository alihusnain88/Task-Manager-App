import type { Task } from "../types";

export const STATUS_DOTS: Record<Task["status"], string> = {
  "backlog": "#c94040ff",
  "in-progress": "#f59e0b",
  "in-review": "#a855f7",
  "completed": "#22c55e",
};