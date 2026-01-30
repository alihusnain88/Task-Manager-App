import { Button, useTheme, Box } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BoardsList from "../boards/BoardsList";
import AddBoardDialog from "../boards/AddBoardDialog";
import ThemeToggleButtons from "../../theme/ThemeToggleButtons";
import type { Board } from "../../types";
import DeleteBoardDialog from "../boards/DeleteBoardDialog";

interface SidebarProps {
  boards: Board[];
  activeBoardID: number | null;
  setActiveBoardID: (id: number) => void;
  onDeleteBoard: (id: number | null) => void;
  onAddBoard: (board: Board) => void;
}
const Sidebar = ({
  boards,
  activeBoardID,
  setActiveBoardID,
  onDeleteBoard,
  onAddBoard,
}: SidebarProps) => {
  const theme = useTheme();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [boardToDeleteID, setBoardToDeleteID] = useState<number | null>(null)

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        scrollbarWidth: "none",
        pt: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <BoardsList
          boards={boards}
          activeBoardID={activeBoardID}
          setActiveBoardID={setActiveBoardID}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setBoardToDeleteID={setBoardToDeleteID}
        />
        <Button
          variant="text"
          startIcon={<AddCircleIcon />}
          disableElevation
          disableRipple
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            m: 1,
            textTransform: "none",
            color: theme.palette.text.primary,
            background: "none",
            fontSize: "0.9rem",
            "&:hover": { backgroundColor: theme.palette.action.selected },
          }}
        >
          Add new board
        </Button>
      </Box>

      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          position: "sticky",
          bottom: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 10,
        }}
      >
        <ThemeToggleButtons />
      </Box>

      <AddBoardDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        boards={boards}
        onAddBoard={onAddBoard}
      />

      <DeleteBoardDialog isOpen={isDeleteDialogOpen} onClose={()=> setIsDeleteDialogOpen(false)} onDeleteBoard={onDeleteBoard} boardToDeleteID={boardToDeleteID}/>

    </Box>
  );
};
 
export default Sidebar;
