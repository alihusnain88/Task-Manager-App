import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { type Task } from "../../types";
import { getTagColor } from "../../utils/tagColorsHelper";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const theme = useTheme();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskID", task.id);
    e.dataTransfer.setData("taskStatus", task.status);
  };

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
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
        "&:hover": {
          boxShadow: theme.shadows[2],
        },
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
            mb: 0,
          }}
        />
      )}
      <Typography fontWeight={200} fontSize={10} lineHeight={1.4}>
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
                fontSize: 6,
                fontWeight: 700,
                textTransform: "capitalize",
                letterSpacing: 0.5,
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
