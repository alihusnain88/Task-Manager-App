import { Box, Container, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import TaskColumn from "../tasks/TaskColumn";
import AddTaskDialog from "../tasks/AddTaskDialog";
import type { Column, Task, TaskStatus } from "../../types";

interface MainPanelProps {
  activeBoardID: number | null;
  tasksForBoard: Task[];
  totalBoards: number | null;
  totalTasksForBoard: number;
  onAddTask: (task: Task) => void;
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void;
  onEditTask: (task: Task) => void;
}
const COLUMNS: Column[] = [
  { key: "backlog", title: "Backlogs" },
  { key: "in-progress", title: "In Progress" },
  { key: "in-review", title: "In Review" },
  { key: "completed", title: "Completed" },
] as const;

const MainPanel = ({
  activeBoardID,
  tasksForBoard,
  totalBoards,
  totalTasksForBoard,
  onAddTask,
  onMoveTask,
  onEditTask,
}: MainPanelProps) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <Box
    sx={{
        flex: 1,
        height: "100%",
        scrollbarWidth: "none",
        backgroundColor: theme.palette.background.default,
        borderRadius: "10px",
        display: "flex",
        alignItems: "flex-start",
        gap: 0.8,
        px: { xs: 2, sm: 3, md: 4 },
        py: 2,
        overflowX: { xs: "auto", md: "hidden" },
        overflowY: "auto",
      }}
    >
      {totalBoards! > 0 && activeBoardID !== null ? (
        COLUMNS.map((col) => (
          <TaskColumn
            key={col.key}
            activeBoardID={activeBoardID}
            column={col}
            tasks={tasksForBoard?.filter((task) => task.status === col.key)}
            onOpen={() => {
              setEditingTask(null);
              setIsEditing(false);
              setIsOpen(true);
            }}
            onMoveTask={onMoveTask}
            setIsOpen={setIsOpen}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ))
      ) : (
        <Typography width="100%" textAlign="center">
          Add or select a board to see tasks.
        </Typography>
      )}

      <AddTaskDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        totalTasksForBoard={totalTasksForBoard}
        activeBoardID={activeBoardID}
        onAddTask={onAddTask}
        editingTask={editingTask}
        isEditing={isEditing}
        onEditTask={onEditTask}
        setIsEditing={setIsEditing}
        setEditingTask={setEditingTask}
      />
    </Box>
  );
};

export default MainPanel;
