import { Container, useTheme } from "@mui/material";
import React, { useState } from "react";
import TaskColumn from "../tasks/TaskColumn";
import AddTaskDialog from "../tasks/AddTaskDialog";
import { type Task } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch } from "../../store";
import {
  openAddTaskDialog,
  openEditTaskDialog,
  closeTaskDialog,
} from "../../store/slices/tasksSlice";

const COLUMNS = [
  { key: "backlog", title: "Backlogs" },
  { key: "in-progress", title: "In Progress" },
  { key: "in-review", title: "In Review" },
  { key: "completed", title: "Completed" },
] as const;

interface MainPanelProps {
  tasks: Task[];
  onAddTask: (task: Task, isEdit: boolean) => void;
}

const MainPanel: React.FC<MainPanelProps> = ({
  tasks,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const isOpen = useSelector(
    (state: RootState) => state.tasks.isTaskDialogOpen
  );
  const editingTask = useSelector(
    (state: RootState) => state.tasks.editingTask
  );

  const handleTaskClick = (task: Task) => {
    if (task.status === "backlog" && task.title === "Add your backlogs here")
      return;
    dispatch(openEditTaskDialog(task));
  };

  return (
    <Container
      sx={{
        
        minHeight: "100%",
        overflow: "scroll",
        scrollbarWidth: "none",
        backgroundColor: theme.palette.background.default,
        flex: 1,
        borderRadius: "10px",
        display: "flex",
        padding: 2,
        gap: 0.8
      }}
    >
      {COLUMNS.map((col) => (
        <TaskColumn
          key={col.key}
          column={col}
          tasks={tasks.filter((t) => t.status === col.key)}
          onTaskClick={handleTaskClick}
          onAddTask={() => {
            dispatch(openAddTaskDialog());
          }}
        />
      ))}

      <AddTaskDialog
        isOpen={isOpen}
        setIsOpen={(open) => {
          if (!open) dispatch(closeTaskDialog());
        }}
        task={editingTask} 
      />
    </Container>
  );
};

export default MainPanel;

