// Place this file in components/modals/BulkDeleteModal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const BulkDeleteModal = ({ 
  open, 
  onClose, 
  selectedCount, 
  onConfirm, 
  isDeleting 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle color="#f44336" size={24} />
          <Typography variant="h6">Confirm Bulk Delete</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 2 }}>
          Are you sure you want to delete {selectedCount} selected students? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined" 
          color="inherit"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete Selected'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkDeleteModal;