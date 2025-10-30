import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { AdminService } from "../../../services/dataService";
import { toast } from "react-toastify";
import { tokens } from "../../../theme";

const DomainConfirmationModal = ({
  isOpen,
  onClose,
  // onConfirm,
  // domain,

  setInstStatus,
  institueId,
  inst,
  setInst,
}) => {
  const [inputDomain, setInputDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [instDomain, setInstDomain] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  const fetchDoaminName = async (institueId) => {
    setLoading(true);
    try {
      const response = await AdminService.admin_domain_name(institueId);

      const data = response.data.data;

      setInstDomain(data);
      setInst(data.inst_domain);
      setInstStatus(data.status);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    if (institueId) {
      fetchDoaminName(institueId);
    }
  }, [institueId, inst, refresh]);

  const validateDomain = (domain) => {
    const regex = /^[a-z0-9]+(\.[a-z0-9]+)+$/;
    return regex.test(domain);
  };

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setError("");

    // Validate the input domain
    if (!validateDomain(value)) {
      setError("Invalid domain format");
    }

    setInputDomain(value);
  };

  const updatedData = {
    inst_domain: inputDomain,
  };

  const domainData = { data: updatedData, institue_id: institueId };

  const handleUpdate = async (domainData) => {
    setLoading(true);
    try {
      const response = await AdminService.admin_domain_update(domainData);

      const data = response.data;
      setRefresh(true);
      handleSuccessMessage(data.detail);
      onClose();
      setInputDomain("");
    } catch (error) {
      handleErrorMessage(error);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  const handleConfirm = () => {
    if (inst) {
      onClose();
      setInputDomain("");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
        }}
      >
        {instDomain?.status ? (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", fontWeight: 600, fontSize: 14 }}
          >
            <Box component="span" color={colors.blueAccent[300]}>
              Domain:{" "}
            </Box>
            {instDomain?.inst_domain}
          </Typography>
        ) : (
          <TextField
            label="Institution Domain"
            variant="outlined"
            fullWidth
            size="small"
            onChange={handleChange}
            value={inputDomain}
            error={!!error}
            helperText={error}
          />
        )}
        <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            color="info"
            onClick={() =>
              instDomain?.status ? handleConfirm() : handleUpdate(domainData)
            }
            disabled={loading || !!error}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : instDomain?.status ? (
              "Confirm"
            ) : (
              "Update"
            )}
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={onClose}
            disabled={loading}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DomainConfirmationModal;
