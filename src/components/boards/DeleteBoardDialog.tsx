import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import React from 'react'

interface DeleteBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteBoard: (id: number | null) => void;
  boardToDeleteID: number | null;
}
const DeleteBoardDialog = ({isOpen, onClose, onDeleteBoard, boardToDeleteID}: DeleteBoardDialogProps) => {
    const theme = useTheme()
  return (
   <Dialog
        open={isOpen}
        onClose={onClose}
      >
        <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
          Delete Board?
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Typography>Are you sure you want to delete this board?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 8, p: 2 }}>
          <Button
            disableElevation
            disableRipple
            onClick={()=>{
                onDeleteBoard(boardToDeleteID) 
                onClose()
            }}
            sx={{
              flex: 1,
              backgroundColor: "#8e0808",
              color: 'white',
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { backgroundColor: "#a30b0b" },
            }}
          >
            Delete
          </Button>
          <Button
            disableElevation
            disableRipple
            onClick={onClose}
            sx={{
              flex: 1,
              background: "none",
              color: theme.palette.text.primary,
              borderRadius: 1,
              textTransform: "none",
              border: `1px solid ${theme.palette.text.primary}`,
              "&:hover": { background: theme.palette.background.default },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default DeleteBoardDialog