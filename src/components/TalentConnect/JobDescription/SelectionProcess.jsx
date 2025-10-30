import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Radio,
  FormControlLabel,
  RadioGroup,
  Popover,
  Box,
  Grid,
  useTheme,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../theme";

const CustomExpansionPanel = ({
  title,
  values,
  onDelete,
  onEditTitle,
  onEditValue,
  bgColor
}) => {
  const [editTitleAnchor, setEditTitleAnchor] = useState(null);
  const [editValueAnchor, setEditValueAnchor] = useState(null);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedValue, setEditedValue] = useState(values[0]);
  const [editValueIndex, setEditValueIndex] = useState(null);
  const [localEditedTitle, setLocalEditedTitle] = useState(title); // New state for tracking edited title locally

  const handleEditTitleClick = (event) => {
    setEditTitleAnchor(event.currentTarget);
  };

  const handleEditTitleClose = () => {
    setEditTitleAnchor(null);
    setLocalEditedTitle(title); // Reset local edited title if the popover is closed without saving
  };

  const handleEditValueClick = (index) => (event) => {
    setEditValueAnchor(event.currentTarget);
    setEditValueIndex(index);
    setEditedValue(values[index]); // Set editedValue to the clicked value
  };

  const handleEditValueClose = () => {
    setEditValueAnchor(null);
    setEditValueIndex(null);
  };

  const handleSaveEditedTitle = () => {
    onEditTitle(title, localEditedTitle);
    setEditedTitle(localEditedTitle);
    handleEditTitleClose();
  };

  return (
    <Paper sx={{ marginBottom: "10px", padding: "10px",backgroundColor:bgColor }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ ml: 1 }}>
          {editedTitle}
        </Typography>
        <Box>
          <IconButton size="small" onClick={handleEditTitleClick}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(title)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
        <Divider sx={{mt:0.5}}/>
      <List>
        {values.map((value, index) => (
          <ListItem key={index}>
            <span style={{ fontWeight: 600 }}>- </span>
            <ListItemText primary={value} sx={{ my: 0, ml: 0.8 }} />
            <IconButton
              size="small"
              edge="end"
              onClick={handleEditValueClick(index)}
            >
              <EditIcon sx={{ height: 15, width: 15 }} />
            </IconButton>
            <IconButton
              edge="end"
              size="small"
              onClick={() => onDelete(title, index)}
            >
              <DeleteIcon sx={{ height: 15, width: 15 }} />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {/* Edit Title Popover */}
      <Popover
        open={Boolean(editTitleAnchor)}
        anchorEl={editTitleAnchor}
        onClose={handleEditTitleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          <TextField
            label="Edit Title"
            variant="outlined"
            value={localEditedTitle}
            size="small"
            onChange={(e) => setLocalEditedTitle(e.target.value)} // Update local edited title
          />
          <Button
            variant="contained"
            color="info"
            sx={{ml:1}}
            onClick={handleSaveEditedTitle} // Use new handler for 
          >
            Save
          </Button>
        </Box>
      </Popover>

      {/* Edit Value Popover */}
      <Popover
        open={Boolean(editValueAnchor)}
        anchorEl={editValueAnchor}
        onClose={handleEditValueClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box p={2}>
          <TextField
            label="Edit Value"
            variant="outlined"
            defaultValue={editedValue}
            size="small"
            onChange={(e) => setEditedValue(e.target.value)}
            multiline
          />
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              onEditValue(title, editValueIndex, editedValue);
              handleEditValueClose();
            }}
            sx={{ ml: 1 }}
          >
            Save
          </Button>
        </Box>
      </Popover>
    </Paper>
  );
};

const SelectionProcess = ({processData,setProcessData}) => {
  const [type, setType] = useState("title");
  const [input, setInput] = useState("");
  // const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleAdd = () => {
    if (type === "title" && input) {
      setProcessData((prevData) => ({
        ...prevData,
        [input]: [],
      }));
      setInput("");
      setCurrentTitle(input);
    } else if (type === "value" && currentTitle && value) {
      setProcessData((prevData) => ({
        ...prevData,
        [currentTitle]: [...(prevData[currentTitle] || []), value],
      }));
      setValue("");
    }
  };

  const handleEditTitle = (oldTitle, newTitle) => {
    setProcessData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[newTitle] = prevData[oldTitle];
      delete updatedData[oldTitle];
      return updatedData;
    });
  };

  const handleEditValue = (title, index, newValue) => {
    setProcessData((prevData) => {
      const updatedValues = [...prevData[title]];
      updatedValues[index] = newValue;
      return {
        ...prevData,
        [title]: updatedValues,
      };
    });
  };

  const handleDelete = (title, index) => {
    if (index === undefined) {
      const { [title]: omit, ...rest } = processData;
      setProcessData(rest);
    } else {
      setProcessData((prevData) => {
        const updatedValues = [...prevData[title]];
        updatedValues.splice(index, 1);
        return {
          ...prevData,
          [title]: updatedValues,
        };
      });
    }
  };

  // const switchInputType = () => {
  //   setType(type === "title" ? "value" : "title");
  //   if (type === "value") setCurrentTitle("");
  // };

  return (
    <div>
      <Grid container spacing={1} sx={{ mb: 0.8 }}>
        <Grid item xs={12} sm={6}>
          <RadioGroup
            row
            aria-label="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <FormControlLabel value="title" control={<Radio />} label="Title" />
            <FormControlLabel
              value="value"
              control={<Radio />}
              label="Description"
            />
          </RadioGroup>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {currentTitle && (
            <Paper
              sx={{
                display: "flex",
                width: "100%",
                py: 0.3,
                px: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.blueAccent[300],
                }}
              >
                Title :
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.greenAccent[300],
                  mx: 0.2,
                  maxWidth: "45ch", // Adjust this value as needed
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentTitle}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mb: 1 }}>
        {type === "title" ? (
          <Grid item xs={12} sm={10} md={11}>
            <TextField
              label="Title"
              variant="outlined"
              placeholder="Selection Process Title..."
              value={input}
              fullWidth
              size="small"
              onChange={(e) => setInput(e.target.value)}
            />
          </Grid>
        ) : (
          <>
            {type === "value" && (
              <Grid item xs={12} sm={10} md={11}>
                <TextField
                  label="Description"
                  variant="outlined"
                  size="small"
                  placeholder="Selection Process Description..."
                  multiline
                  fullWidth
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Grid>
            )}
          </>
        )}

        <Grid item xs={12} sm={2} md={1}>
          <Button
            variant="contained"
            color="info"
            sx={{ width: "100%" }}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 1 }} />
      {Object.keys(processData).map((key) => (
        <CustomExpansionPanel
          key={key}
          title={key}
          values={processData[key]}
          onDelete={handleDelete}
          onEditTitle={handleEditTitle}
          onEditValue={handleEditValue}
          bgColor={colors.blueAccent[900]}
        />
      ))}
    </div>
  );
};

export default SelectionProcess;
