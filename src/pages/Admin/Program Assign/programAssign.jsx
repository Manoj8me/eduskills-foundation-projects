// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import axios from "axios";

// import {
//   Container,
//   TextField,
//   MenuItem,
//   Button,
//   Box,
//   Typography ,
//   Grid,
//   CardContent,
//   Card
// } from "@mui/material";

// export default function CollegeList() {
//   const dispatch = useDispatch();
//   const token = localStorage.getItem("accessToken");
// //   const domainList = useSelector((state) => state.domainList.domainList);
//   const [domainList ,setDomainList]=useState([]);
//   const [courseList, setCourseList] = useState([]);
//   const [branchList, setBranchList] = useState([]);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     courseId: "",
//     branchId: "",
//     domainId: "",
//     is_status :'',
//     is_prefered_mandatory:''
//   });

//   useEffect(() => {
//     fetchDomain();
//     fetchCourses();
//     fetchBranches();
//   }, [dispatch]);

//   useEffect(() => {
//     if (formData.courseId) {
//       fetchBranches(formData.courseId);
//     }
//   }, [formData.courseId]);

//   const fetchCourses = async () => {
//     try {
//     //   const response = await axios.get("https://erpapi.eduskillsfoundation.org/institute/get_programs");
//     const response = await axios.get("https://erpapi.eduskillsfoundation.org/institute/get_programs", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Including the token in Authorization header
//         },
//       });
//       setCourseList(Array.isArray(response.data.data) ? response.data.data : []);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const fetchBranches = async (courseId) => {
//     if (!courseId) {
//         console.error("Error: courseId is undefined!");
//         return;
//       }

//   if (!token) {
//     console.error("Error: Token is missing!");
//     return;
//   }

//       console.log(`Fetching branches for Course ID: ${courseId}`); // Debugging
//       console.log("Using Token:",  localStorage.getItem("accessToken"));
//     try {
//       const response = await axios.post(`https://erpapi.eduskillsfoundation.org/institute/get-program-branches/${courseId}`, {
//         headers: {
//           "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       console.log("Branch Data:", response.data); // Debugging
//       setBranchList(response.data.branches ? response.data.branches : []);
//     } catch (error) {
//         console.error("Error fetching branches:", error);
//         setBranchList([]);
//     }
//   };

//   const fetchDomain = async () => {
//     try {
//     //   const response = await axios.get("https://erpapi.eduskillsfoundation.org/institute/get_programs");
//     const response = await axios.get("https://erpapi.eduskillsfoundation.org/institute/get_domain_data", {
//         headers: {
//           Authorization: `Bearer ${token}`, // Including the token in Authorization header
//         },
//       });
//       setDomainList(Array.isArray(response.data.data) ? response.data.data : []);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === "courseId") {
//       console.log("Selected Course ID:", value); // Debugging
//       fetchBranches(value); // Call fetchBranches immediately when courseId changes
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError({});
//     let errors = {};

//     if (!formData.courseId) errors.courseId = "Course is required";
//     if (!formData.branchId) errors.branchId = "Branch is required";
//     if (!formData.domainId) errors.domainId = "Domain is required";
//     if (formData.is_status === "") errors.is_status = "Status is required";
//     if (formData.is_prefered_mandatory === "") errors.is_prefered_mandatory = "Preferred field is required";

//     if (Object.keys(errors).length > 0) {
//       setError(errors);
//       return;
//     }

//     try {
//       const response = await axios.post("https://erpapi.eduskillsfoundation.org/institute/program_domain_add", {
//         program_id: formData.courseId,
//         branch_id: formData.branchId,
//         domain_id: formData.domainId,
//         is_status: formData.is_status,
//         is_prefered_mandatory: formData.is_prefered_mandatory
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("Form submitted successfully:", response.data.message);
//       alert(response.data.message);
//       setFormData({
//         courseId: "",
//         branchId: "",
//         domainId: "",
//         is_status: "",
//         is_prefered_mandatory: ""
//       });

