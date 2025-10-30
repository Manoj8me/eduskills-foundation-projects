
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { tokens } from "../../../theme";
import DeleteIcon from "@mui/icons-material/Delete";

const SkillsRequired = ({skillsList,setSkillsList}) => {
  const [skill, setSkill] = useState("");
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const addSkill = () => {
    if (skill.trim() !== "") {
      setSkillsList([...skillsList, skill]);
      setSkill("");
    }
  };

  const handleDeleteSkill = (index) => {
    const updatedSkillsList = [...skillsList];
    updatedSkillsList.splice(index, 1);
    setSkillsList(updatedSkillsList);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the form from submitting
      addSkill();
    }
  };

  return (
    <form>
      <Box>
        <Grid container spacing={1} sx={{ mt: -2 }}>
          <Grid item xs={12} sm={9} md={10}>
            <TextField
              label="Add Skill"
              variant="outlined"
              value={skill}
              color="info"
              onChange={(e) => setSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              margin="normal"
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Button
              type="button"
              variant="contained"
              onClick={addSkill}
              fullWidth
              color="info"
              sx={{ mt: isSmallScreen ? 0 : 1.9, py: 1, mb: 1.8 }}
            >
              Add Skill
            </Button>
          </Grid>
        </Grid>
        {skillsList.length > 0 && (
          <Box>
            <Paper elevation={0} sx={{ pb: 1, mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  py: 0.5,
                  mb: 0.5,
                  pl: 2,
                  fontWeight: "bold",
                  color: colors.blueAccent[300],
                  bgcolor: colors.blueAccent[900],
                  borderRadius: " 3px 3px 0px 0px",
                }}
              >
                Skills List
              </Typography>
              <List>
                {skillsList.map((s, index) => (
                  <ListItem
                    key={index}
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      // justifyContent: "space-between",
                      maxWidth: "100%",
                      marginTop: 0.5,
                      marginBottom: 0.5,
                      paddingTop:3,
                      paddingBottom:3
                    }}
                  >
                    <span style={{fontWeight:600, marginRight:1, minWidth:20}}>{index+1} .</span>
                    <ListItemText primary={s} />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSkill(index)}
                      >
                        <DeleteIcon sx={{ height: 15, width: 15 }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </form>
  );
};

export default SkillsRequired;
