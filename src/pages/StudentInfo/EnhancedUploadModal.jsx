// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton,
//   Typography,
//   Box,
//   Paper,
//   CircularProgress,
//   Divider,
//   Autocomplete,
//   TextField,
//   styled,
//   ToggleButtonGroup,
//   ToggleButton,
//   Alert,
//   Tooltip,
//   List,
// } from "@mui/material";
// import {
//   Close as CloseIcon,
//   FileDownload as FileDownloadIcon,
//   DeleteOutline as DeleteOutlineIcon,
//   CloudUpload as CloudUploadIcon,
//   ErrorOutline as ErrorIcon,
//   Description as DescriptionIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import { InfoIcon } from "lucide-react";
// import axios from "axios";
// import { BASE_URL } from "../../services/configUrls";
// import { toast } from "react-toastify";

// // Styled components
// const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
//   display: "flex",
//   width: "100%",
//   marginBottom: theme.spacing(2),
//   "& .MuiToggleButton-root": {
//     flex: 1,
//     padding: "6px 12px",
//     textTransform: "none",
//     fontSize: "0.875rem",
//     borderColor: theme.palette.mode === "dark" ? "#2d3748" : "#e2e8f0",
//     "&.Mui-selected": {
//       backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#e8f0fe",
//       color: "#2563eb",
//       "&:hover": {
//         backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#e8f0fe",
//       },
//     },
//   },
// }));

// const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   "& .MuiOutlinedInput-root": {
//     fontSize: "0.875rem",
//     "& fieldset": {
//       borderColor: theme.palette.mode === "dark" ? "#2d3748" : "#e2e8f0",
//     },
//   },
// }));

// // Generate years array for the dropdown (current year + 4 years)
// const years = Array.from({ length: 5 }, (_, i) => ({
//   label: (new Date().getFullYear() + i).toString(),
//   value: new Date().getFullYear() + i,
// }));

// const EnhancedUploadModal = ({
//   open,
//   onClose,
//   selectedFile,
//   onFileSelect,
//   onFileDelete,
//   handleUploadSubmit,
//   handleDownloadDemo,
//   isUploading,
//   uploadError,
//   selectedFilterType,
//   setSelectedFilterType,
//   selectedBranch,
//   setSelectedBranch,
//   selectedYear,
//   setSelectedYear,
// }) => {
//   const fileInputRef = React.useRef(null);
//   const [branchOptions, setBranchOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showManualEntry, setShowManualEntry] = useState(false);
//   const [manualBranchName, setManualBranchName] = useState("");
//   const [manualProgramName, setManualProgramName] = useState("");
//   const [manualEntryError, setManualEntryError] = useState({
//     branch: "",
//     program: "",
//   });

//   // Fetch branches on component mount or when modal opens
//   useEffect(() => {
//     const fetchBranches = async () => {
//       if (!open) return;

//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(`${BASE_URL}/documents/fetchBranch`);
//         const formattedBranches = response.data.branchResponse.map(
//           (branch) => ({
//             id: branch.id,
//             label: `${branch.program_name} - ${branch.branch_name}`,
//             program_name: branch.program_name,
//             branch_name: branch.branch_name,
//           })
//         );
//         setBranchOptions(formattedBranches);
//       } catch (err) {
//         setError("Failed to fetch branches. Please try again later.");
//         console.error("Error fetching branches:", err);
//         toast.error("Failed to load branches. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBranches();
//   }, [open]);

//   // Handle filter type change
//   const handleFilterChange = (event, newFilter) => {
//     setSelectedFilterType(newFilter);
//     setSelectedBranch(null);
//     setSelectedYear(null);
//     setShowManualEntry(false);
//   };

//   // Handle manual branch submission
//   const handleManualBranchSubmit = async () => {
//     setManualEntryError({ branch: "", program: "" });
//     let hasError = false;

//     if (!manualBranchName.trim()) {
//       setManualEntryError((prev) => ({
//         ...prev,
//         branch: "Branch name is required",
//       }));
//       hasError = true;
//     }
//     if (!manualProgramName.trim()) {
//       setManualEntryError((prev) => ({
//         ...prev,
//         program: "Program name is required",
//       }));
//       hasError = true;
//     }

//     if (hasError) return;

//     try {
//       const response = await axios.post(`${BASE_URL}/documents/addBranch`, {
//         branch_name: manualBranchName.trim(),
//         program_name: manualProgramName.trim(),
//       });