//     } catch (error) {
//       if (error.response && error.response.data.detail) {
//         const errorMessage = Array.isArray(error.response.data.detail)
//           ? error.response.data.detail.map(err => err.msg).join("\n")
//           : error.response.data.detail;
//         setError({ form: errorMessage });
//         alert(errorMessage);
//       } else {
//         setError({ form: "Error submitting form. Please try again." });
//         alert("Error submitting form. Please try again.");
//       }
//       console.error("Error submitting form:", error);
//     }
//   };
//   return (

//     <Container>
//     <Card  sx={{ maxWidth: 600, margin: "auto", padding: 3, boxShadow: 3 ,marginTop:'5%',borderRadius:3}}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom sx={{color:'#0288d1',fontWeight: '500',fontSize:' 1rem'}}>
//           Add Program Assign Details
//         </Typography>
//         {error.form && <Typography color="error">{error.form}</Typography>}
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2} sx={{fontSize:'0.75rem',padding: '12.5px 14px'}}>
//             <Grid item xs={6} >
//               <TextField
//                 select
//                 fullWidth
//                 label="Select Course"
//                 name="courseId"
//                 value={formData.courseId}
//                 onChange={handleChange}
//                 error={!!error.courseId}
//                 helperText={error.courseId}
//                 sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1',fontWeight: '500',fontSize:'0.75rem',}}
//               >
//                 {courseList.map((course) => (
//                   <MenuItem key={course.program_id} value={course.program_id} sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>
//                     {course.program_name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 select
//                 fullWidth
//                 label="Select Branch"
//                 name="branchId"
//                 value={formData.branchId}
//                 onChange={handleChange}
//                 error={!!error.branchId}
//                 helperText={error.branchId}
//                 disabled={!formData.courseId}
//                 sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}
//               >
//                 {branchList.map((branch) => (
//                   <MenuItem key={branch.branch_id} value={branch.branch_id} sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>
//                     {branch.branch_name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               </Grid>
//               <Grid item xs={12}>
//               <TextField
//       select
//       label="Select Domain"
//       name="domainId"
//       fullWidth
//       value={formData.domainId}
//       onChange={handleChange}
//       error={!!error.domainId}
//       helperText={error.domainId}
//       sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}
//     >
//       {domainList.map((domain) => (
//         <MenuItem key={domain.domain_id} value={domain.domain_id} sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>
//           {domain.domain_name}
//         </MenuItem>
//       ))}
//     </TextField>
//     </Grid>
//     <Grid item xs={6}>
//     <TextField
//       select
//       label="Status"
//       fullWidth
//       name="is_status"
//       value={formData.is_status}
//       onChange={handleChange}
//       error={!!error.is_status}
//       helperText={error.is_status}
//       sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}
//     >
//       <MenuItem value="1" sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>Active</MenuItem>
//       <MenuItem value="0" sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>Inactive</MenuItem>
//     </TextField>
// </Grid>
// <Grid item xs={6}>
//     <TextField
//       select
//       fullWidth
//       label="Preferred"
//       name="is_prefered_mandatory"
//       value={formData.is_prefered_mandatory}
//       onChange={handleChange}
//       error={!!error.is_prefered_mandatory}
//       helperText={error.is_prefered_mandatory}
//       sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}
//     >
//       <MenuItem value="1" sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>Preferred</MenuItem>
//       <MenuItem value="0" sx={{background:"rgba(2, 136, 209, 0.08)", color:'#0288d1'}}>Optional</MenuItem>
//     </TextField>

