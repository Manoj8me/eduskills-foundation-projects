import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Container,
  useTheme,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import CommonModal from "../modal/CommonModal";
import { tokens } from "../../../theme";

const CustomEditDrawer = ({
  isOpen,
  onClose,
  config,
  onConfirm,
  editedItem,
  setEditedItem,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [fieldValidities, setFieldValidities] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    validateFields();
  }, [editedItem]);

  useEffect(() => {
    validateFields();
    const initialSelectedValues = {};
    config.fields.forEach((field) => {
      if (field.type === "multiselect") {
        const valuesFromEditedItem = editedItem[field.name] || [];
        initialSelectedValues[field.name] = valuesFromEditedItem.map((value) => {
          return field.options.find((option) => option.value === value) || null;
        });
      }
    });
    setSelectedValues(initialSelectedValues);
  }, [editedItem]);

  const handleFieldChange = (name, value) => {
    const newEditedItem = { ...editedItem, [name]: value };
    setEditedItem(newEditedItem);

    const allFieldsFilled = config.fields.every((field) => {
      const fieldValue = newEditedItem[field.name];
      return (
        fieldValue !== undefined &&
        fieldValue !== null &&
        fieldValue !== "" &&
        fieldValue?.length !== 0
      );
    });

    setHasChanges(allFieldsFilled);
    // Handle multiselect directly without useEffect

    // if (
    //   config.fields.some(
    //     (field) => field.name === name && field.type === "multiselect"
    //   )
    // ) {
    //   // Convert the selected values to an array of IDs

    //   const newSelectedValues = Array.isArray(value)
    //     ? value.map((val) => val.value)
    //     : [];
    //   setSelectedValues({ ...selectedValues, [name]: newSelectedValues });
    // }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const fieldValiditiesCopy = { ...fieldValidities };

    if (config.fields.find((field) => field.name === name)) {
      if (
        config.fields.find(
          (field) => field.name === name && field.type === "date"
        )
      ) {
        fieldValiditiesCopy[name] = value !== "null";
      }

      if (
        config.fields.find(
          (field) => field.name === name && field.type === "switch"
        )
      ) {
        fieldValiditiesCopy[name] = value !== undefined && value !== null;
      }
    }

    setFieldValidities(fieldValiditiesCopy);
  };

  const validateFields = () => {
    const fieldValiditiesCopy = { ...fieldValidities };

    config.fields.forEach((field) => {
      const fieldValue = editedItem[field.name];

      if (field.type === "date") {
        fieldValiditiesCopy[field.name] = fieldValue !== "null";
      }

      if (field.type === "switch") {
        fieldValiditiesCopy[field.name] =
          fieldValue !== undefined && fieldValue !== null;
      }
    });

    setFieldValidities(fieldValiditiesCopy);
  };

  const handleSave = () => {
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSave = () => {
    onConfirm(editedItem);
    setIsConfirmationModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    setSelectedValues({});
    onClose();
  };

  return (
    <Drawer elevation={999} anchor="left" open={isOpen}>
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
          {config.title || ""}
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
        <Box sx={{ overflowY: "auto" }}>
          <Grid container spacing={2}>
            {config.fields.map((field) => (
              <Grid item xs={12} xl={6} key={field.name}>
                {field.type === "switch" ? (
                  <Box sx={{ alignItems: "center", display: "flex" }}>
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 500,
                        color:
                          (field.variant === "yesNo" &&
                            editedItem[field.name] === "yes") ||
                          (field.variant === "activeInactive" &&
                            editedItem[field.name] === "Active")
                            ? colors.blueAccent[300]
                            : colors.grey[600],
                        bgcolor:
                          (field.variant === "yesNo" &&
                            editedItem[field.name] === "yes") ||
                          (field.variant === "activeInactive" &&
                            editedItem[field.name] === "Active")
                            ? colors.blueAccent[700]
                            : colors.grey[900],
                        px: 1.5,
                        py: 0.3,
                        borderRadius: 1,
                      }}
                    >
                      {field.label}
                    </Box>

                    <FormControlLabel
                      control={
                        <Switch
                          name={field.name}
                          color="info"
                          sx={{ ml: 1.5 }}
                          checked={
                            (field.variant === "yesNo" &&
                              editedItem[field.name] === "yes") ||
                            (field.variant === "activeInactive" &&
                              editedItem[field.name] === "Active")
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              field.name,
                              e.target.checked
                                ? field.variant === "yesNo"
                                  ? "yes"
                                  : "Active"
                                : field.variant === "yesNo"
                                ? "no"
                                : "InActive"
                            )
                          }
                        />
                      }
                      label={
                        (field.variant === "yesNo" && editedItem[field.name]) ||
                        (field.variant === "activeInactive" &&
                          editedItem[field.name])
                      }
                    />
                  </Box>
                ) : field.type === "date" ? (
                  <TextField
                    label={field.label}
                    color="info"
                    size="small"
                    name={field.name}
                    type="date"
                    value={editedItem[field.name] || "null"}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    fullWidth
                    margin="dense"
                  />
                ) : field.type === "multiselect" ? (
                  <Autocomplete
                    multiple
                    value={selectedValues[field.name] || []}
                    onChange={(event, newValues) => {
                      const newSelectedValues = {
                        ...selectedValues,
                        [field.name]: newValues,
                      };

                      setSelectedValues(newSelectedValues);
                      handleFieldChange(field.name, newValues.map(val => val.value));
                    }}
                    options={field?.options || []}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.label}
                        variant="outlined"
                        margin="dense"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>,
                        }}
                      />
                    )}
                  />
                ) : field.type === "select" ? (
                  <Autocomplete
                    // value={selectedValues[field.name] || null}
                    value={
                      editedItem[field.name]
                        ? field.options.find(
                            (option) => option.value === editedItem[field.name]
                          )
                        : null
                    }
                    onChange={(event, newValue) => {
                      const newSelectedValues = {
                        ...selectedValues,
                        [field.name]: newValue,
                      };
                      setSelectedValues(newSelectedValues);
                      handleFieldChange(
                        field.name,
                        newValue ? newValue.value : null
                      );
                    }}
                    options={field.options || []}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.label}
                        variant="outlined"
                        margin="dense"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: <>{params.InputProps.endAdornment}</>,
                        }}
                      />
                    )}
                    renderOption={(props, option, { inputValue }) => {
                      const matches = option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase());
                      const parts = option.label.split(
                        new RegExp(`(${inputValue})`, "gi")
                      );

                      return (
                        <MenuItem {...props}>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={matches ? { fontWeight: 700 } : {}}
                            >
                              {part}
                            </span>
                          ))}
                        </MenuItem>
                      );
                    }}
                  />
                ) :field.type === "multiline" ? (
                  <TextField
                    label={field.label}
                    color="info"
                    size="small"
                    multiline
                    rows={4} // Set the number of rows as needed
                    name={field.name}
                    value={editedItem[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                ): (
                  <>
                    <TextField
                      label={field.label}
                      color="info"
                      size="small"
                      type={field.type === "number" ? "number" : "text"}
                      name={field.name}
                      value={editedItem[field.name] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      fullWidth
                      margin="dense"
                    />
                  </>
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
            mr: 1,
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="info"
            onClick={handleSave}
            disabled={!hasChanges} // Uncomment this line
          >
            {config.saveButtonText || "Add"}
          </Button>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            {config.cancelButtonText || "Cancel"}
          </Button>
        </Box>
        <CommonModal
          open={isConfirmationModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmSave}
          action={config.modalAction || "add"}
        />
      </Container>
    </Drawer>
  );
};

export default CustomEditDrawer;