//       if (response.data.success) {
//         const newBranch = {
//           id: response.data.id,
//           label: `${manualProgramName} - ${manualBranchName}`,
//           program_name: manualProgramName,
//           branch_name: manualBranchName,
//         };
//         setBranchOptions((prev) => [...prev, newBranch]);
//         setSelectedBranch(newBranch);
//         setShowManualEntry(false);
//         setManualBranchName("");
//         setManualProgramName("");
//         toast.success("Branch added successfully!");
//       }
//     } catch (error) {
//       console.error("Error adding branch:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to add branch. Please try again.";
//       toast.error(errorMessage);
//       setManualEntryError((prev) => ({
//         ...prev,
//         branch: errorMessage,
//       }));
//     }
//   };

//   // Handle custom template download
//   const handleCustomDownload = () => {
//     try {
//       let headers = ["name", "mail_id", "mobile", "gender"];

//       if (selectedFilterType === "branch") {
//         headers.push("year");
//       } else if (selectedFilterType === "year") {
//         headers.push("branch");
//       } else {
//         headers = ["name", "mail_id", "branch", "mobile", "gender", "year"];
//       }

//       const csvContent = [headers.join(",")].join("\n");
//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;

//       const filename =
//         selectedFilterType === "branch"
//           ? `intake_data_${selectedBranch?.branch_name
//               ?.toLowerCase()
//               .replace(/\s+/g, "_")}.csv`
//           : selectedFilterType === "year"
//           ? `intake_data_${selectedYear?.value}.csv`
//           : "intake_data_template.csv";

//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);

//       toast.success("Template downloaded successfully!");
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Failed to download template. Please try again.");
//     }
//   };

//   // Filter options for Autocomplete
//   const filterOptions = (options, { inputValue }) => {
//     const searchValue = inputValue.toLowerCase();
//     return options.filter(
//       (option) =>
//         option.label.toLowerCase().includes(searchValue) ||
//         option.program_name.toLowerCase().includes(searchValue) ||
//         option.branch_name.toLowerCase().includes(searchValue)
//     );
//   };

//   // Reset form state on close
//   const handleClose = () => {
//     setSelectedFilterType(null);
//     setSelectedBranch(null);
//     setSelectedYear(null);
//     setShowManualEntry(false);
//     setManualBranchName("");
//     setManualProgramName("");
//     setManualEntryError({ branch: "", program: "" });
//     onClose();
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       maxWidth="sm"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: "8px",
//           overflow: "hidden",
//           border: (theme) =>
//             `1px solid ${
//               theme.palette.mode === "dark" ? "#2d3748" : "#e2e8f0"
//             }`,
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           bgcolor: "#2563eb",
//           color: "#ffffff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           py: 1.5,
//           px: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <CloudUploadIcon sx={{ fontSize: 20 }} />
//           <Typography
//             variant="subtitle1"
//             sx={{ fontSize: "0.95rem", fontWeight: 500 }}
//           >
//             Upload Intake Data
//           </Typography>
//         </Box>
//         <IconButton
//           onClick={handleClose}
//           sx={{
//             color: "#ffffff",
//             p: 0.5,
//             "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
//           }}
//         >
//           <CloseIcon sx={{ fontSize: 20 }} />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent
//         sx={{ p: 2.5, "&::-webkit-scrollbar": { display: "none" } }}
//       >
//         <Alert
//           severity="info"
//           sx={{
//             mb: 2,
//             mt: 1.5,
//             "& .MuiAlert-message": { fontSize: "0.875rem" },
//           }}
//         >
//           Choose how you want to organize your data upload:
//           <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
//             <List>Universal Template: Includes all fields</List>
//             <List>Branch Wise: Pre-fills branch field</List>
//             <List>Year Wise: Pre-fills year field</List>
//           </ul>
//         </Alert>

//         <Box sx={{ mb: 2.5 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
//             <Typography
//               variant="subtitle2"
//               sx={{ fontWeight: 500, color: "#475569" }}
//             >
//               1. Download Template Options
//             </Typography>
//             <Tooltip
//               title="Choose 'Branch Wise' to get a template for a specific branch, 'Year Wise' for a specific year, or use the universal template for all fields"
//               arrow
//             >
//               <InfoIcon
//                 sx={{ fontSize: 18, color: "#64748b", cursor: "help" }}
//               />
//             </Tooltip>
//           </Box>

//           <StyledToggleButtonGroup
//             value={selectedFilterType}
//             exclusive
//             onChange={handleFilterChange}
//             size="small"
//           >
//             <ToggleButton value="branch">Branch Wise</ToggleButton>
//             <ToggleButton value="year">Year Wise</ToggleButton>
//           </StyledToggleButtonGroup>

