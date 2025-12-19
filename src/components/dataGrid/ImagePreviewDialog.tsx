// components/ImagePreviewDialog.tsx
import React from "react";
import { Dialog, DialogContent } from "@mui/material";

interface Props {
  open: boolean;
  image: string | null;
  onClose: () => void;
}

const ImagePreviewDialog: React.FC<Props> = ({ open, image, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth>
    <DialogContent
      sx={{
        p: 0,
        textAlign: "center",
        backgroundColor: "white",
        height: "55vh",
        overflow: "hidden",
      }}
    >
      {image && (
        <img
          src={image}
          alt="preview"
          style={{ maxWidth: "100%", height: "100%" }}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default ImagePreviewDialog;
