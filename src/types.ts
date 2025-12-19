export interface Task {
  id: string,
  title: string,
  status: "backlog" | "in-progress" | "in-review" | "completed",
  tags: string[],
  background: string | null
}

export interface Board {
  id: string,
  name: string,
  emoji: string,
  link?: string,      
  tasks?: Task[],     
}

export type UseBoardsListResult = {
  boards: Board[];
  loading: boolean;
};

export type UseBoardDataResult = {
  boardData: { tasks: Task[] } | null;
  loading: boolean;
  error: string
};

export interface TaskGridRow {
    id: string,
    taskID: string,
    taskTitle: string,
    projectID: string,
    projectName: string,
    status: string,
    tags?: string[] | null,
    background?: string | null
}

export type TaskStatus = "backlog" | "in-progress" | "in-review" | "completed";