//           {selectedFilterType === "branch" && (
//             <>
//               <Box sx={{ mb: 2 }}>
//                 <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
//                   <StyledAutocomplete
//                     value={selectedBranch}
//                     onChange={(_, newValue) => setSelectedBranch(newValue)}
//                     options={branchOptions}
//                     loading={loading}
//                     filterOptions={filterOptions}
//                     getOptionLabel={(option) => option.label}
//                     renderOption={(props, option) => (
//                       <li {...props}>
//                         <Box>
//                           <Typography variant="body2">
//                             {option.label}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             Program: {option.program_name} | Branch:{" "}
//                             {option.branch_name}
//                           </Typography>
//                         </Box>
//                       </li>
//                     )}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         placeholder="Search by program or branch name"
//                         size="small"
//                         error={!!error}
//                         helperText={error}
//                         InputProps={{
//                           ...params.InputProps,
//                           endAdornment: (
//                             <>
//                               {loading ? <CircularProgress size={20} /> : null}
//                               {params.InputProps.endAdornment}
//                             </>
//                           ),
//                         }}
//                       />
//                     )}
//                     sx={{ flex: 1 }}
//                   />
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     onClick={() => setShowManualEntry(true)}
//                     startIcon={<AddIcon />}
//                     sx={{
//                       height: "40px",
//                       whiteSpace: "nowrap",
//                       borderColor: "#2563eb",
//                       color: "#2563eb",
//                       "&:hover": {
//                         borderColor: "#1d4ed8",
//                         bgcolor: "rgba(37, 99, 235, 0.04)",
//                       },
//                     }}
//                   >
//                     Add New
//                   </Button>
//                 </Box>

//                 {showManualEntry && (
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 2,
//                       mt: 2,
//                       border: "1px solid",
//                       borderColor: "divider",
//                       borderRadius: 1,
//                     }}
//                   >
//                     <Typography
//                       variant="subtitle2"
//                       sx={{ mb: 2, color: "#475569" }}
//                     >
//                       Add New Branch
//                     </Typography>
//                     <Box
//                       sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//                     >
//                       <TextField
//                         fullWidth
//                         size="small"
//                         label="Program Name"
//                         value={manualProgramName}
//                         onChange={(e) => setManualProgramName(e.target.value)}
//                         error={!!manualEntryError.program}
//                         helperText={manualEntryError.program}
//                         placeholder="Enter program name"
//                       />
//                       <TextField
//                         fullWidth
//                         size="small"
//                         label="Branch Name"
//                         value={manualBranchName}
//                         onChange={(e) => setManualBranchName(e.target.value)}
//                         error={!!manualEntryError.branch}
//                         helperText={manualEntryError.branch}
//                         placeholder="Enter branch name"
//                       />
//                       <Box
//                         sx={{
//                           display: "flex",
//                           gap: 1,
//                           justifyContent: "flex-end",
//                         }}
//                       >
//                         <Button
//                           size="small"
//                           onClick={() => {
//                             setShowManualEntry(false);
//                             setManualBranchName("");
//                             setManualProgramName("");
//                             setManualEntryError({ branch: "", program: "" });
//                           }}
//                           sx={{
//                             color: "#64748b",
//                             "&:hover": { bgcolor: "rgba(100, 116, 139, 0.04)" },
//                           }}
//                         >
//                           Cancel
//                         </Button>
//                         <Button
//                           variant="contained"
//                           size="small"
//                           onClick={handleManualBranchSubmit}
//                           sx={{
//                             bgcolor: "#2563eb",
//                             "&:hover": { bgcolor: "#1d4ed8" },
//                           }}
//                         >
//                           Add Branch
//                         </Button>
//                       </Box>
//                     </Box>
//                   </Paper>
//                 )}
//               </Box>
//               <Typography
//                 variant="caption"
//                 sx={{ display: "block", color: "#64748b", mt: 0.5, mb: 1.5 }}
//               >
//                 Template will include: name, mail_id, mobile, gender, year
//                 (branch will be pre-filled)
//               </Typography>
//             </>
//           )}

//           {selectedFilterType === "year" && (
//             <>
//               <StyledAutocomplete
//                 value={selectedYear}
//                 onChange={(_, newValue) => setSelectedYear(newValue)}
//                 options={years}
//                 getOptionLabel={(option) => option.label}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Select Year"
//                     size="small"
//                   />
//                 )}
//                 size="small"
//               />
//               <Typography
//                 variant="caption"
//                 sx={{ display: "block", color: "#64748b", mt: 0.5, mb: 1.5 }}
//               >
//                 Template will include: name, mail_id, mobile, gender, branch
//                 (year will be pre-filled)
//               </Typography>
//             </>
//           )}

