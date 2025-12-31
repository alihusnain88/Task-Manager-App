export type TaskStatus = "backlog" | "in-progress" | "in-review" | "completed";

export interface Task {
  boardID: number;
  taskID: number;
  title: string;
  status: TaskStatus;
  tags: string[] | [];
  background: string | null;
  priority: number;
}

export interface Board {
  id: number;
  name: string;
  logo: string;
}


export interface TaskGridRow {
  id: number;
  boardID: number;
  boardName: string;
  taskID: number;
  taskTitle: string;
  status: TaskStatus;
  tags?: string[] | null;
  background?: string | null;
}


export interface Column {
  key: "backlog" | "in-progress" | "in-review" | "completed";
  title: "Backlogs" | "In Progress" | "In Review" | "Completed";
}