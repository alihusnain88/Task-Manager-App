import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 700, textAlign: "center" }}>
        Delete Row?
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 2 }}>
        <Typography>
          Are you sure you want to delete this row?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 8, p: 2 }}>
        <Button
          disableElevation
          disableRipple
          onClick={onConfirm}
          sx={{
            flex: 1,
            backgroundColor: "#8e0808",
            color: "white",
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
            borderRadius: 1,
            textTransform: "none",
            border: "1px solid",
            "&:hover": { background: "action.hover" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
