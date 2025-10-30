


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material';
import { getAcademyWeeks, addAcademyWeek, updateAcademyWeek } from './api';

const WeekManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { domain } = location.state || {}; 
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({ 
    weekSubject: '', 
    weekSequenceNumber: '' 
  });
  const [editWeekId, setEditWeekId] = useState(null);

  // Get domainNumber from domain object
  const getDomainNumber = () => {
    return domain?.domainNumber || domain?.domain_id;
  };

  useEffect(() => {
    const fetchWeeks = async () => {
      const domainNumber = getDomainNumber();
      if (!domainNumber) {
        setError('No domain provided');
        setLoading(false);
        return;
      }
      
      try {
        const response = await getAcademyWeeks(domainNumber);
        if (response && response.academyWeeks) {
          setWeeks(response.academyWeeks);
        } else {
          setWeeks([]);
        }
      } catch (error) {
        console.error("Error fetching weeks:", error);
        setError('Failed to load weeks');
        setWeeks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWeeks();
  }, [domain]);

  const handleAddWeek = () => {
    setEditWeekId(null);
    setFormData({ 
      weekSubject: '', 
      weekSequenceNumber: '' 
    });
    setOpenForm(true);
  };

  const handleEdit = (week) => {
    setEditWeekId(week.week_id);
    setFormData({ 
      weekSubject: week.week_subject, 
      weekSequenceNumber: week.week_sequence_number.toString() 
    });
    setOpenForm(true);
  };

  const handleView = (weekId) => {
    navigate(`/modules/${weekId}`, { state: { domain } });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'weekSequenceNumber' ? parseInt(value) || '' : value 
    }));
  };

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.weekSubject.trim()) {
      setError('Week name is required');
      return;
    }
    
    if (!formData.weekSequenceNumber || formData.weekSequenceNumber <= 0) {
      setError('Please enter a valid sequence number');
      return;
    }

    const domainNumber = getDomainNumber();
    if (!domainNumber) {
      setError('Domain information is missing');
      return;
    }

    try {
      if (editWeekId) {
        // Update existing week - using weekNumber for update endpoint
        const updateData = {
          weekNumber: editWeekId, // This is week_id for update
          weekSequenceNumber: parseInt(formData.weekSequenceNumber),
          weekSubject: formData.weekSubject
        };
        await updateAcademyWeek(updateData);
        setSuccess('Week updated successfully!');
      } else {
        // Add new week
        const addData = {
          domainNumber: domainNumber,
          weekSequenceNumber: parseInt(formData.weekSequenceNumber),
          weekSubject: formData.weekSubject,
          isActive: "1" // Default to active
        };
        await addAcademyWeek(addData);
        setSuccess('Week added successfully!');
      }

      // Refresh weeks after successful submission
      const response = await getAcademyWeeks(domainNumber);
      setWeeks(response.academyWeeks || []);
      setOpenForm(false);
      setFormData({ weekSubject: '', weekSequenceNumber: '' });
      
    } catch (error) {
      console.error("Error submitting week:", error);
      setError(`Failed to ${editWeekId ? 'update' : 'add'} week: ${error.message}`);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
          {/* Domain Info for debugging */}
          {domain && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Current Domain: {domain.domainName || domain.domain_name} (ID: {getDomainNumber()})
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              flexDirection: isMobile ? 'column' : 'row', 
              gap: isMobile ? 2 : 0,
            }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Week Management
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddWeek}
              sx={{
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' },
                fontWeight: 'semibold',
                py: 1.5,
                px: 3,
                borderRadius: 1,
                boxShadow: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              Add Week
            </Button>
          </Box>

          {loading ? (
            <Typography variant="body1">Loading weeks...</Typography>
          ) : weeks.length === 0 ? (
            <Typography variant="body1">No weeks found for this domain.</Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1, overflow: 'hidden' }}>
              <Table sx={{ minWidth: 650 }} aria-label="week management table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Sequence No.</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Week Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Created Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', textTransform: 'uppercase', py: 2 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weeks.map((week) => (
                    <TableRow key={week.week_id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                      <TableCell sx={{ py: 2 }}>{week.week_sequence_number}</TableCell>
                      <TableCell sx={{ py: 2 }}>{week.week_subject}</TableCell>
                      <TableCell sx={{ py: 2 }}>{formatDate(week.created_at)}</TableCell>
                      <TableCell align="center" sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleView(week.week_id)}
                            sx={{ 
                              bgcolor: 'primary.main', 
                              '&:hover': { bgcolor: 'primary.dark' }, 
                              textTransform: 'none', 
                              fontWeight: 'medium', 
                              px: 2 
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(week)}
                            sx={{ 
                              bgcolor: 'warning.main', 
                              color: 'grey.800', 
                              '&:hover': { bgcolor: 'warning.dark' }, 
                              textTransform: 'none', 
                              fontWeight: 'medium', 
                              px: 2 
                            }}
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Add/Edit Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editWeekId ? 'Edit Week' : 'Add Week'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Week Name"
            name="weekSubject" // Changed to weekSubject
            value={formData.weekSubject}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            label="Sequence Number"
            name="weekSequenceNumber"
            type="number"
            value={formData.weekSequenceNumber}
            onChange={handleFormChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            {editWeekId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars for notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WeekManagement;