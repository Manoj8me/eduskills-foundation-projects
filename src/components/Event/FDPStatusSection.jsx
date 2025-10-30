import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Modal,
  IconButton,
  Alert,
  Backdrop,
  TablePagination,
  TextField,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  BusinessCenter as BusinessCenterIcon,
} from "@mui/icons-material";

// Styled components
const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  backgroundColor: "#ffffff",
  border: "1px solid rgba(0, 136, 204, 0.08)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
  marginBottom: theme.spacing(3),
  "&:hover": {
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  },
  transition: "box-shadow 0.2s ease-in-out",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: "2px solid #f0f0f0",
}));

const StatusCard = styled(Paper)(({ theme, statuscolor, statusbgcolor }) => ({
  padding: theme.spacing(2.5, 3),
  borderRadius: theme.spacing(1.2),
  border: `1px solid ${statuscolor}30`,
  backgroundColor: statusbgcolor,
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  height: "100%",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: `0 6px 20px ${statuscolor}40`,
    borderColor: `${statuscolor}60`,
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 2.5),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    flexDirection: "column",
    textAlign: "center",
    gap: theme.spacing(1),
  },
}));

const ModalContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1000px",
  maxHeight: "80vh",
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(3),
  overflow: "auto",
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    padding: theme.spacing(2),
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: "2px solid #f0f0f0",
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(1),
    backgroundColor: "#f8f9fa",
    "&:hover": {
      backgroundColor: "#f0f1f2",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
    },
  },
}));

const IconContainer = styled(Box)(({ theme, iconcolor }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: iconcolor,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  "& .MuiSvgIcon-root": {
    color: "white",
    fontSize: "1.1rem",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.2),
    "& .MuiSvgIcon-root": {
      fontSize: "1rem",
    },
  },
}));

const CountText = styled(Typography)(({ theme, countcolor }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: countcolor,
  lineHeight: 1.2,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem",
  },
}));

const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: "0.775rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  lineHeight: 1.3,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    marginTop: theme.spacing(0.25),
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: theme.spacing(1),
  border: "1px solid rgba(0, 0, 0, 0.08)",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  "& .MuiTableCell-head": {
    fontWeight: 600,
    fontSize: "0.875rem",
    color: theme.palette.text.primary,
    borderBottom: "2px solid #e0e0e0",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fafafa",
  },
  "&:hover": {
    backgroundColor: "#f0f7ff",
  },
  transition: "background-color 0.2s ease",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  padding: theme.spacing(2),
  borderBottom: "1px solid #e8e8e8",
}));

