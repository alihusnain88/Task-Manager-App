import { useState } from "react";
import data from "./json/data.json";
import GridView from "./views/GridView";
import PanelView from "./views/PanelView";
import { BrowserRouter, Route, Routes } from "react-router";
import ProjectView from "./pages/ProjectView";
import TaskView from "./pages/TaskView";
import type { Board, Task, TaskStatus } from "./types";

const TaskManagerApp = () => {
  const [boards, setBoards] = useState<Board[] | []>((data.boards || []) as Board[]);
  const [allTasks, setAllTasks] = useState<Task[] | []>((data.tasks || []) as Task[]);
  const [activeBoardID, setActiveBoardID] = useState<number | null>(null); 
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const tasksForBoard =
    allTasks?.filter((task) => task?.boardID === activeBoardID) || [];

  const handleAddTaskForBoard = (newTask: Task) => {
  setAllTasks(prev => [...prev, newTask]); 
}; 

  const handleEditTask = (updatedTask: Task) => {
  setAllTasks((prevTasks) => 
    prevTasks.map((task) => 
      task.taskID === updatedTask.taskID && task.boardID === updatedTask.boardID ? { ...task, ...updatedTask } : task
    )
  );
};

  const handleAddBoard = (newBoard: Board) => {
    setBoards((prev) => [...prev, newBoard]);
    setActiveBoardID(Number(newBoard.id));
  };

  const handleDeleteTasksForBoard = (boardToDeleteID: number | null) => {
    setAllTasks((prev) =>
      prev.filter((curr) => curr.boardID !== boardToDeleteID)
    );
  };

  const handleDeleteTaskByID = (id: number | null) => {
    setAllTasks(prev => prev.filter((task) => (
      task.taskID !== id
    )))
  }

  const handleDeleteBoard = (boardToDeleteID: number | null) => {
    const updatedBoards = boards.filter(
      (board) => Number(board.id) !== boardToDeleteID
    );

    setBoards(updatedBoards);

    if (boardToDeleteID === activeBoardID) {
      const nextActiveBoardID =
        updatedBoards.length > 0 ? updatedBoards[0].id : null;
      setActiveBoardID(nextActiveBoardID); 
    }

    handleDeleteTasksForBoard(boardToDeleteID);
  };

  const handleMoveTask = (taskID: number, newStatus: TaskStatus, toIndex: number) => {
    if (activeBoardID === null) return;

    setAllTasks((prev) => {
      const oldTask: Task | {} = prev.find((t) => Number(t.taskID) === Number(taskID)) || {};
      const otherTasks = prev.filter(
        (t) => Number(t.taskID) !== Number(taskID)
      );
      const targetColumnTasks = otherTasks
        .filter(
          (t) => Number(t.boardID) === activeBoardID && t.status === newStatus
        )
        .sort((a, b) => a.priority - b.priority);

      let insertIndex;
      if (toIndex !== undefined && targetColumnTasks[toIndex]) {
        insertIndex = otherTasks.findIndex(
          (t) => Number(t.taskID) === Number(targetColumnTasks[toIndex].taskID)
        );
      } else {
        insertIndex = otherTasks?.length;
      }

      const movedTask = { ...oldTask, status: newStatus };

      const updatedTasks = [...otherTasks];
      updatedTasks.splice(insertIndex, 0, movedTask);

      const columnAfterMove = updatedTasks.filter(
        (t) => Number(t.boardID) === activeBoardID && t.status === newStatus
      );

      return updatedTasks.map((t) => {
        if (Number(t.boardID) === activeBoardID && t.status === newStatus) {
          const newPriority = columnAfterMove.findIndex(
            (ct) => Number(ct.taskID) === Number(t.taskID)
          );
          return { ...t, priority: newPriority };
        }
        return t;
      });
    });
  };

  const handleReorderTask = ({
    boardID,
    fromStatus,
    toStatus,
    fromIndex,
    toIndex,
  }: {boardID: number | null, fromStatus: TaskStatus, toStatus: TaskStatus, fromIndex: number, toIndex: number}) => {
    if (fromStatus !== toStatus) return;

    setAllTasks((prev) => {
      const otherBoardTasks = prev.filter(
        (t) => Number(t.boardID) !== Number(boardID)
      );
      const otherStatusTasks = prev.filter(
        (t) => Number(t.boardID) === Number(boardID) && t.status !== fromStatus
      );

      const columnTasks = prev
        .filter(
          (t) =>
            Number(t.boardID) === Number(boardID) && t.status === fromStatus
        )
        .sort((a, b) => a.priority - b.priority);

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= columnTasks.length ||
        toIndex >= columnTasks.length
      ) {
        return prev;
      }

      const reordered = [...columnTasks];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);

      const reorderedWithPriority = reordered.map((task, index) => ({
        ...task,
        priority: index + 1,
      }));

      return [
        ...otherBoardTasks,
        ...otherStatusTasks,
        ...reorderedWithPriority,
      ];
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            showGrid ? (
              <GridView
                onToggleView={() => setShowGrid(false)}
                boards={boards}
                setBoards={setBoards}
                allTasks={allTasks}
                setAllTasks={setAllTasks}
                onDeleteTask={handleDeleteTaskByID}
              />
            ) : (
              <PanelView
                boards={boards}
                activeBoardID={activeBoardID}
                setActiveBoardID={setActiveBoardID}
                onDeleteBoard={handleDeleteBoard}
                onAddBoard={handleAddBoard}
                tasksForBoard={tasksForBoard}
                onAddTask={handleAddTaskForBoard}
                onMoveTask={handleMoveTask}
                onReorderTask={handleReorderTask}
                onToggleView={() => setShowGrid(true)}
                onEditTask={handleEditTask}
              />
            )
          }
        />
        <Route
          path="/boards/:boardID"
          element={<ProjectView boards={boards} allTasks={allTasks} />}
        />
        <Route
          path="/tasks/:taskID"
          element={<TaskView allTasks={allTasks} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default TaskManagerApp;
