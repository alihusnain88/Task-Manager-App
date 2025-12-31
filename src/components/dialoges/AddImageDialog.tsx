import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import GridCloseIcon from "@mui/icons-material/Close";

interface AddImageDialogProps {
  open: boolean;
  image: string | null;
  onClose: () => void;
  onRemoveImage: () => void;
  onChangeImage: () => void;
}

const AddImageDialog = ({
  open,
  image,
  onClose,
  onRemoveImage,
  onChangeImage,
}: AddImageDialogProps) => {
  if (!image) return null;

  return (
    <Box>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 1,
        }}
      >
        <GridCloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={image}
          alt="task-image"
          sx={{
            width: "80%",
            height: "80%",
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 3,
          pb: 3,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={onRemoveImage}
          sx={{ textTransform: "none", border: 'none'}}
        >
          Remove Image
        </Button>

        <Button
          variant="contained"
          onClick={onChangeImage}
          sx={{ textTransform: "none", border: 'none'}}
        >
          Change Image
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default AddImageDialog;
