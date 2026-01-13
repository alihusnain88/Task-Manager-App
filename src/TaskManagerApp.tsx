import { useState } from "react";
import data from "./json/data.json";
import GridView from "./views/GridView";
import PanelView from "./views/PanelView";
import { BrowserRouter, Route, Routes } from "react-router";
import ProjectView from "./pages/ProjectView";
import TaskView from "./pages/TaskView";
import type { Board, Task, TaskStatus } from "./types";

const TaskManagerApp = () => {
  const [boards, setBoards] = useState<Board[] | []>(
    (data.boards || []) as Board[]
  );
  const [allTasks, setAllTasks] = useState<Task[] | []>(
    (data.tasks || []) as Task[]
  );
  const [activeBoardID, setActiveBoardID] = useState<number | null>(null);

  const tasksForBoard =
    allTasks?.filter((task) => task?.boardID === activeBoardID) || [];

  const handleAddTaskForBoard = (newTask: Task) => {
    setAllTasks((prev) => [...prev, newTask]);
  };

  const handleEditTask = (updatedTask: Task) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === updatedTask.taskID &&
        task.boardID === updatedTask.boardID
          ? { ...task, ...updatedTask }
          : task
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
    setAllTasks((prev) => prev.filter((task) => task.taskID !== id));
  };

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

  const handleMoveTask = (
    taskID: number,
    newStatus: TaskStatus,
    toIndex: number
  ) => {
    const otherBoardTasks = allTasks.filter(
      (task) => task.boardID !== activeBoardID
    );
    const currentBoardTasks = allTasks.filter(
      (task) => task.boardID === activeBoardID
    );

    const oldTask =
      currentBoardTasks.find((task) => task.taskID === taskID);
    if(!oldTask) return;
    const otherStatusTasks = currentBoardTasks.filter(
      (task) => task.taskID !== taskID && task.status !== newStatus
    );

    let newStatusTasks = currentBoardTasks
      .filter(
        (task) =>
          task.status === newStatus &&
          !(oldTask?.status === newStatus && task.taskID === taskID)
      )
      .sort((a, b) => a.priority - b.priority);

    const movedTask = { ...oldTask, status: newStatus };

    newStatusTasks.splice(toIndex, 0, movedTask);

    let orderedNewStatusTasks = newStatusTasks.map((task, index) => ({
      ...task,
      priority: index + 1,
    }));

    setAllTasks([
      ...otherBoardTasks,
      ...otherStatusTasks,
      ...orderedNewStatusTasks,
    ]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PanelView
              boards={boards}
              activeBoardID={activeBoardID}
              setActiveBoardID={setActiveBoardID}
              onDeleteBoard={handleDeleteBoard}
              onAddBoard={handleAddBoard}
              tasksForBoard={tasksForBoard}
              onAddTask={handleAddTaskForBoard}
              onMoveTask={handleMoveTask}
              onEditTask={handleEditTask}
            />
          }
        />
        <Route
          path="/grid-view"
          element={
            <GridView
              boards={boards}
              setBoards={setBoards}
              allTasks={allTasks}
              setAllTasks={setAllTasks}
              onDeleteTask={handleDeleteTaskByID}
            />
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
