import React from 'react';
import { Box, IconButton, Typography, useTheme, Button } from '@mui/material';
import { FirstPage, LastPage, NavigateNext, NavigateBefore } from '@mui/icons-material';
import { tokens } from "../../theme";

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25]
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const totalPages = Math.ceil(count / rowsPerPage);

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show on each side of current page
    let pages = [];
    
    if (totalPages <= 5) {
      // If total pages are 5 or less, show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, page - delta);
      let end = Math.min(totalPages - 1, page + delta);
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages in range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : '#fff',
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
          }}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton 
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <FirstPage />
        </IconButton>
        
        <IconButton 
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <NavigateBefore />
        </IconButton>

        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <Typography key={`ellipsis-${index}`} color="text.secondary">...</Typography>
          ) : (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant={page === pageNum ? 'contained' : 'outlined'}
              size="small"
              sx={{
                minWidth: '32px',
                height: '32px',
                padding: '0px',
                backgroundColor: page === pageNum ? colors.blueAccent[600] : 'transparent',
                borderColor: colors.blueAccent[600],
                color: page === pageNum ? 'white' : colors.blueAccent[600],
                '&:hover': {
                  backgroundColor: colors.blueAccent[700],
                  color: 'white',
                },
              }}
            >
              {pageNum}
            </Button>
          )
        ))}

        <IconButton 
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <NavigateNext />
        </IconButton>
        
        <IconButton 
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: colors.blueAccent[700],
            },
          }}
        >
          <LastPage />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary">
        {`${((page - 1) * rowsPerPage) + 1}-${Math.min(page * rowsPerPage, count)} of ${count}`}
      </Typography>
    </Box>
  );
};

export default CustomPagination;