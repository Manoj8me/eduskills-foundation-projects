import React from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../theme";
import JobDetails from "./JobDetails";
import SkillsRequired from "./SkillsRequired";
import SelectionProcess from "./SelectionProcess";
import EditJobDetails from "./EditJobDetails";
import Responsibilities from "./Responsibilities";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TalentConnectService } from "../../../services/dataService";
import { useTheme } from "@emotion/react";

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
          color="info"
          variant="standard"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Type"
          fullWidth
          color="info"
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
          color="info"
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color="warning" onClick={handleClose}>
          Cancel
        </Button>
        <Button color="info" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditSkillPopup = ({
  open,
  handleClose,
  handleEditSkill,
  skillData,
  index,
}) => {
  const [skill, setSkill] = React.useState(skillData.skill);
  const [type, setType] = React.useState(skillData.type);
  const [description, setDescription] = React.useState(skillData.description);

  const handleSubmit = () => {
    handleEditSkill({ skill, type, description }, index);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Skill</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please edit the skill details below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Skill"
          fullWidth
          color="info"
          variant="standard"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Type"
          fullWidth
          color="info"
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
          color="info"
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const SkillsTable = ({
  skillsList,
  handleDeleteSkill,
  handleEditSkillOpen,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentSkillIndex, setCurrentSkillIndex] = React.useState(null);

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setCurrentSkillIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentSkillIndex(null);
  };

  const handleEditClick = () => {
    handleEditSkillOpen(skillsList[currentSkillIndex], currentSkillIndex);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    handleDeleteSkill(currentSkillIndex);
    handleMenuClose();
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#01579B" }}>
          <TableRow>
            <TableCell sx={{ color: "white" }}>Skill</TableCell>
            <TableCell sx={{ color: "white" }}>Type</TableCell>
            <TableCell sx={{ color: "white" }}>Description</TableCell>
            <TableCell sx={{ color: "white" }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skillsList.map((skill, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: 14 }}>{skill.skill}</TableCell>
              <TableCell sx={{ fontSize: 14 }}>{skill.type}</TableCell>
              <TableCell sx={{ fontSize: 14 }}>{skill.description}</TableCell>
              <TableCell>
                <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl && currentSkillIndex === index)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default function CreateJobDescription({ setRefresh, back }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isUpdate = localStorage.getItem("IS_UPDATE");
  const detailsData = JSON.parse(localStorage.getItem("JOB_DETAILS"));
  const skillsListStore = JSON.parse(localStorage.getItem("SKILLS_LIST"));
  const processDataStore = JSON.parse(localStorage.getItem("PROCESS_DATA"));
  const responsibilitiesDataStore = JSON.parse(
    localStorage.getItem("RESPONSIBILITIES")
  );
  const isEdit = localStorage.getItem("IS_EDIT");
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [isDetailsFilled, setIsDetailsFilled] = React.useState(false);
  const [jobDetails, setJobDetails] = React.useState({});
  const [skillsList, setSkillsList] = React.useState(skillsListStore || []);
  const [ResponsibilitiesList, setResponsibilitiesList] = React.useState(
    responsibilitiesDataStore || []
  );
  const [processData, setProcessData] = React.useState(processDataStore || {});
  const [isLoading, setIsLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [currentSkill, setCurrentSkill] = React.useState({});
  const [currentSkillIndex, setCurrentSkillIndex] = React.useState(null);
  const isDataNotEmpty = Object.keys(processData).length > 0;

  const data = {
    ...detailsData,
    gender: JSON.stringify(detailsData?.gender),
    skill_required: JSON.stringify(skillsList),
    selection_process: JSON.stringify(processData),
    year_of_passing: JSON.stringify(detailsData?.year_of_passing),
    responsibility: JSON.stringify(ResponsibilitiesList),
  };

  const createJD = async () => {
    setIsLoading(true);
    const jdId = data.jd_id;
    delete data.company_name;
    delete data.jd_id;
    try {
      const response = await (isEdit
        ? TalentConnectService.update_jd(jdId, data)
        : TalentConnectService.create_jd(data));
      setIsLoading(false);
      setMsg("JD created successfully!");
      localStorage.removeItem("JOB_DETAILS");
      localStorage.removeItem("SKILLS_LIST");
      localStorage.removeItem("PROCESS_DATA");
      localStorage.removeItem("RESPONSIBILITIES");
      localStorage.removeItem("IS_UPDATE");
      back();
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error creating JD:", error);
      setMsg("Error creating JD. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (isDetailsFilled) {
      const data = JSON.stringify(jobDetails);
      localStorage.setItem("JOB_DETAILS", data);
    }
    if (skillsList.length !== 0) {
      const data = JSON.stringify(skillsList);
      localStorage.setItem("SKILLS_LIST", data);
    }
    if (isDataNotEmpty) {
      const data = JSON.stringify(processData);
      localStorage.setItem("PROCESS_DATA", data);
    }
    if (ResponsibilitiesList.length !== 0) {
      const data = JSON.stringify(ResponsibilitiesList);
      localStorage.setItem("RESPONSIBILITIES", data);
    }

    createJD();
  };

  const handleAddSkill = (newSkill) => {
    setSkillsList((prevSkills) => {
      const updatedSkills = [...prevSkills, newSkill];
      localStorage.setItem("SKILLS_LIST", JSON.stringify(updatedSkills));
      return updatedSkills;
    });
  };

  const handleEditSkillOpen = (skill, index) => {
    setCurrentSkill(skill);
    setCurrentSkillIndex(index);
    setEditOpen(true);
  };

  const handleEditSkill = (updatedSkill, index) => {
    setSkillsList((prevSkills) => {
      const updatedSkills = prevSkills.map((skill, i) =>
        i === index ? updatedSkill : skill
      );
      localStorage.setItem("SKILLS_LIST", JSON.stringify(updatedSkills));
      return updatedSkills;
    });
  };

  const handleDeleteSkill = (index) => {
    setSkillsList((prevSkills) => {
      const updatedSkills = prevSkills.filter((_, i) => i !== index);
      localStorage.setItem("SKILLS_LIST", JSON.stringify(updatedSkills));
      return updatedSkills;
    });
  };

  React.useEffect(() => {
    setMsg("");
  }, []);

  return (
    <Paper
      sx={{ width: "100%", py: 1, px: 2, bgcolor: colors.blueAccent[800] }}
    >
      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          bgcolor: colors.background[100],
          px: 2,
          pb: 1,
          pt: 2,
          minHeight: 390,
        }}
      >
        {isUpdate ? (
          <EditJobDetails
            setJobDetails={setJobDetails}
            setIsDetailsFilled={setIsDetailsFilled}
          />
        ) : (
          <JobDetails
            setJobDetails={setJobDetails}
            setIsDetailsFilled={setIsDetailsFilled}
          />
        )}
        {/* <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="info"
          onClick={() => setOpen(true)}
        >
          Add Row
        </Button> */}
      </Paper>

      {skillsList.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            mt: 1.5,
            bgcolor: colors.background[100],
            px: 2,
            py: 1,
            minHeight: 390,
          }}
        >
          <SkillsTable
            skillsList={skillsList}
            handleDeleteSkill={handleDeleteSkill}
            handleEditSkillOpen={handleEditSkillOpen}
          />
        </Paper>
      )}

      <AddSkillPopup
        open={open}
        handleClose={() => setOpen(false)}
        handleAddSkill={handleAddSkill}
      />

      <EditSkillPopup
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        handleEditSkill={handleEditSkill}
        skillData={currentSkill}
        index={currentSkillIndex}
      />

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          bgcolor: colors.background[100],
          px: 2,
          py: 1,
          minHeight: 390,
        }}
      >
        <SelectionProcess
          processData={processData}
          setProcessData={setProcessData}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 1.5,
          bgcolor: colors.background[100],
          px: 2,
          py: 1,
          minHeight: 390,
        }}
      >
        <Responsibilities
          responsibilities={ResponsibilitiesList}
          setResponsibilities={setResponsibilitiesList}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          minHeight: 150,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 1,
        }}
      >
        {isLoading ? (
          <CircularProgress color="info" />
        ) : (
          <Typography>{msg ? msg : "Are you sure?"}</Typography>
        )}
      </Paper>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flex: "1 1 auto" }} />
        {!isEdit && (
          <Button variant="outlined" color="warning" onClick={handleSave}>
            Reset
          </Button>
        )}
        <Button
          sx={{ ml: 1 }}
          disabled={msg !== "" || isLoading}
          variant="outlined"
          color="info"
          onClick={createJD}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