// FDP Status Component
const FDPStatusSection = ({ fdpData, loading, error }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    data: null,
    title: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCardClick = (data, title, type) => {
    if (type !== "hosted") {
      setModalData({ data, title, type });
      setModalOpen(true);
      setSearchTerm("");
      setPage(0);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData({ data: null, title: "", type: "" });
    setSearchTerm("");
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterData = (data) => {
    if (!data || !data.details) return [];

    return data.details.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mobile.includes(searchTerm) ||
        item.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.domain &&
          item.domain.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const renderSkeletonCards = () => (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, sm: 2.5, lg: 3 },
        mb: 3,
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(5, 1fr)",
        },
      }}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Paper
          key={index}
          sx={{
            padding: { xs: 2, sm: 2.5, lg: 3 },
            borderRadius: 1.2,
            backgroundColor: "#f8f9fa",
            height: "100px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <Skeleton variant="circular" width={40} height={40} />
            <Box flex={1}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SectionContainer elevation={0}>
        <SectionTitle variant="body2">FDP Status</SectionTitle>
        {renderSkeletonCards()}
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer elevation={0}>
        <SectionTitle variant="body2">FDP Status</SectionTitle>
        <Alert severity="error">Error: {error}</Alert>
      </SectionContainer>
    );
  }

  const renderTable = (data) => {
    if (!data || !data.details || data.details.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          No data available
        </Typography>
      );
    }

    const filteredData = filterData(data);
    const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Box>
        {/* Search Field */}
        <SearchContainer>
          <StyledTextField
            fullWidth
            size="small"
            placeholder="Search by name, email, mobile, designation, or domain..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </SearchContainer>

        {filteredData.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No results found for "{searchTerm}"
          </Typography>
        ) : (
          <>
            {/* Table */}
            <StyledTableContainer>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Mobile</StyledTableCell>
                    <StyledTableCell>Designation</StyledTableCell>
                    <StyledTableCell>Domain</StyledTableCell>
                    <StyledTableCell>Duration</StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: "#2196f3",
                              fontSize: "0.875rem",
                            }}
                          >
                            {item.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.email}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2">{item.mobile}</Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={item.designation}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: "#f0f7ff",
                            borderColor: "#2196f3",
                            color: "#2196f3",
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={item.domain || "N/A"}
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: "#f0f7ff",
                            borderColor: "#9c27b0",
                            color: "#9c27b0",
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" color="text.secondary">
                          {item.program
                            ? `${formatDate(
                                item.program.event_start_date
                              )} - ${formatDate(item.program.event_end_date)}`
                            : "N/A"}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                borderTop: "1px solid #e0e0e0",
                mt: 2,
                "& .MuiTablePagination-toolbar": {
                  minHeight: "52px",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "0.875rem",
                  },
              }}
            />
          </>
        )}
      </Box>
    );
  };

  return (
    <SectionContainer elevation={0}>
      <SectionTitle variant="body2">FDP Status</SectionTitle>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, sm: 2.5, lg: 3 },
          mb: 3,
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)", // 2 columns on mobile
            sm: "repeat(3, 1fr)", // 3 columns on tablet
            md: "repeat(5, 1fr)", // 5 columns on desktop
          },
        }}
      >
        <StatusCard
          statuscolor="#2196f3"
          statusbgcolor="#e3f2fd"
          elevation={0}
          onClick={() =>
            handleCardClick(
              fdpData?.total_edp_faculty,
              "Total Faculty Details",
              "total"
            )
          }
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#2196f3">
              <PersonIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#2196f3">
                {fdpData?.total_edp_faculty?.count || 0}
              </CountText>
              <LabelText>Total Faculty</LabelText>
            </Box>
          </Box>
        </StatusCard>

        <StatusCard
          statuscolor="#ff9800"
          statusbgcolor="#fff3e0"
          elevation={0}
          onClick={() =>
            handleCardClick(
              fdpData?.edpfdp_participated_faculty,
              "FDP Participated Faculty Details",
              "participated"
            )
          }
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#ff9800">
              <EventNoteIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#ff9800">
                {fdpData?.edpfdp_participated_faculty?.count || 0}
              </CountText>
              <LabelText>FDP Participated</LabelText>
            </Box>
          </Box>
        </StatusCard>

        <StatusCard
          statuscolor="#9c27b0"
          statusbgcolor="#f3e5f5"
          elevation={0}
          onClick={() => handleCardClick(null, "Programs Hosted", "hosted")}
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#9c27b0">
              <BusinessCenterIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#9c27b0">
                {fdpData?.institute_hosted_program_count || 0}
              </CountText>
              <LabelText>Hosted</LabelText>
            </Box>
          </Box>
        </StatusCard>

        <StatusCard
          statuscolor="#4caf50"
          statusbgcolor="#e8f5e8"
          elevation={0}
          onClick={() =>
            handleCardClick(
              fdpData?.active_edp_faculty,
              "Active Faculty Details",
              "active"
            )
          }
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#4caf50">
              <CheckCircleIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#4caf50">
                {fdpData?.active_edp_faculty?.count || 0}
              </CountText>
              <LabelText>Active</LabelText>
            </Box>
          </Box>
        </StatusCard>

        <StatusCard
          statuscolor="#f44336"
          statusbgcolor="#ffebee"
          elevation={0}
          onClick={() =>
            handleCardClick(
              fdpData?.inactive_edp_faculty,
              "Inactive Faculty Details",
              "inactive"
            )
          }
        >
          <Box display="flex" alignItems="center" gap={2} width="100%">
            <IconContainer iconcolor="#f44336">
              <XCircleIcon />
            </IconContainer>
            <Box flex={1} minWidth={0}>
              <CountText countcolor="#f44336">
                {fdpData?.inactive_edp_faculty?.count || 0}
              </CountText>
              <LabelText>Inactive</LabelText>
            </Box>
          </Box>
        </StatusCard>
      </Box>

      {/* Modal for showing detailed tables */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <ModalContainer>
          <ModalHeader>
            <Typography variant="h6" fontWeight={600}>
              {modalData.title}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </ModalHeader>
          {renderTable(modalData.data)}
        </ModalContainer>
      </Modal>
    </SectionContainer>
  );
};

export default FDPStatusSection;
