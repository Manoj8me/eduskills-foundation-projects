import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
// import WorkingImg from "../../../assets/imgs/svg/working.svg";
import { ReactComponent as WorkingImg } from "../../../assets/imgs/svg/working.svg";

const UnderWorkingModal = ({onClose}) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose()
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          borderRadius:2
        }}
      >
        <WorkingImg style={{ width: 100, height: 100 }} />
        <Typography variant="h5" gutterBottom>
          Under Construction
        </Typography>
        <Typography variant="body1" gutterBottom>
          This feature is currently under development.
        </Typography>
        <Button variant="contained" color="info" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default UnderWorkingModal;
