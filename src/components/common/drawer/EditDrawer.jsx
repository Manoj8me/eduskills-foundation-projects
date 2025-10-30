import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Container,
  useTheme,
  CircularProgress,
} from "@mui/material";
import CommonModal from "../modal/CommonModal";
import { tokens } from "../../../theme";
import { AdminService } from "../../../services/dataService";
import { isEqual } from "lodash";

const EditItem = ({ fields, onSave, onCancel, editData }) => {

  const stateOptions =
    fields[3]?.options?.filter(
      (option) =>
        option.label.trim().toLowerCase() ===
        editData.state_name.trim().toLowerCase()
    ) || [];

  const stateId = stateOptions.length > 0 ? stateOptions[0].value : null;

  const updatedEditData = {
    ...editData,
    state_name: stateId,
  };

  const [editedItem, setEditedItem] = useState(updatedEditData || {});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const changes = !isEqual(editData, editedItem);
    setHasChanges(changes);
  }, [editData, editedItem]);

  const handleClose = () => {
    onCancel();
  };

  const handleFieldChange = (name, value) => {
    setEditedItem({ ...editedItem, [name]: value });

    const isDateFilled =
      editedItem.expire_date && editedItem.expire_date !== "null";
    const isMembershipFilled =
      editedItem.valid_days && editedItem.valid_days !== "";
    const isMemNoFilled =
      (editedItem.mem_no && editedItem.mem_no !== "") || null || undefined;
    const isInstituteNameFilled =
      editedItem.institute_name && editedItem.institute_name !== "";
    const isCityNameFilled =
      editedItem.city_name && editedItem.city_name !== "";
    const isStateNameFilled =
      editedItem.state_name && editedItem.state_name !== "";

    const isValids =
      isDateFilled &&
      isMembershipFilled &&
      isMemNoFilled &&
      isInstituteNameFilled &&
      isCityNameFilled &&
      isStateNameFilled;

    setIsValid(isValids);
  };

  const handleSave = () => {
    if (hasChanges && isValid) {
      setIsConfirmationModalOpen(true);
    } else {
      // console.log("Invalid or no changes to save.");
    }
  };

  const handleConfirmSave = () => {
    onSave(editedItem);
    setIsConfirmationModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <div>
      <Box sx={{ overflowY: "auto" }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} xl={6} key={field.name}>
              {field.type === "switch" && editedItem.status !== undefined ? (
                <FormControlLabel
                  control={
                    <Switch
                      name={field.name}
                      color="info"
                      sx={{ ml: 1.5 }}
                      checked={editedItem.status === "Active"}
                      onChange={(e) =>
                        handleFieldChange(
                          "status",
                          e.target.checked ? "Active" : "InActive"
                        )
                      }
                    />
                  }
                  label={editedItem.status}
                />
              ) : field.type === "date" ? (
                <TextField
                  label={field.label}
                  color="info"
                  size="small"
                  name={field.name}
                  type="date" // Set the input type to date
                  value={editedItem[field.name] || "null"}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                />
              ) : (
                <TextField
                  label={field.label}
                  color="info"
                  size="small"
                  name={field.name}
                  type={field.type === "number" ? "number" : ""}
                  value={editedItem[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                  select={field.type === "select"}
                >
                  {field.type === "select" &&
                    field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          right: 0,
          p: 1,
        }}
      >
        <Button
          variant="contained"
          sx={{ mr: 1 }}
          color="info"
          onClick={handleSave}
          disabled={!isValid}
        >
          Update
        </Button>
        <Button variant="contained" color="inherit" onClick={handleClose}>
          Cancel
        </Button>
      </Box>
      <CommonModal
        open={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        action="update"
      />
    </div>
  );
};

const CommonDrawer = ({
  isOpen,
  onClose,
  fields,
  title,
  setSelectedEditItems,
  memNo,
  institueId,
  isEditDrawerOpen,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setEditData(null);
    onClose();
  };

  const fetchData = async (institueId) => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const response = await AdminService.admin_institute(institueId);
      const data = response.data.data;
      setEditData(data[0]);
      const updateEditData = { ...data[0], mem_no: memNo };
      setEditData(updateEditData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    if (institueId) {
      // Check if institueId is truthy (not null or undefined)
      fetchData(institueId);
    }
  }, [institueId, isEditDrawerOpen]);

  return (
    <Drawer anchor="left" open={isOpen}>
      {/* <div style={{ maxWidth: "600px", padding: "16px" }}> */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.blueAccent[800],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          color={colors.blueAccent[200]}
          fontWeight={600}
        >
          {/* {title} */}
          {title || ""}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "600px",
          },
          [theme.breakpoints.up("sm")]: {
            width: "600px",
          },
          my: 1,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
            }}
          >
            <CircularProgress color="info" />
          </Box> // Display a loader while fetching data
        ) : editData ? (
          <EditItem
            title={title}
            fields={fields}
            editData={editData}
            onSave={(editedItem) => {
              setSelectedEditItems(editedItem);
            }}
            onCancel={handleClose}
          />
        ) : (
          <Typography
            variant="subtitle1"
            style={{ color: colors.redAccent[400] }}
          >
            Sorry, no data found.
          </Typography>
        )}
        {/* </div> */}
      </Container>
    </Drawer>
  );
};

export default CommonDrawer;
