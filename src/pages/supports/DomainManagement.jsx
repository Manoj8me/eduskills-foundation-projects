// import React, { useState, useEffect } from 'react';
// import {
//   Box, List, ListItem, ListItemText, Typography, CircularProgress, Alert,
//   Container, Button, IconButton, Divider, Dialog,
//   DialogTitle, DialogContent, DialogActions, Snackbar
// } from '@mui/material';
// import { Info as InfoIcon, Visibility as ViewIcon } from '@mui/icons-material';
// import { styled } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// import { getDomains } from './api'; // <-- import the API function
// import StudentPreview from './StudentPreview';
// // Styled Components
// const DomainListItem = styled(ListItem)(({ theme }) => ({
//   padding: theme.spacing(2),
//   border: `1px solid ${theme.palette.divider}`,
//   borderRadius: theme.shape.borderRadius,
//   marginBottom: theme.spacing(1),
//   transition: 'background-color 0.2s ease-in-out',
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//   },
// }));

// const DomainManagement = () => {
//   const navigate = useNavigate();
//   const [domains, setDomains] = useState([]);
//   const [filteredDomains, setFilteredDomains] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [typeFilter, setTypeFilter] = useState('all');
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, pending: 0 });

//   // ---------------- Fetch domains ----------------
//   const fetchDomains = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await getDomains();  // <-- Use the service API
//       if (data.domains && Array.isArray(data.domains)) {
//         setDomains(data.domains);
//         setFilteredDomains(data.domains);
//         calculateStats(data.domains);
//       } else if (data.message) {
//         setError(data.message);
//       } else {
//         setError('Invalid response from server');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load domains');
//       showSnackbar('Error loading domains', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (domainsList) => {
//     const stats = {
//       total: domainsList.length,
//       active: domainsList.filter(d => d.status === 'active').length,
//       inactive: domainsList.filter(d => d.status === 'inactive').length,
//       pending: domainsList.filter(d => d.status === 'pending').length,
//     };
//     setStats(stats);
//   };

//   useEffect(() => { fetchDomains(); }, []);

//   // --------------- Filters ----------------
//   useEffect(() => {
//     let results = domains;
//     if (searchTerm) {
//       results = results.filter(d =>
//         d.domain_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         d.domain_description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (statusFilter !== 'all') results = results.filter(d => d.status === statusFilter);
//     if (typeFilter !== 'all') results = results.filter(d => d.type === typeFilter);
//     setFilteredDomains(results);
//   }, [searchTerm, statusFilter, typeFilter, domains]);

//   const handleViewDetails = (domain) => {
//     // Navigate to week management page with domain data
//     navigate('/week', { state: { domain } });
//   };

//   const handleDomainSelect = (domain) => { setSelectedDomain(domain); setDialogOpen(true); };
//   const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
//   const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
//   const handleRefresh = () => { fetchDomains(); showSnackbar('Domains refreshed', 'info'); };

//   if (loading && domains.length === 0) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ mt: 2 }}>Loading domains...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchDomains}>Retry</Button>} sx={{ mb: 3 }}>{error}</Alert>}

//       {!loading && !error && (
//         <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
//           <Typography variant="body2" color="text.secondary">Showing {filteredDomains.length} of {domains.length} domains</Typography>
//           <Typography variant="body2" color="text.secondary">Last updated: {new Date().toLocaleTimeString()}</Typography>
//         </Box>
//       )}

//       {filteredDomains.length === 0 && !loading ? (
//         <Alert severity="info" sx={{ mt: 4 }}>No domains found matching your criteria.</Alert>
//       ) : (
//         <List>
//           {filteredDomains.map((domain, index) => (
//             <DomainListItem key={domain.domain_id || index}>
//               <ListItemText
//                 primary={
//                   <Typography variant="h6" component="h2" fontWeight="bold">
//                     {domain.domain_name || 'Unnamed Domain'}
//                   </Typography>
//                 }
//               />
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<ViewIcon />}
//                   onClick={() => handleViewDetails(domain)}
//                   size="small"
//                 >
//                   View Details
//                 </Button>
//               </Box>
//             </DomainListItem>
//           ))}
//         </List>
//       )}

