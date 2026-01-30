import { Box, Typography } from "@mui/material";
import BoardItem from "./BoardItem";
import type { Board } from "../../types";

interface BoardsListProps {
  boards: Board[];
  activeBoardID: number | null;
  setActiveBoardID: (id: number) => void;
    setIsDeleteDialogOpen: (isOpen: boolean) => void;
    setBoardToDeleteID: (id: number) => void;
}
const BoardsList = ({
  boards,
  activeBoardID,
  setActiveBoardID,
  setIsDeleteDialogOpen,
  setBoardToDeleteID
}: BoardsListProps) => {
  return (
    <Box>
      {boards.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
          No boards found.
        </Typography>
      ) : (
        boards?.map((board) => (
          <BoardItem
            key={board.id} 
            board={board}
            isActive={board.id === activeBoardID}
            onSelect={() => setActiveBoardID(board.id)}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setBoardToDeleteID={setBoardToDeleteID}
          />
        ))
      )}
    </Box>
  );
};

export default BoardsList;
