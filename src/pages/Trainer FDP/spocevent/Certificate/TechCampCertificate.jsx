import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  Typography,
  TablePagination,
  Skeleton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  EmojiEvents as AwardIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../../services/configUrls";

const TechCampsTableSkeleton = () => (
  <TableContainer
    component={Paper}
    sx={{
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      overflow: "hidden",
    }}
  >
    <Table size="small">
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #D1D5DB",
          }}
        >
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Domain
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Start Date
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            End Date
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Trainer Name
          </TableCell>
          <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
            Event Type
          </TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={200} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={100} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={100} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={120} />
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
              <Skeleton variant="text" width={150} />
            </TableCell>
            <TableCell>
              <Skeleton variant="rounded" width={140} height={32} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const TechCampsTable = () => {
  const [techcamps, setTechcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [certificateModal, setCertificateModal] = useState({
    open: false,
    pdfUrl: null,
    loading: false,
    bookslotId: null,
  });

  useEffect(() => {
    fetchTechCamps();
  }, []);

  const fetchTechCamps = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/event/institute-techcamps`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tech camps");
      }

      const data = await response.json();
      setTechcamps(data.techcamps || []);
    } catch (error) {
      console.error("Error fetching tech camps:", error);
      setTechcamps([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCertificate = async (bookslotId) => {
    setCertificateModal({
      open: true,
      pdfUrl: null,
      loading: true,
      bookslotId,
    });

    try {
      const response = await fetch(
        `${BASE_URL}/event/institute-certificate/${bookslotId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificate");
      }

      const data = await response.json();
      const base64Data = data.certificate_base64;

      // Convert base64 to blob and create URL
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setCertificateModal((prev) => ({
        ...prev,
        pdfUrl: url,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching certificate:", error);
      setCertificateModal({
        open: false,
        pdfUrl: null,
        loading: false,
        bookslotId: null,
      });
      alert("Failed to load certificate. Please try again.");
    }
  };

  const handleDownloadCertificate = () => {
    if (certificateModal.pdfUrl) {
      const link = document.createElement("a");
      link.href = certificateModal.pdfUrl;
      link.download = `certificate_${certificateModal.bookslotId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCloseCertificateModal = () => {
    if (certificateModal.pdfUrl) {
      URL.revokeObjectURL(certificateModal.pdfUrl);
    }
    setCertificateModal({
      open: false,
      pdfUrl: null,
      loading: false,
      bookslotId: null,
    });
  };

  const uniqueDomains = [...new Set(techcamps.map((camp) => camp.domain_name))];

  const filteredTechcamps = techcamps.filter((camp) => {
    const matchesSearch =
      camp.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.trainer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.event_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDomain =
      selectedDomain === "all" || camp.domain_name === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const paginatedTechcamps = filteredTechcamps.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDomainColor = (domain) => {
    const colors = [
      "#4CAF50",
      "#2196F3",
      "#FF9800",
      "#9C27B0",
      "#F44336",
      "#00BCD4",
      "#FF5722",
      "#3F51B5",
    ];
    const index =
      domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: "12px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Skeleton
              variant="rounded"
              width={250}
              height={40}
              sx={{ borderRadius: "12px" }}
            />
            <Skeleton
              variant="rounded"
              width={200}
              height={40}
              sx={{ borderRadius: "12px" }}
            />
          </Box>
        </Paper>
        <TechCampsTableSkeleton />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: "#1F2937", fontWeight: 600, mb: 1 }}
        >
          Tech Camp
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          View and download certificates for completed activites.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Search Activities..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF", fontSize: "1rem" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 250,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
              },
            }}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Domain</InputLabel>
            <Select
              value={selectedDomain}
              label="Filter by Domain"
              onChange={(e) => {
                setSelectedDomain(e.target.value);
                setPage(0);
              }}
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
              }}
            >
              <MenuItem value="all">All Domains</MenuItem>
              {uniqueDomains.map((domain) => (
                <MenuItem key={domain} value={domain}>
                  {domain}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          mb: 2,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#F8FAFC",
                borderBottom: "1px solid #D1D5DB",
              }}
            >
              <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Domain
                </Typography>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Start Date
                </Typography>
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  End Date
                </Typography>
              </TableCell>
              {/* <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Trainer Name
                </Typography>
              </TableCell> */}
              <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Particulars
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#374151" }}
                >
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTechcamps.map((camp, index) => (
              <TableRow
                key={camp.bookslot_id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#F9FAFB" },
                  "& td": {
                    borderBottom:
                      index === paginatedTechcamps.length - 1
                        ? "none"
                        : "1px solid #E5E7EB",
                  },
                }}
              >
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Chip
                    label={camp.domain_name}
                    sx={{
                      backgroundColor: `${getDomainColor(camp.domain_name)}15`,
                      color: getDomainColor(camp.domain_name),
                      fontWeight: 500,
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      height: "24px",
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon
                      sx={{ fontSize: "0.9rem", color: "#6B7280" }}
                    />
                    <Typography variant="body2" sx={{ color: "#4B5563" }}>
                      {formatDate(camp.start_date)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarIcon
                      sx={{ fontSize: "0.9rem", color: "#6B7280" }}
                    />
                    <Typography variant="body2" sx={{ color: "#4B5563" }}>
                      {formatDate(camp.end_date)}
                    </Typography>
                  </Box>
                </TableCell>
                {/* <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: "0.9rem", color: "#6B7280" }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#1F2937", fontWeight: 500 }}
                    >
                      {camp.trainer_name}
                    </Typography>
                  </Box>
                </TableCell> */}
                <TableCell sx={{ borderRight: "1px solid #E5E7EB" }}>
                  <Chip
                    label={camp.event_type.replace(/_/g, " ").toUpperCase()}
                    sx={{
                      backgroundColor: "#E3F2FD",
                      color: "#1976D2",
                      fontWeight: 500,
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      height: "24px",
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AwardIcon />}
                    onClick={() => fetchCertificate(camp.bookslot_id)}
                    sx={{
                      backgroundColor: "#2196F3",
                      "&:hover": { backgroundColor: "#1976D2" },
                      textTransform: "none",
                      fontSize: "0.75rem",
                      borderRadius: "8px",
                    }}
                  >
                    Download Certificate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedTechcamps.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    No tech camps found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper
        sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: "12px" }}
      >
        <TablePagination
          component="div"
          count={filteredTechcamps.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#6B7280",
              },
          }}
        />
      </Paper>

      {/* Certificate Modal */}
      <Dialog
        open={certificateModal.open}
        onClose={handleCloseCertificateModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", minHeight: "80vh" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AwardIcon sx={{ color: "#2196F3" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Certificate Preview
            </Typography>
          </Box>
          <IconButton onClick={handleCloseCertificateModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {certificateModal.loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                py: 8,
              }}
            >
              <CircularProgress size={48} sx={{ color: "#2196F3" }} />
              <Typography variant="body2" sx={{ color: "#6B7280" }}>
                Loading certificate...
              </Typography>
            </Box>
          ) : certificateModal.pdfUrl ? (
            <iframe
              src={`${certificateModal.pdfUrl}#toolbar=0`}
              style={{
                width: "100%",
                height: "70vh",
                border: "none",
              }}
              title="Certificate Preview"
            />
          ) : (
            <Typography variant="body2" sx={{ color: "#6B7280", py: 4 }}>
              Failed to load certificate
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #E5E7EB" }}>
          <Button
            onClick={handleCloseCertificateModal}
            sx={{
              color: "#6B7280",
              "&:hover": { backgroundColor: "#F3F4F6" },
              borderRadius: "8px",
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleDownloadCertificate}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!certificateModal.pdfUrl || certificateModal.loading}
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45A049" },
              "&:disabled": { backgroundColor: "#CCCCCC" },
              borderRadius: "8px",
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TechCampsTable;
