import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  TablePagination,
  Fade,
  Alert,
  useMediaQuery,
  useTheme,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const CollegeDataTable = ({
  collegeData,
  onEdit,
  onDelete,
  showSuccess,
  onRefresh,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Filter data based on search term
  const filteredData = collegeData.filter(
    (college) =>
      college.rm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.colg_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.colg_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.contacts?.some(
        (contact) =>
          contact.contact_person_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contact.designation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.mob?.includes(searchTerm)
      )
  );

  // Paginate filtered data
  const paginatedData = filteredData.slice(
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewContacts = (college) => {
    setSelectedCollege(college);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCollege(null);
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {showSuccess && (
        <Fade in={showSuccess}>
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
              fontSize: "0.8rem",
              backgroundColor: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
              "& .MuiAlert-icon": {
                color: "#16a34a",
              },
            }}
          >
            College data updated successfully! 🎉
          </Alert>
        </Fade>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          sx={{
            fontWeight: 600,
            color: "#374151",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          College Information Data
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
          size="small"
          sx={{
            borderRadius: 2,
            fontSize: "0.8rem",
            color: "#6b7280",
            borderColor: "#d1d5db",
            "&:hover": {
              borderColor: "#9ca3af",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by RM name, college name, address, state, or contact details..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#6b7280", fontSize: "1.1rem" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: { xs: "100%", sm: 500 },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              fontSize: "0.8rem",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#d1d5db",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                borderWidth: 1,
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "0.8rem",
              padding: "8px 14px",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 1,
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          overflow: "auto",
          maxHeight: { xs: "70vh", sm: "80vh" },
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: 8,
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f5f9",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: 4,
            "&:hover": {
              backgroundColor: "#94a3b8",
            },
          },
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            minWidth: { xs: 1100, sm: 1300 },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 120,
                }}
              >
                RM Info
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 180,
                }}
              >
                College Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 120,
                }}
              >
                Mobile Number
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 100,
                }}
              >
                State
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 200,
                }}
              >
                Address
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 150,
                }}
              >
                Website
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 120,
                }}
              >
                Contacts
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#f9fafb",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.75rem",
                  padding: "8px 12px",
                  minWidth: 100,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((college) => (
                <TableRow
                  key={college.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                    height: "auto",
                  }}
                >
                  {/* RM Info */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          lineHeight: 1.3,
                          mb: 0.5,
                          color: "#1976d2",
                        }}
                      >
                        {college.rm_name}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* College Name */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        lineHeight: 1.3,
                        color: "#1f2937",
                      }}
                    >
                      {college.colg_name}
                    </Typography>
                  </TableCell>

                  {/* Mobile Number */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        fontFamily: "monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      📱 {college.rm_mob || "N/A"}
                    </Typography>
                  </TableCell>

                  {/* State */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    {college.state ? (
                      <Chip
                        label={college.state}
                        size="small"
                        sx={{
                          backgroundColor: "#e0f2fe",
                          color: "#0277bd",
                          fontSize: "0.65rem",
                          height: 20,
                          fontWeight: 500,
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.65rem",
                          fontStyle: "italic",
                        }}
                      >
                        No state
                      </Typography>
                    )}
                  </TableCell>

                  {/* Address */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    {college.colg_address ? (
                      <Typography
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.65rem",
                          lineHeight: 1.3,
                        }}
                      >
                        📍{" "}
                        {college.colg_address.length > 40
                          ? `${college.colg_address.substring(0, 40)}...`
                          : college.colg_address}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.65rem",
                          fontStyle: "italic",
                        }}
                      >
                        No address
                      </Typography>
                    )}
                  </TableCell>

                  {/* Website */}
                  <TableCell
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    {college.colg_website ? (
                      <Typography
                        component="a"
                        href={
                          college.colg_website.startsWith("http")
                            ? college.colg_website
                            : `https://${college.colg_website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#1976d2",
                          fontSize: "0.65rem",
                          textDecoration: "none",
                          display: "block",
                          lineHeight: 1.3,
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        🌐{" "}
                        {college.colg_website.length > 20
                          ? `${college.colg_website.substring(0, 20)}...`
                          : college.colg_website}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          color: "#9ca3af",
                          fontSize: "0.65rem",
                          fontStyle: "italic",
                        }}
                      >
                        No website
                      </Typography>
                    )}
                  </TableCell>

                  {/* Contacts - Show count and button */}
                  <TableCell
                    align="center"
                    sx={{
                      color: "#374151",
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Chip
                        label={`${college.contacts?.length || 0} Contacts`}
                        size="small"
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontSize: "0.65rem",
                          height: 20,
                        }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewContacts(college)}
                        sx={{
                          fontSize: "0.65rem",
                          padding: "2px 8px",
                          minWidth: "auto",
                          borderRadius: 1,
                          textTransform: "none",
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                          },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </TableCell>

                  {/* Actions */}
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #f3f4f6",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    <IconButton
                      onClick={() => onEdit(college)}
                      size="small"
                      sx={{
                        color: "#1976d2",
                        padding: "4px",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      <EditIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{
                    py: 6,
                    color: "#6b7280",
                    fontSize: "0.9rem",
                  }}
                >
                  {searchTerm
                    ? `No colleges found matching "${searchTerm}"`
                    : "No college data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            "& .MuiTablePagination-selectLabel": {
              fontSize: "0.75rem",
              color: "#6b7280",
            },
            "& .MuiTablePagination-displayedRows": {
              fontSize: "0.75rem",
              color: "#6b7280",
            },
            "& .MuiTablePagination-select": {
              fontSize: "0.75rem",
            },
            "& .MuiIconButton-root": {
              color: "#6b7280",
              padding: "6px",
            },
            "& .MuiTablePagination-toolbar": {
              minHeight: { xs: 48, sm: 52 },
              paddingLeft: { xs: 1, sm: 2 },
              paddingRight: { xs: 1, sm: 2 },
            },
          }}
        />
      </TableContainer>

      {/* Results Summary */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            fontSize: "0.75rem",
          }}
        >
          Showing {filteredData.length} of {collegeData.length} colleges
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>

        {collegeData.length > 0 && (
          <Chip
            label={`Total: ${collegeData.length} Records`}
            size="small"
            sx={{
              backgroundColor: "#e0f2fe",
              color: "#0277bd",
              fontSize: "0.7rem",
            }}
          />
        )}
      </Box>

      {/* Contact Information Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
            pb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "1rem",
                mb: 0.5,
              }}
            >
              Contact Information
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "0.8rem",
              }}
            >
              {selectedCollege?.colg_name}
            </Typography>
            {selectedCollege?.state && (
              <Chip
                label={selectedCollege.state}
                size="small"
                sx={{
                  backgroundColor: "#e0f2fe",
                  color: "#0277bd",
                  fontSize: "0.7rem",
                  height: 18,
                  mt: 0.5,
                }}
              />
            )}
          </Box>
          <IconButton
            onClick={handleCloseModal}
            size="small"
            sx={{
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "rgba(107, 114, 128, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 3,
            maxHeight: "60vh",
            overflowY: "auto",
            mt: 4,
          }}
        >
          {selectedCollege?.contacts && selectedCollege.contacts.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {selectedCollege.contacts.map((contact, index) => (
                <Box
                  key={contact.nonmen_id}
                  sx={{
                    backgroundColor: "#f8fafc",
                    padding: 2,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: "#1976d2",
                      mb: 1,
                    }}
                  >
                    {contact.designation}: {contact.contact_person_name}
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        lineHeight: 1.3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span>📧</span>
                      <span>{contact.email}</span>
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#6b7280",
                        lineHeight: 1.3,
                        fontFamily: "monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <span>📱</span>
                      <span>{contact.mob}</span>
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                No contacts available for this college
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
            p: 2,
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              fontSize: "0.8rem",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollegeDataTable;