//           {!selectedFilterType && (
//             <Typography
//               variant="caption"
//               sx={{ display: "block", color: "#64748b", mt: 0.5, mb: 1.5 }}
//             >
//               Universal template includes: name, mail_id, branch, mobile,
//               gender, year
//             </Typography>
//           )}

//           <Button
//             variant="outlined"
//             startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
//             onClick={
//               selectedFilterType ? handleCustomDownload : handleDownloadDemo
//             }
//             disabled={
//               (selectedFilterType === "branch" && !selectedBranch) ||
//               (selectedFilterType === "year" && !selectedYear)
//             }
//             sx={{
//               textTransform: "none",
//               borderRadius: 1,
//               fontSize: "0.875rem",
//               py: 0.75,
//               borderColor: "#2563eb",
//               color: "#2563eb",
//               "&:hover": {
//                 borderColor: "#1d4ed8",
//                 bgcolor: "rgba(37, 99, 235, 0.04)",
//               },
//               "&.Mui-disabled": {
//                 opacity: 0.6,
//                 borderColor: "#94a3b8",
//                 color: "#94a3b8",
//               },
//             }}
//           >
//             Download CSV Template
//           </Button>
//         </Box>

//         <Divider sx={{ my: 2 }} />

//         <Box>
//           <Typography
//             variant="subtitle2"
//             sx={{ mb: 1.5, fontWeight: 500, color: "#475569" }}
//           >
//             2. Upload Your Data
//           </Typography>

//           <Paper
//             variant="outlined"
//             sx={{
//               border: "2px dashed",
//               borderColor: selectedFile ? "#2563eb" : "#e2e8f0",
//               borderRadius: 1,
//               p: 2.5,
//               textAlign: "center",
//               bgcolor: selectedFile ? "rgba(37, 99, 235, 0.04)" : "transparent",
//               transition: "all 0.2s",
//               "&:hover": { borderColor: "#2563eb" },
//             }}
//           >
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={onFileSelect}
//               accept=".csv"
//               hidden
//             />

//             {!selectedFile ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: 1.5,
//                 }}
//               >
//                 <DescriptionIcon sx={{ fontSize: 32, color: "#2563eb" }} />
//                 <div>
//                   <Typography variant="body2" sx={{ mb: 1, color: "#64748b" }}>
//                     Drag and drop your CSV file here or
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     onClick={() => fileInputRef.current?.click()}
//                     sx={{
//                       textTransform: "none",
//                       borderRadius: 1,
//                       fontSize: "0.875rem",
//                       bgcolor: "#2563eb",
//                       "&:hover": { bgcolor: "#1d4ed8" },
//                     }}
//                   >
//                     Browse Files
//                   </Button>
//                 </div>
//                 <Typography variant="caption" sx={{ color: "#64748b" }}>
//                   Supported format: CSV
//                 </Typography>
//               </Box>
//             ) : (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   p: 1.5,
//                   bgcolor: "#ffffff",
//                   borderRadius: 1,
//                   border: "1px solid",
//                   borderColor: "#e2e8f0",
//                 }}
//               >
//                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                   <DescriptionIcon sx={{ fontSize: 24, color: "#2563eb" }} />
//                   <div>
//                     <Typography variant="subtitle2">
//                       {selectedFile.name}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: "#64748b" }}>
//                       {(selectedFile.size / 1024).toFixed(2)} KB
//                     </Typography>
//                   </div>
//                 </Box>
//                 <IconButton
//                   onClick={onFileDelete}
//                   sx={{
//                     color: "#64748b",
//                     "&:hover": {
//                       color: "#ef4444",
//                       bgcolor: "rgba(239, 68, 68, 0.04)",
//                     },
//                   }}
//                 >
//                   <DeleteOutlineIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             )}
//           </Paper>

//           {uploadError && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 mt: 1.5,
//                 p: 1.5,
//                 bgcolor: "rgba(239, 68, 68, 0.04)",
//                 borderRadius: 1,
//                 border: "1px solid",
//                 borderColor: "#ef4444",
//               }}
//             >
//               <ErrorIcon fontSize="small" sx={{ color: "#ef4444" }} />
//               <Typography variant="caption" sx={{ color: "#ef4444" }}>
//                 {uploadError}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </DialogContent>

