import React from "react";
import { Container, Typography } from "@mui/material";
import BoardItem from "./BoardItem";
import type { Board } from "../../types";

interface BoardsListProps {
  boardsList: Board[];
  activeBoardID: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}
const BoardsList = ({
  boardsList,
  activeBoardID,
  onSelect,
  onDelete,
}: BoardsListProps) => {
  return (
    <Container disableGutters>
      {boardsList.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
          No boards found.
        </Typography>
      ) : (
        boardsList.map((board) => (
          <BoardItem
            key={board.id}
            board={board}
            isActive={board.id === activeBoardID}
            onSelect={() => onSelect(board.id)}
            onDelete={() => onDelete(board.id)}
          />
        ))
      )}
    </Container>
  );
};

export default BoardsList;