//             </Grid>
//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" fullWidth color="primary" sx={{color:' #fff',backgroundColor:' #0288d1','&:hover': { backgroundColor: "#81d4fa" }}}>
//                 Submit
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </CardContent>
//     </Card>
//   </Container>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  CardContent,
  Autocomplete,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Switch
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {  InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../../services/api";

export default function DomainAssignment() {
  const token = localStorage.getItem("accessToken");

  // States for data
  const [domainList, setDomainList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [assignmentList, setAssignmentList] = useState([]);
  const [error, setError] = useState({});

  // States for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State for form modal
  const [openModal, setOpenModal] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    courseId: "",
    branchId: "",
    domainId: "",
    is_status: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

const handleSearchChange = (event) => {
  setSearchQuery(event.target.value);
};

const filteredList = assignmentList.filter((row) =>
  row.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.branch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  row.domain_name.toLowerCase().includes(searchQuery.toLowerCase())
);

  // Fetch Assignments List
  const fetchAssignments = useCallback(async () => {
    try {
      const response = await api.get("https://erpapi.eduskillsfoundation.org/institute/program_domain", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignmentList(response.data || []);
    } catch (error) {
      console.error("Error fetching domain assignments:", error);
    }
  }, [token]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status

      // Send API request with is_status in query params
      const response = await fetch(
        `https://erpapi.eduskillsfoundation.org/institute/update_status/${id}?is_status=${newStatus}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setAssignmentList((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, is_status: newStatus } : item
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  // Fetch Courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await api.get("https://erpapi.eduskillsfoundation.org/institute/get_programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourseList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [token]);

  // Fetch Branches based on selected course
  const fetchBranches = useCallback(async (courseId) => {
    if (!courseId) return;

    try {
      const response = await api.get(`https://erpapi.eduskillsfoundation.org/institute/get-program-branches/${courseId}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setBranchList(response.data.branches || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setBranchList([]);
    }
  }, [token]);

  // Fetch Domain List
  const fetchDomain = useCallback(async () => {
    try {
      const response = await api.get("https://erpapi.eduskillsfoundation.org/institute/get_domain_data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDomainList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchAssignments();
    fetchCourses();
    fetchDomain();
  }, [fetchAssignments, fetchCourses, fetchDomain]);

  useEffect(() => {
    if (formData.courseId) fetchBranches(formData.courseId);
  }, [formData.courseId, fetchBranches]);

  // Handle form input changes
  const handleChange = (event, value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "courseId") fetchBranches(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    let errors = {};

    if (!formData.courseId) errors.courseId = "Course is required";
    if (!formData.branchId) errors.branchId = "Branch is required";
    if (!formData.domainId) errors.domainId = "Domain is required";
    if (formData.is_status === "") errors.is_status = "Status is required";

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const response = await api.post("https://erpapi.eduskillsfoundation.org/institute/program_domain_add", {
        program_id: formData.courseId,
        branch_id: formData.branchId,
        domain_id: formData.domainId,
        is_status: formData.is_status,
        is_prefered_mandatory: 1
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Form submitted successfully:", response.data.message);
      alert(response.data.message);
      setFormData({
        courseId: "",
        branchId: "",
        domainId: "",
        is_status: "",
      });
      setOpenModal(false);
      fetchAssignments(); // Refresh the table after submission
    } catch (error) {
      if (error.response && error.response.data.detail) {
        const errorMessage = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => err.msg).join("\n")
          : error.response.data.detail;
        setError({ form: errorMessage });
        alert(errorMessage);
      } else {
        setError({ form: "Error submitting form. Please try again." });
        alert("Error submitting form. Please try again.");
      }
      console.error("Error submitting form:", error);
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle opening the form modal
  const handleOpenModal = () => {
    setOpenModal(true);
    setFormData({
      courseId: "",
      branchId: "",
      domainId: "",
      is_status: "",
    });
    setError({});
  };

  // Handle closing the form modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
    {/* <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
      Domain Assignments
    </Typography> */}

    <TextField
      variant="outlined"
      placeholder="Search..."
      value={searchQuery}
      onChange={handleSearchChange}
      sx={{ width: 270, backgroundColor: "white", borderRadius: 3 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      }}
    />

    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={handleOpenModal}
      sx={{ backgroundColor: "#1E3A8A", borderRadius: 2 }}
    >
      Add Domain
    </Button>
  </Box>

  {/* Domain Assignments Table */}
  <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mb: 4 }}>
    <Table>
      <TableHead sx={{ backgroundColor: "#1E3A8A" }}>
        <TableRow>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>S.No</TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Program</TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Branch</TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Domain</TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
          <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
          <TableRow key={index} hover>
            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
            <TableCell>{row.program_name}</TableCell>
            <TableCell>{row.branch_name}</TableCell>
            <TableCell>{row.domain_name}</TableCell>
            <TableCell>
              <Chip
                label={row.is_status === 1 ? "Active" : "Inactive"}
                color={row.is_status === 1 ? "success" : "error"}
                size="small"
              />
            </TableCell>
            <TableCell>
              <Switch
                checked={row.is_status === 1}
                onChange={() => handleToggleStatus(row.id, row.is_status)}
                color={row.is_status === 1 ? "success" : "primary"}
              />
            </TableCell>
          </TableRow>
        ))}
        {filteredList.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              No domain assignments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[10, 15, 100]}
      component="div"
      count={filteredList.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TableContainer>

      {/* Domain Assignment Form Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1E3A8A', color: 'white' }}>
        Assign Domain
        </DialogTitle>
        <DialogContent sx={{ pt: 3,marginTop:'18px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {error.form && (
                <Grid item xs={12}>
                  <Typography color="error">{error.form}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Autocomplete
                  options={courseList}
                  getOptionLabel={(option) => option.program_name || ""}
                  onChange={(event, value) => handleChange(event, value?.program_id, "courseId")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Course"
                      error={!!error.courseId}
                      helperText={error.courseId}
                      InputLabelProps={{ sx: { color: '#1E3A8A' } }}
                      sx={{
                        backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        borderRadius: 2,
                        '& .MuiInputLabel-root': { color: '#1E3A8A !important' },
                        '& .MuiInputBase-root': { color: '#1E3A8A' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(2, 136, 209, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1E3A8A' },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={branchList}
                  getOptionLabel={(option) => option.branch_name || ""}
                  onChange={(event, value) => handleChange(event, value?.branch_id, "branchId")}
                  disabled={!formData.courseId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Branch"
                      error={!!error.branchId}
                      helperText={error.branchId}
                      disabled={!formData.courseId}
                      InputLabelProps={{ style: { color: '#1E3A8A' } }}
                      sx={{
                        backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        borderRadius: 2,
                        '& .MuiInputLabel-root': { color: '#1E3A8A !important' },
                        '& .MuiInputBase-root': { color: '#1E3A8A' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(2, 136, 209, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1E3A8A' },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={domainList}
                  getOptionLabel={(option) => option.domain_name || ""}
                  onChange={(event, value) => handleChange(event, value?.domain_id, "domainId")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Domain"
                      error={!!error.domainId}
                      helperText={error.domainId}
                      InputLabelProps={{ style: { color: '#1E3A8A' } }}
                      sx={{
                        backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        borderRadius: 2,
                        '& .MuiInputLabel-root': { color: '#1E3A8A !important' },
                        '& .MuiInputBase-root': { color: '#1E3A8A' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(2, 136, 209, 0.3)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1E3A8A' },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="is_status"
                  value={formData.is_status}
                  onChange={(e) => handleChange(e, e.target.value, "is_status")}
                  error={!!error.is_status}
                  helperText={error.is_status}
                  InputLabelProps={{ style: { color: '#1E3A8A' } }}
                  sx={{
                    backgroundColor: 'rgba(2, 136, 209, 0.08)',
                    borderRadius: 2,
                    '& .MuiInputLabel-root': { color: '#1E3A8A !important' },
                    '& .MuiInputBase-root': { color: '#1E3A8A' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(2, 136, 209, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1E3A8A' },
                  }}
                >
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseModal} variant="outlined" sx={{ borderColor: '#1E3A8A', color: '#1E3A8A', borderRadius: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#1E3A8A', color: '#fff', borderRadius: 2 }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}