import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";
import React from "react";

const skillTypes = [
  { value: "text", label: "Text" },
  { value: "varchar", label: "Varchar" },
  { value: "number", label: "Number" },
];

const AddSkillPopup = ({ open, handleClose, handleAddSkill }) => {
  const [skill, setSkill] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleSubmit = () => {
    handleAddSkill({ skill, type, description });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Skill</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the skill details below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Skill"
          fullWidth
          variant="standard"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Type"
          fullWidth
          variant="standard"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {skillTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSkillPopup;
