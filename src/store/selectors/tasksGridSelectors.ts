import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from ".."
import {type TaskGridRow} from '../../types'


export const selectAllTasksForGrid = createSelector(
  [
    (state: RootState) => state.boards.list,
    (state: RootState) => state.tasks.byBoardID,
  ],
  (boards, tasksByBoard): TaskGridRow[] => {
    const rows: TaskGridRow[] = [];
    // const rows = mockRows
    

    boards.forEach((board) => {
      const tasks = tasksByBoard[board.id] ?? [];

      tasks.forEach((task) => {
        rows.push({
          id: `${board.id}-${task.id}`,
          taskID: task.id,
          taskTitle: task.title,
          projectID: board.id,
          projectName: board.name,
          status: task.status,
          tags: task.tags ?? [],
          background: task.background,
        });
      });
    });

    return rows;
  }
);