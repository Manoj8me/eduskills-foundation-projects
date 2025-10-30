import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Box,
  Typography,
  Button,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  useTheme,
  Tooltip,
  Badge,
  styled,
  Divider,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
  FormHelperText,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { StaffService } from "../../services/dataService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { tokens } from "../../theme";
import CustomPagination from "./CustomPagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx"; // Import xlsx
import {
  Building2,
  CloudUploadIcon,
  FilePlus,
  Mail,
  Phone,
  SearchX,
  Trash2,
  User,
  UserCircle2,
  Users,
} from "lucide-react";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFormik } from "formik";
import * as Yup from "yup";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EnhancedUploadModal from "./EnhancedUploadModal";
import SingleIntakeModal from "./SingleIntakeModal";
import ViewStudentModal from "./ViewStudentModal";
import EditEmailModal from "./EditStudentModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BulkDeleteModal from "./BulkDeleteModal";
import EnhancedSearch from "./EnhancedSearch";
import IntakeTourGuide from "./IntakeTourGuide";
import { useNavigate } from "react-router-dom";

const IntakeData = () => {
  const [page, setPage] = useState(1); // API page starts from 1
  const [rowsPerPage, setRowsPerPage] = useState(5); // Matches API's page_size
  const [totalPages, setTotalPages] = useState(0); // To keep track of total pages
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Holds the debounced search term
  const [dataCache, setDataCache] = useState({}); // Cache for storing pages of data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Separate loading for search
  const [anchorElMap, setAnchorElMap] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [singleIntakeModalOpen, setSingleIntakeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMailId, setEditMailId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteStudent, setSelectedDeleteStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedRowsMap, setSelectedRowsMap] = useState({});
  const [selectedFilterType, setSelectedFilterType] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();

  const getCheckboxStyles = (isHeader = false) => ({
    color: isHeader
      ? "#ffffff"
      : theme.palette.mode === "dark"
      ? "#a3a3a3"
      : "#757575",
    "&.Mui-checked": {
      color: isHeader
        ? "#ffffff"
        : theme.palette.mode === "dark"
        ? "#64b5f6"
        : "#1976d2",
    },
    "&.MuiCheckbox-indeterminate": {
      color: isHeader
        ? "#ffffff"
        : theme.palette.mode === "dark"
        ? "#64b5f6"
        : "#1976d2",
    },
    "&:hover": {
      backgroundColor: isHeader
        ? "rgba(255, 255, 255, 0.08)"
        : theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.04)",
    },
  });

  const getHeaderBgColor = () =>
    theme.palette.mode === "dark" ? "#1e1e1e" : "#1976d2";

  // Add this function to handle view details
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
    handleMenuClose(student.user_id);
  };

  const getCurrentPageSelections = () => selectedRowsMap[page] || [];

  const getTotalSelectedCount = () => {
    return Object.values(selectedRowsMap).reduce(
      (total, pageSelections) => total + pageSelections.length,
      0
    );
  };

  // Check if all rows on current page are selected
  const isCurrentPageAllSelected = () => {
    const currentPageSelections = getCurrentPageSelections();
    return data.length > 0 && currentPageSelections.length === data.length;
  };

  // Check if current page is partially selected
  const isCurrentPagePartiallySelected = () => {
    const currentPageSelections = getCurrentPageSelections();
    return currentPageSelections.length > 0 && !isCurrentPageAllSelected();
  };

  const handleSelectAll = (event) => {
    const newSelected = event.target.checked
      ? data.map((row) => row.intake_id)
      : [];
    setSelectedRowsMap((prev) => ({
      ...prev,
      [page]: newSelected,
    }));
  };

  // const handleSelectAll = (event) => {
  //   if (event.target.checked) {
  //     const newSelected = data.map((row) => row.intake_id);
  //     setSelectedRows(newSelected);
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };

  // Update handleSelectRow for multi-page selection
  const handleSelectRow = (event, id) => {
    const checked = event.target.checked;
    const currentPageSelections = getCurrentPageSelections();

    const newPageSelections = checked
      ? [...currentPageSelections, id]
      : currentPageSelections.filter((rowId) => rowId !== id);

    setSelectedRowsMap((prev) => ({
      ...prev,
      [page]: newPageSelections,
    }));
  };

  // Update handleSelectRow for multi-page selection

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      // Combine all selected IDs from all pages
      const allSelectedIds = Object.values(selectedRowsMap).flat();

      await StaffService.bulkDeleteIntakeDetails(allSelectedIds);

      toast.success(`Successfully deleted ${allSelectedIds.length} students`);
      setSelectedRowsMap({}); // Clear all selections
      fetchData(page, rowsPerPage, debouncedSearchTerm);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete selected students. Please try again.");
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteModalOpen(false);
    }
  };

  // Update isSelected check in the table
  const isRowSelected = (id) => {
    const currentPageSelections = selectedRowsMap[page] || [];
    return currentPageSelections.indexOf(id) !== -1;
  };

  useEffect(() => {
    if (!dataCache[page] || debouncedSearchTerm) {
      fetchData(page, rowsPerPage, debouncedSearchTerm);
    } else {
      setData(dataCache[page]);
    }
  }, [page, rowsPerPage, debouncedSearchTerm]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name should be at least 2 characters")
      .max(50, "Name should not exceed 50 characters"),
    mail_id: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    branch: Yup.string()
      .required("Branch is required")
      .min(2, "Branch should be at least 2 characters"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(["Male", "Female", "Other"], "Invalid gender selection"),
    year: Yup.number()
      .required("Passout year is required")
      .min(2000, "Passout year must be 2000 or later")
      .max(2040, "Passout year must be 2040 or earlier"),
  });

  // Single Intake Form Submission Handler
  const formik = useFormik({
    initialValues: {
      name: "",
      mail_id: "",
      branch: "",
      mobile: "",
      gender: "",
      year: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        // Add op_type for single upload
        formData.append("op_type", "SINGLE");
        // Add each field to FormData
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        const response = await StaffService.uploadIntakeData(formData);

        if (response.status === 200) {
          toast.success("Student data added successfully!");
          setSingleIntakeModalOpen(false);
          formik.resetForm();
          fetchData(page, rowsPerPage, debouncedSearchTerm); // Refresh the table
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to add student data. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    if (!selectedDeleteStudent) return;

    setIsDeleting(true);
    try {
      await StaffService.deleteIntakeDetails(selectedDeleteStudent.intake_id);
      toast.success("Student data deleted successfully!");
      fetchData(page, rowsPerPage, debouncedSearchTerm); // Refresh the table
      setDeleteModalOpen(false);
      setSelectedDeleteStudent(null);
    } catch (error) {
      console.error("Delete error:", error);
      if (error.response?.status === 404) {
        toast.error("Student data not found.");
      } else {
        toast.error("Failed to delete student data. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Update the file handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        setUploadError("Please upload a CSV file using our template");
        toast.error(
          "Invalid file format. Only CSV files using our template are accepted."
        );
        return;
      }

      // Read and validate the file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const firstLine = text.split("\n")[0].toLowerCase().trim();

        // Define expected headers based on filter type
        let expectedHeaders;
        console.log(selectedFilterType);
        if (selectedFilterType === "branch") {
          expectedHeaders = ["name", "mail_id", "mobile", "gender", "year"]
            .join(",")
            .toLowerCase();
        } else if (selectedFilterType === "year") {
          expectedHeaders = ["name", "mail_id", "mobile", "gender", "branch"]
            .join(",")
            .toLowerCase();
        } else {
          expectedHeaders = [
            "name",
            "mail_id",
            "branch",
            "mobile",
            "gender",
            "year",
          ]
            .join(",")
            .toLowerCase();
        }

        if (firstLine !== expectedHeaders) {
          setUploadError("Invalid CSV structure. Please use our template.");
          toast.error("File structure does not match the required template.");
          return;
        }

        setSelectedFile(file);
        setUploadError("");
        toast.success("File validated successfully!");
      };
      reader.readAsText(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      let response;

      // Use different endpoints based on filter type
      if (selectedFilterType === "branch" && selectedBranch) {
        formData.append("branch", selectedBranch.branch_name);
        formData.append("op_type", "BULK");
        response = await StaffService.uploadIntakeBranch(formData);
      } else if (selectedFilterType === "year" && selectedYear) {
        formData.append("year", selectedYear.value.toString());
        formData.append("op_type", "BULK");
        response = await StaffService.uploadIntakeYear(formData);
      } else {
        formData.append("op_type", "BULK");
        response = await StaffService.uploadIntakeData(formData);
      }

      if (response.status === 200) {
        const { message, inserted_records, duplicate_records } = response.data;

        if (inserted_records === 0 && duplicate_records > 0) {
          toast.warning(
            `All ${duplicate_records} records were duplicates. No new records added.`
          );
        } else if (inserted_records > 0 && duplicate_records > 0) {
          toast.success(
            `Successfully added ${inserted_records} new records. ${duplicate_records} duplicate records were found.`
          );
        } else if (inserted_records > 0 && duplicate_records === 0) {
          toast.success(`Successfully added all ${inserted_records} records!`);
        } else {
          toast.error(
            "No valid records found in the file. Please check the file format and try again."
          );
        }

        setUploadModalOpen(false);
        setSelectedFile(null);
        setSelectedFilterType(null);
        setSelectedBranch(null);
        setSelectedYear(null);
        setUploadError("");
        fetchData(page, rowsPerPage, debouncedSearchTerm);
      }
    } catch (error) {
      console.error("Upload error:", error);
      handleUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to handle upload errors
  const handleUploadError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Invalid data format. Please check your file structure.");
          setUploadError(
            "Invalid data format. Please check your file structure."
          );
          break;
        case 409:
          toast.error("Duplicate entries found. Please review your data.");
          setUploadError("Duplicate entries found. Please review your data.");
          break;
        case 413:
          toast.error("File size too large. Please try a smaller batch.");
          setUploadError("File size too large. Please try a smaller batch.");
          break;
        case 422:
          toast.error(
            "Invalid data in the file. Please check all required fields."
          );
          setUploadError(
            "Invalid data in the file. Please check all required fields."
          );
          break;
        default:
          toast.error("An error occurred during upload. Please try again.");
          setUploadError("An error occurred during upload. Please try again.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
      setUploadError("Network error. Please check your connection.");
    } else {
      toast.error("Failed to upload file. Please try again.");
      setUploadError("Failed to upload file. Please try again.");
    }
  };

  const handleDownloadDemo = () => {
    try {
      const headers = ["name", "mail_id", "branch", "mobile", "gender", "year"];
      const csvContent = [headers.join(",")].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "intake_data_template.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download template. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Debounced effect for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm === "") {
        // If search term is cleared, fetch all data without filters
        fetchData(1, rowsPerPage);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async (page, pageSize, search = "") => {
    const isSearching = search !== "";
    if (isSearching) {
      setSearchLoading(true); // Show search-specific loading
    } else {
      setLoading(true); // Regular loading
    }

    try {
      const response = await StaffService.getUsersOfIntakeData(
        page,
        pageSize,
        search
      );
      const { user_response, total_pages } = response.data;

      // Cache the page data and update state
      setDataCache((prevCache) => ({
        ...prevCache,
        [page]: user_response,
      }));
      setData(user_response);
      setTotalPages(total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false); // Stop both loading indicators
    }
  };

  const handleMenuClick = (event, userId) => {
    setAnchorElMap((prev) => ({
      ...prev,
      [userId]: event.currentTarget,
    }));
  };

  const handleMenuClose = (userId) => {
    setAnchorElMap((prev) => {
      const newMap = { ...prev };
      delete newMap[userId];
      return newMap;
    });
  };

  // Effect to handle the countdown timer

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage + 1); // Adjust to API's 1-based index
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(1); // Reset to the first page when changing rows per page
  //   setDataCache({}); // Clear cache when rows per page changes
  // };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to page 1 on search term change
  };

  // Add this function to handle email update
  const handleUpdateEmail = async () => {
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("mail_id", editMailId);

      const response = await StaffService.updateIntakeDetails(
        selectedStudent.intake_id,
        formData
      );
      toast.success(response.data.message);
      fetchData(page, rowsPerPage, debouncedSearchTerm); // Refresh data
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating email:", error);
      // Handle different types of errors
      if (error.response) {
        switch (error.response.status) {
          case 400:
            toast.error("Invalid email format. Please check and try again.");
            break;
          case 409:
            toast.error(
              "This email is already in use. Please use a different email."
            );
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error("Failed to update email. Please try again.");
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsEditing(false);
    }
  };

  // const exportToExcel = () => {
  //   const exportData = data.map((row, index) => ({
  //     "SL No": index + 1 + (page - 1) * rowsPerPage,
  //     "Full Name": row.name,
  //     Email: row.email,
  //     "Passout Year": row.passout_year,
  //     Cohort: row.cohort ? `Cohort ${row.cohort}` : "Not Applied",
  //     Status:
  //       row.status === "1"
  //         ? "Not Applied"
  //         : row.status === "2"
  //         ? "Ongoing"
  //         : row.status === "3"
  //         ? "Completed"
  //         : row.status === "4"
  //         ? "Failed"
  //         : "Applied",
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Internship Data");

  //   // Generate the file and prompt download
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });
  //   const blobData = new Blob([excelBuffer], { type: "application/octet-stream" });
  //   saveAs(blobData, "Internship_Data.xlsx");
  // };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pt: { xs: 1, sm: 2, md: 1 },
        pb: { xs: 1, sm: 2, md: 3 },
        pl: { xs: 1, sm: 2, md: 3 },
        pr: { xs: 1, sm: 2, md: 3 },

        boxSizing: "border-box",
      }}
    >
      <IntakeTourGuide />
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          maxWidth: "100%",
          m: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            mt: 2,
            ml: 2,
            fontWeight: "bold",
            color: colors.blueAccent[300],
          }}
        >
          Welcome to Add Student Intake Data !
        </Typography>

        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: { xs: 2, md: 2 },
          }}
        >
          <EnhancedSearch
            value={searchTerm}
            id="search-box"
            onChange={(e) => setSearchTerm(e.target.value)}
            loading={searchLoading}
            onClear={() => setSearchTerm("")}
            placeholder="Search Email"
          />

          {/* Buttons container */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, md: 1.5 },
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            {/* Selected items actions */}
            {getTotalSelectedCount() > 0 && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, md: 1.5 },
                  alignItems: "center",
                  flexDirection: { xs: "column", md: "row" },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedRowsMap({})}
                  startIcon={<Icon icon="mdi:select-remove" width={15} />}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    px: { xs: 2, md: 2 },
                    py: 0.7,
                    height: "28px",
                    fontSize: "0.7rem",
                    width: { xs: "100%", md: "auto" },
                    whiteSpace: "nowrap",
                    borderColor:
                      theme.palette.mode === "dark" ? "#64b5f6" : "#1976d2",
                    color:
                      theme.palette.mode === "dark" ? "#64b5f6" : "#1976d2",
                  }}
                >
                  Clear Selection
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setBulkDeleteModalOpen(true)}
                  startIcon={<Trash2 size={15} />}
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    px: { xs: 2, md: 2 },
                    py: 0.7,
                    height: "28px",
                    fontSize: "0.7rem",
                    width: { xs: "100%", md: "auto" },
                    whiteSpace: "nowrap",
                  }}
                >
                  Delete Selected ({getTotalSelectedCount()})
                </Button>
              </Box>
            )}

            {/* Add buttons */}
            <Button
              variant="contained"
              color="success"
              size="small"
              id="add-single-intake"
              onClick={() => setSingleIntakeModalOpen(true)}
              startIcon={<PersonAddIcon />}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                px: { xs: 2, md: 2 },
                py: 0.7,
                height: "28px",
                fontSize: "0.7rem",
                width: { xs: "100%", md: "auto" },
                whiteSpace: "nowrap",
              }}
            >
              Add Single Intake
            </Button>
            <Button
              variant="contained"
              color="info"
              size="small"
              id="add-bulk-intake"
              onClick={() => setUploadModalOpen(true)}
              startIcon={<FilePlus size={15} />}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                px: { xs: 2, md: 2 },
                py: 0.7,
                height: "28px",
                fontSize: "0.7rem",
                width: { xs: "100%", md: "auto" },
                whiteSpace: "nowrap",
              }}
            >
              Add Bulk Intake
            </Button>
          </Box>
        </Box>
        <TableContainer
          id="student-table"
          sx={{
            maxHeight: 350,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#666666" : "#888888",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#808080" : "#555555",
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: getHeaderBgColor(),
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                  }}
                >
                  <Checkbox
                    indeterminate={isCurrentPagePartiallySelected()}
                    checked={isCurrentPageAllSelected()}
                    onChange={handleSelectAll}
                    sx={getCheckboxStyles(true)}
                  />
                </TableCell>
                {[
                  "SL No",
                  "Full Name",
                  "Email ID",
                  "Branch",
                  "Mobile",
                  "Gender",
                  "Passout Year",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align={header === "Actions" ? "center" : "left"}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ height: 300 }}>
                  <TableCell align="center" colSpan={9}>
                    <CircularProgress color="info" />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                    {debouncedSearchTerm ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "50%",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#1e293b"
                                : "#f8fafc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SearchX size={28} className="text-gray-400" />
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#f1f5f9"
                                  : "#1e293b",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            No Results Found
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#94a3b8"
                                  : "#64748b",
                            }}
                          >
                            No matches for "{debouncedSearchTerm}"
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#94a3b8"
                                  : "#64748b",
                            }}
                          >
                            Try adjusting your search term
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "50%",
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#1e293b"
                                : "#f8fafc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Users size={28} className="text-gray-400" />
                        </Box>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#f1f5f9"
                                  : "#1e293b",
                              fontWeight: 600,
                              mb: 1,
                            }}
                          >
                            No Students Added
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#94a3b8"
                                  : "#64748b",
                            }}
                          >
                            Add students using the buttons above
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={row.intake_id}
                    selected={isRowSelected(row.intake_id)}
                    hover
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "#2d2d2d !important"
                            : "#f5f5f5 !important",
                      },
                      "&:hover": {
                        backgroundColor:
                          theme.palette.mode === "dark" ? "#2d2d2d" : "#fafafa",
                      },
                      "& .MuiTableCell-root": {
                        color:
                          theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isRowSelected(row.intake_id)}
                        onChange={(event) =>
                          handleSelectRow(event, row.intake_id)
                        }
                        sx={getCheckboxStyles()}
                      />
                    </TableCell>
                    <TableCell>
                      {index + 1 + (page - 1) * rowsPerPage}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.name}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.name}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.mail_id}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.mail_id}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.branch}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "20ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.branch}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.mobile}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "15ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.mobile}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={row.gender}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "10ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.gender}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={row.year}>
                        <Typography
                          fontSize={12}
                          noWrap
                          sx={{
                            maxWidth: "10ch",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            // margin: "0 auto", // Center the text within the Typography component
                          }}
                        >
                          {row.year}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        id="action-menu"
                        onClick={(e) => handleMenuClick(e, row.intake_id)}
                        size="small"
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElMap[row.intake_id]}
                        open={Boolean(anchorElMap[row.intake_id])}
                        onClose={() => handleMenuClose(row.intake_id)}
                        PaperProps={{
                          sx: {
                            minWidth: "120px",
                            borderRadius: "8px",
                            mt: 0.5,
                            bgcolor: (theme) =>
                              theme.palette.mode === "dark"
                                ? "#1e293b"
                                : "#ffffff",
                            border: (theme) =>
                              `1px solid ${
                                theme.palette.mode === "dark"
                                  ? "#334155"
                                  : "#e2e8f0"
                              }`,
                            boxShadow: (theme) =>
                              theme.palette.mode === "dark"
                                ? "0 4px 12px rgba(0,0,0,0.3)"
                                : "0 4px 12px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={() => handleViewDetails(row)}
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontSize: "0.875rem",
                            color: colors.blueAccent[400],
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#334155"
                                  : "#f8fafc",
                            },
                          }}
                        >
                          <User
                            size={16}
                            className="mr-2"
                            color={colors.blueAccent[400]}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: colors.blueAccent[400],
                            }}
                          >
                            View
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setEditMailId(row.mail_id);
                            setSelectedStudent(row);
                            setEditModalOpen(true);
                            handleMenuClose(row.intake_id);
                          }}
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontSize: "0.875rem",
                            color: colors.greenAccent[400],
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#334155"
                                  : "#f8fafc",
                            },
                          }}
                        >
                          <Icon
                            icon="mdi:pencil-outline"
                            width={16}
                            className="mr-2"
                            color={colors.greenAccent[400]}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: colors.greenAccent[400],
                            }}
                          >
                            Edit Mail ID
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setSelectedDeleteStudent(row);
                            setDeleteModalOpen(true);
                            handleMenuClose(row.intake_id);
                          }}
                          sx={{
                            py: 1,
                            px: 1.5,
                            fontSize: "0.875rem",
                            color: colors.redAccent[400],
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#334155"
                                  : "#f8fafc",
                            },
                          }}
                        >
                          <Icon
                            icon="mdi:delete-outline"
                            width={16}
                            className="mr-2"
                            color={colors.redAccent[400]}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: colors.redAccent[400],
                            }}
                          >
                            Delete
                          </Typography>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <CustomPagination
          id="pagination-controls"
          count={totalPages * rowsPerPage}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
            setDataCache({});
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
        <ViewStudentModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          student={selectedStudent}
        />
        <SingleIntakeModal
          open={singleIntakeModalOpen}
          onClose={() => setSingleIntakeModalOpen(false)}
          onSuccess={() => {
            // Refresh the table data
            fetchData(page, rowsPerPage, debouncedSearchTerm);
          }}
        />
        <EditEmailModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          selectedStudent={selectedStudent}
          editMailId={editMailId}
          setEditMailId={setEditMailId}
          handleUpdateEmail={handleUpdateEmail}
          isEditing={isEditing}
        />
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedDeleteStudent(null);
          }}
          onConfirm={handleDelete}
          loading={isDeleting}
          studentName={selectedDeleteStudent?.name}
        />
        <BulkDeleteModal
          open={bulkDeleteModalOpen}
          onClose={() => setBulkDeleteModalOpen(false)}
          selectedCount={getTotalSelectedCount()}
          onConfirm={handleBulkDelete}
          isDeleting={isBulkDeleting}
        />
        <EnhancedUploadModal
          open={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedFilterType(null);
            setSelectedBranch(null);
            setSelectedYear(null);
          }}
          selectedFile={selectedFile}
          onFileSelect={handleFileUpload}
          onFileDelete={() => {
            setSelectedFile(null);
            setUploadError("");
          }}
          handleUploadSubmit={handleUploadSubmit}
          handleDownloadDemo={handleDownloadDemo}
          isUploading={isUploading}
          uploadError={uploadError}
          selectedFilterType={selectedFilterType}
          setSelectedFilterType={setSelectedFilterType}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </Paper>
    </Box>
  );
};

export default IntakeData;