//       <DialogActions
//         sx={{
//           p: 2,
//           gap: 1,
//           borderTop: "1px solid",
//           borderColor: (theme) =>
//             theme.palette.mode === "dark" ? "#2d3748" : "#e2e8f0",
//         }}
//       >
//         <Button
//           variant="outlined"
//           onClick={handleClose}
//           sx={{
//             textTransform: "none",
//             borderRadius: 1,
//             fontSize: "0.875rem",
//             borderColor: "#f97316",
//             color: "#f97316",
//             "&:hover": {
//               borderColor: "#ea580c",
//               bgcolor: "rgba(249, 115, 22, 0.04)",
//             },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           onClick={handleUploadSubmit}
//           disabled={!selectedFile || isUploading}
//           sx={{
//             textTransform: "none",
//             borderRadius: 1,
//             fontSize: "0.875rem",
//             bgcolor: "#2563eb",
//             "&:hover": { bgcolor: "#1d4ed8" },
//             "&.Mui-disabled": {
//               bgcolor: (theme) =>
//                 theme.palette.mode === "dark" ? "#374151" : "#e2e8f0",
//             },
//           }}
//         >
//           {isUploading ? (
//             <>
//               <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
//               Uploading...
//             </>
//           ) : (
//             "Upload Data"
//           )}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EnhancedUploadModal;

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Paper,
  Divider,
  Stack,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  Close as CloseIcon,
  FileDownload as FileDownloadIcon,
  DeleteOutline as DeleteOutlineIcon,
  InsertDriveFileOutlined as FileIcon,
  CloudUpload as CloudUploadIcon,
  ErrorOutline as ErrorIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const getTheme = (isDark) =>
  createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: isDark ? "#2196f3" : "#1976d2",
        dark: isDark ? "#1976d2" : "#1565c0",
      },
      background: {
        default: isDark ? "#1a2027" : "#ffffff",
        paper: isDark ? "#1a2027" : "#ffffff",
      },
      text: {
        primary: isDark ? "#e2e8f0" : "#2c3e50",
        secondary: isDark ? "#94a3b8" : "#64748b",
      },
      error: {
        main: isDark ? "#ef4444" : "#dc2626",
        light: isDark ? "#450a0a" : "#fee2e2",
      },
      divider: isDark ? "#2d3748" : "#e2e8f0",
    },
  });

const EnhancedUploadModal = ({
  open,
  onClose,
  selectedFile,
  onFileSelect,
  onFileDelete,
  handleUploadSubmit,
  handleDownloadDemo,
  isUploading,
  uploadError,
  isDarkMode = false,
}) => {
  const theme = getTheme(isDarkMode);
  const fileInputRef = React.useRef(null);

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            maxHeight: "85vh",
            margin: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: "12px 16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CloudUploadIcon />
            <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
              Upload Intake Data
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 5 }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1, mt: 2 }}
              >
                1. Download Template
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1.5 }}
              >
                Please use our CSV template to ensure your data is properly
                formatted.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownloadDemo}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Download CSV Template
              </Button>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                2. Upload Your Data
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  border: "2px dashed",
                  borderColor: selectedFile ? "primary.main" : "divider",
                  borderRadius: "12px",
                  p: 2.5,
                  textAlign: "center",
                  bgcolor: selectedFile ? "action.hover" : "background.paper",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelect}
                  accept=".csv"
                  hidden
                />

                {!selectedFile ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <DescriptionIcon
                      sx={{ fontSize: 36, color: "primary.main" }}
                    />
                    <div>
                      <Typography sx={{ mb: 1 }}>
                        Drag and drop your CSV file here or
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                        }}
                      >
                        Browse Files
                      </Button>
                    </div>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Supported format: CSV
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: "10px 12px",
                      bgcolor: "background.paper",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <FileIcon sx={{ fontSize: 24, color: "primary.main" }} />
                      <div>
                        <Typography variant="subtitle2">
                          {selectedFile.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </Typography>
                      </div>
                    </Box>
                    <IconButton
                      onClick={onFileDelete}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: "error.main",
                          bgcolor: "error.light",
                        },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>

              {uploadError && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1.5,
                    p: "8px 12px",
                    bgcolor: "error.light",
                    borderRadius: "6px",
                    border: "1px solid",
                    borderColor: "error.main",
                  }}
                >
                  <ErrorIcon fontSize="small" color="error" />
                  <Typography variant="body2" color="error">
                    {uploadError}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#f97316",
              color: "#f97316",
              "&:hover": {
                borderColor: "#ea580c",
                bgcolor: "rgba(249, 115, 22, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadSubmit}
            disabled={!selectedFile || isUploading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              "&.Mui-disabled": {
                bgcolor: isDarkMode ? "#374151" : "#e2e8f0",
                color: isDarkMode ? "#6b7280" : "#94a3b8",
              },
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1, color: "#fff" }} />
                Uploading...
              </>
            ) : (
              "Upload Data"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EnhancedUploadModal;
