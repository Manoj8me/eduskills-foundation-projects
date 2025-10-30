import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  Typography,
  IconButton,
  Popover,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// Sample data for autocomplete fields
const cohorts = [
  "Software Engineering",
  "Data Science",
  "Cyber Security",
  "Networking",
  "AI & ML",
];
const years = ["2020", "2021", "2022", "2023", "2024", "2025"];
const branches = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
];
const domains = [
  "All Domain",
  "Engineering",
  "Business",
  "Arts",
  "Science",
  "Medicine",
];
const statuses = ["Applied", "Approved", "Rejected", "Pending"];

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
  overflow: "hidden",
}));

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

const PopoverFormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  width: "280px",
}));

const SearchButton = styled(Button)(({ theme }) => ({
  height: "40px",
  minWidth: "40px",
  background: "linear-gradient(45deg, #0088cc 30%, #00a6ed 90%)",
  boxShadow: "0 4px 10px rgba(0, 136, 204, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 14px rgba(0, 136, 204, 0.4)",
  },
}));

const SearchForm = ({ onSearch }) => {
  const [domain, setDomain] = useState("All Domain");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Applied");
  const [cohort, setCohort] = useState(null);
  const [year, setYear] = useState(null);
  const [branch, setBranch] = useState(null);

  // Popover state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = () => {
    onSearch({
      domain,
      email,
      status,
      cohort,
      year,
      branch,
    });
    handleClose();
  };

  const compactFieldProps = {
    size: "small",
    sx: {
      width: "100%",
      "& .MuiInputBase-root": {
        height: "40px",
      },
    },
  };

  // Active filters count for badge
  const getActiveFiltersCount = () => {
    let count = 0;
    if (domain !== "All Domain") count++;
    if (status !== "Applied") count++;
    if (cohort) count++;
    if (year) count++;
    if (branch) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 2,
            fontWeight: 600,
            fontSize: "1.1rem",
            background: "linear-gradient(45deg, #0088cc, #00a6ed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Student Database Search
        </Typography>

        <MainContainer>
          <TextField
            label="Enter Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
            sx={{ "& .MuiInputBase-root": { height: "40px" } }}
          />

          <IconButton
            onClick={handleFilterClick}
            sx={{
              backgroundColor: "rgba(0, 136, 204, 0.1)",
              height: "40px",
              width: "40px",
              position: "relative",
            }}
          >
            <FilterListIcon color="primary" />
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "#f44336",
                  color: "white",
                  borderRadius: "50%",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </IconButton>

          <SearchButton
            variant="contained"
            size="small"
            onClick={handleSearch}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SearchIcon />
          </SearchButton>

          {/* Popover for filters */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <PopoverFormContainer>
              <Typography variant="subtitle2" fontWeight={600} color="primary">
                Filter Options
              </Typography>

              {/* Domain Select */}
              <FormControl {...compactFieldProps}>
                <InputLabel id="domain-label">Domain</InputLabel>
                <Select
                  labelId="domain-label"
                  value={domain}
                  label="Domain"
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {domains.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Status Select */}
              <FormControl {...compactFieldProps}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Cohort Autocomplete */}
              <Autocomplete
                value={cohort}
                onChange={(event, newValue) => {
                  setCohort(newValue);
                }}
                options={cohorts}
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Cohort" />
                )}
              />

              {/* Year Autocomplete */}
              <Autocomplete
                value={year}
                onChange={(event, newValue) => {
                  setYear(newValue);
                }}
                options={years}
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Passout Year" />
                )}
              />

              {/* Branch Autocomplete */}
              <Autocomplete
                value={branch}
                onChange={(event, newValue) => {
                  setBranch(newValue);
                }}
                options={branches}
                size="small"
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    height: "40px",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Branch" />
                )}
              />

              <SearchButton
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                fullWidth
              >
                APPLY FILTERS
              </SearchButton>
            </PopoverFormContainer>
          </Popover>
        </MainContainer>
      </StyledPaper>
    </motion.div>
  );
};

export default SearchForm;