//       {/* Domain Dialog */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
//         {selectedDomain && (
//           <>
//             <DialogTitle>{selectedDomain.domain_name}</DialogTitle>
//             <DialogContent>
//               <Typography variant="body1" paragraph>
//                 {selectedDomain.domain_description || 'No description available.'}
//               </Typography>
//               {selectedDomain.record_link && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography variant="h6" gutterBottom>
//                     Session Recordings:
//                   </Typography>
//                   <div dangerouslySetInnerHTML={{ __html: selectedDomain.record_link }} />
//                 </Box>
//               )}
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setDialogOpen(false)}>Close</Button>
//               <Button
//                 variant="contained"
//                 onClick={() => handleViewDetails(selectedDomain)}
//               >
//                 View Week Management
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default DomainManagement;

import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Info as InfoIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { getDomains } from "./api"; // <-- import the API function
import StudentPreview from "./StudentPreview";
// Styled Components
const DomainListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DomainManagement = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState([]);
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });

  // ---------------- Fetch domains ----------------
  const fetchDomains = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDomains(); // <-- Use the service API
      if (data.domains && Array.isArray(data.domains)) {
        setDomains(data.domains);
        setFilteredDomains(data.domains);
        calculateStats(data.domains);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load domains");
      showSnackbar("Error loading domains", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (domainsList) => {
    const stats = {
      total: domainsList.length,
      active: domainsList.filter((d) => d.status === "active").length,
      inactive: domainsList.filter((d) => d.status === "inactive").length,
      pending: domainsList.filter((d) => d.status === "pending").length,
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // --------------- Filters ----------------
  useEffect(() => {
    let results = domains;
    if (searchTerm) {
      results = results.filter(
        (d) =>
          d.domain_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.domain_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all")
      results = results.filter((d) => d.status === statusFilter);
    if (typeFilter !== "all")
      results = results.filter((d) => d.type === typeFilter);
    setFilteredDomains(results);
  }, [searchTerm, statusFilter, typeFilter, domains]);

  const handleViewDetails = (domain) => {
    // Navigate to week management page with domain data
    navigate("/week", { state: { domain } });
  };

  const handleStudentPreview = (domain) => {
    // Navigate to student preview page with domain data
    navigate("/studentPreview", { state: { domain } });
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setDialogOpen(true);
  };
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleRefresh = () => {
    fetchDomains();
    showSnackbar("Domains refreshed", "info");
  };

  if (loading && domains.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading domains...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchDomains}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredDomains.length} of {domains.length} domains
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      )}

      {filteredDomains.length === 0 && !loading ? (
        <Alert severity="info" sx={{ mt: 4 }}>
          No domains found matching your criteria.
        </Alert>
      ) : (
        <List>
          {filteredDomains.map((domain, index) => (
            <DomainListItem key={domain.domain_id || index}>
              <ListItemText
                primary={
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {domain.domain_name || "Unnamed Domain"}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {domain.domain_description || "No description available"}
                  </Typography>
                }
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => handleStudentPreview(domain)}
                  size="small"
                  color="secondary"
                >
                  Student Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDetails(domain)}
                  size="small"
                >
                  View Details
                </Button>
              </Box>
            </DomainListItem>
          ))}
        </List>
      )}

      {/* Domain Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDomain && (
          <>
            <DialogTitle>{selectedDomain.domain_name}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedDomain.domain_description ||
                  "No description available."}
              </Typography>
              {selectedDomain.record_link && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Session Recordings:
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedDomain.record_link,
                    }}
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
              <Button
                variant="outlined"
                onClick={() => handleStudentPreview(selectedDomain)}
              >
                Student Preview
              </Button>
              <Button
                variant="contained"
                onClick={() => handleViewDetails(selectedDomain)}
              >
                View Week Management
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DomainManagement;
