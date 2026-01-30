import { Box, Typography, useTheme } from "@mui/material";
import { getTagColor } from "../../utils/tagColorsHelper";
import type { Task, TaskStatus } from "../../types";

interface TaskCardProps {
  activeBoardID: number | null;
  task: Task;
  index: number;
  onMoveTask: (taskID: number, newStatus: TaskStatus, toIndex: number) => void;
  setIsOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const TaskCard = ({
  activeBoardID,
  task,
  index,
  onMoveTask,
  setIsOpen,
  setEditingTask,
  setIsEditing,
}: TaskCardProps) => {
  const theme = useTheme();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        boardID: activeBoardID,
        taskID: task.taskID,
        fromStatus: task.status,
        fromIndex: index,
      })
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("application/json"));

    onMoveTask(data.taskID, task.status, index);
  };

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => {
        setIsOpen(true);
        setIsEditing(true);
        setEditingTask(task);
      }}
      sx={{
        p: 1,
        borderRadius: 0.5,
        bgcolor: "background.paper",
        cursor: "grab",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        mb: 1,
        boxShadow: theme.shadows[1],
        "&:hover": { boxShadow: theme.shadows[2] },
      }}
    >
      {task.background && (
        <Box
          sx={{
            width: "100%",
            height: 60,
            borderRadius: 0.5,
            backgroundImage: `url(${task.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <Typography
        fontWeight={200}
        fontSize={10}
        lineHeight={1.4}
        sx={{ color: theme.palette.text.primary, fontWeight: 200, fontSize: {xs: 8, sm: 10, md: 12}, lineHeight: 1.4}}
      >
        {task.title}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {task.tags?.map((tag) => {
          const style = getTagColor(tag);
          return (
            <Box
              key={tag}
              sx={{
                px: 1,
                py: 0.25,
                bgcolor: style.bg,
                color: style.text,
                borderRadius: "6px",
                fontSize: {xs: 4, sm: 5, md: 6},
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {tag}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TaskCard;
