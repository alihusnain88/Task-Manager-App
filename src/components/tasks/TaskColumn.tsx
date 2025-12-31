import { Box, Typography, Button, Container } from "@mui/material";
import TaskCard from "./TaskCard";
import AddIcon from "@mui/icons-material/Add";
import { STATUS_DOTS } from "../../utils/coloredDotsHelper";
import type { Column, Task, TaskStatus } from "../../types";

interface TaskColumnProps {
  activeBoardID: number;
  column: Column;
  tasks: Task[];
  onOpen: () => void;
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void;
  onReorderTask: ({
    boardID,
    fromStatus,
    toStatus,
    fromIndex,
    toIndex,
  }: {
    boardID: number;
    fromStatus: TaskStatus;
    toStatus: TaskStatus;
    fromIndex: number;
    toIndex: number;
  }) => void;
  setIsOpen: (isOpen: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const TaskColumn = ({
  activeBoardID,
  column,
  tasks,
  onOpen,
  onMoveTask,
  onReorderTask,
  setIsOpen,
  editingTask,
  setEditingTask,
  isEditing,
  setIsEditing,
}: TaskColumnProps) => {
  const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData("application/json");
    if (!rawData) return;

    const data = JSON.parse(rawData);

    const taskID = Number(data.taskID);

    if (data.fromStatus !== column.key) {
      onMoveTask(taskID, column.key, sortedTasks?.length || 0);
    }
  };

  return (
    <Container
      disableGutters
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{ minWidth: "25%", minHeight: "100%" }}
    >
      <Box sx={{ flex: 1, p: 0, minHeight: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            gap: 0.5,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: STATUS_DOTS[column.key],
            }}
          />
          <Typography
            fontWeight={400}
            fontSize={12}
          >{`${column.title} (${tasks?.length})`}</Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {sortedTasks?.map((task, index) => (
            <TaskCard
              key={task.taskID}
              activeBoardID={activeBoardID}
              task={task}
              index={index}
              onReorder={onReorderTask}
              onMoveTask={onMoveTask}
              setIsOpen={setIsOpen}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          ))}
        </Box>

        {column.key === "backlog" && (
          <Button
            variant="contained"
            onClick={onOpen}
            endIcon={<AddIcon />}
            sx={{
              mt: 1,
              gap: 2,
              height: "30px",
              width: "100%",
              borderRadius: "10px",
              fontSize: "0.7rem",
              backgroundColor: "rgb(195 218 250)",
              color: "rgb(51 86 211)",
              "&:hover": { backgroundColor: "rgb(199 222 254)" },
            }}
          >
            Add new task card
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default TaskColumn;
