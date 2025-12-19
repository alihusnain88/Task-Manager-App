import React from "react";
import { Container } from "@mui/material";
import BoardItem from "./BoardItem";
import type { Board } from "../../types";

interface BoardsListProps {
  boardsList: Board[],
  activeBoardID: string | null,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void
}
const BoardsList: React.FC<BoardsListProps> = ({boardsList, activeBoardID, onSelect, onDelete}) => {

  return (
    <Container disableGutters>
      {boardsList.map((board) => (
        <BoardItem
          key={board.id}
          board={board}
          isActive={board.id === activeBoardID}
          onSelect={()=> onSelect(board.id)}
          onDelete={() => onDelete(board.id)}
        />
      ))}
    </Container>
  );
};

export default BoardsList;
