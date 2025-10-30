import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import PageNotFoundImg from "../../assets/imgs/svg/404 Error Page not Found.svg";
import { useNavigate } from "react-router-dom";

const PageNotFoundModal = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCancel = () => {
    navigate("/"); // Always navigate to "/dashboard"
  };
  
  return (
    <Dialog open>
      <DialogContent>
        <div>
          <img src={PageNotFoundImg} alt="Page Not Found" style={{ width: "100%" }} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="info">
          Back To Home
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageNotFoundModal;
