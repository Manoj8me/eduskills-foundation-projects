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
} from "@mui/material";
import CommonModal from "../modal/CommonModal";
import { tokens } from "../../../theme";
// import { isEqual } from "lodash";

const AddItem = ({ fields, onAdd, onCancel }) => {
  const initialValue = () => {
    const defaultValues = {};
    fields.forEach((field) => {
      if (field.type === "switch") {
        // Set default value for switch type fields
        defaultValues[field.name] =
          field.variant === "yesNo" ? "no" : "InActive";
      }
    });

    return defaultValues;
  };
  const [addedItem, setAddedItem] = useState(()=>initialValue());
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDateValid, setIsDateValid] = useState(true);
  const [isMembershipValid, setIsMembershipValid] = useState(true);

  const handleFieldChange = (name, value) => {
    const newAddedItem = { ...addedItem, [name]: value };
    setAddedItem(newAddedItem);

    const allFieldsFilled = fields.every((field) => {
      const fieldValue = newAddedItem[field.name];
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      );
    });
    setHasChanges(allFieldsFilled);
  };

  const handleSave = () => {
    // Check if the required fields are filled
    const isDateFilled =
      addedItem.expire_date && addedItem.expire_date !== "null";
    const isMembershipFilled =
      addedItem.valid_days && addedItem.valid_days !== "";

    setIsDateValid(isDateFilled);
    setIsMembershipValid(isMembershipFilled);

    if (isDateFilled && isMembershipFilled) {
      setIsConfirmationModalOpen(true);
    } else {
      // console.log("Invalid or no changes to save.");
    }
  };

  const handleConfirmSave = () => {
    const mappedItem = {
      ...addedItem,
      status: addedItem.status === "Active" ? 1 : 0,
    };

    onAdd(mappedItem);
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
              {field.type === "switch" ? (
                <FormControlLabel
                  control={
                    <Switch
                      name={field.name}
                      color="info"
                      sx={{ ml: 1.5 }}
                      checked={addedItem.status === "Active"}
                      onChange={(e) =>
                        handleFieldChange(
                          "status",
                          e.target.checked ? "Active" : "InActive"
                        )
                      }
                    />
                  }
                  label={addedItem.status}
                />
              ): field.type === "date" ? (
                <TextField
                  label={field.label}
                  color="info"
                  size="small"
                  name={field.name}
                  type="date"
                  value={addedItem[field.name] || "null"}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  fullWidth
                  error={!isDateValid}
                  helperText={!isDateValid && "Expire Date is required"}
                  margin="dense"
                />
              ) : (
                <TextField
                  label={field.label}
                  color="info"
                  size="small"
                  type={field.type === "number" ?"number":"text"}
                  name={field.name}
                  value={addedItem[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                  select={field.type === "select"}
                  error={field.name === "valid_days" && !isMembershipValid}
                  helperText={
                    field.name === "valid_days" &&
                    !isMembershipValid &&
                    "Membership is required"
                  }
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
          disabled={!hasChanges}
        >
          Add
        </Button>
        <Button variant="contained" color="inherit" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
      <CommonModal
        open={isConfirmationModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        action="add"
      />
    </div>
  );
};

const CommonDrawer = ({
  isOpen,
  onClose,
  fields,
  title,
  setSelectedAddItems,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    onClose();
  };

  return (
    <Drawer anchor="left" open={isOpen}>
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
        <AddItem
          title={title}
          fields={fields}
          onAdd={(addedItem) => {
            setSelectedAddItems(addedItem);
          }}
          onCancel={handleClose}
        />
      </Container>
    </Drawer>
  );
};

export default CommonDrawer;
