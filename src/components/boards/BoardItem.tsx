import React from "react";
import { Typography, IconButton, Container, Box, useTheme } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Board } from "../../types";
import { randomLightColor } from "./AddBoardDialog";

interface BoardItemProps {
  board: Board;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const BoardItem: React.FC<BoardItemProps> = ({
  board,
  isActive,
  onSelect,
  onDelete,
}) => {
  const theme = useTheme();
  const borderStyles = theme.custom.interactiveBorder;

  return (
    <Container disableGutters sx={{ mb: 1 }}>
      <Box
        onClick={onSelect}
        sx={{
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: theme.shape.borderRadius,
          p: theme.spacing(1),
          cursor: "pointer",
          backgroundColor: borderStyles.background,
          border: `${borderStyles.width} solid ${
            isActive
              ? borderStyles.active.borderColor
              : borderStyles.inactive.borderColor
          }`,
          "&:hover": {
            border: `${borderStyles.width} solid ${
              isActive
                ? borderStyles.active.borderColor
                : borderStyles.hover.inactiveBorderColor
            }`,
          },
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            backgroundColor: randomLightColor(),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            fontSize: 14,
            marginRight: 1,
          }}
        >
          {board.emoji}
        </Box>
        <Typography sx={{ flex: 1, fontSize: "0.8rem" }}>
          {board.name}
        </Typography>

        <IconButton onClick={onDelete} size="small">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Container>
  );
};


export default BoardItem;
