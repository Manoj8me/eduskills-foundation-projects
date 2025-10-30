import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import SearchForm from './SearchForm';
import ResultsTable from './ResultsTable';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#0088cc',
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f8f9fa',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function StudentStatusApp() {
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = (params) => {
    // Simulate API call delay
    setSearchParams(null); // Clear previous results to show loading state
    setTimeout(() => {
      setSearchParams(params);
    }, 800);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{  
          minHeight: '100vh',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
            },
            '100%': {
              opacity: 1,
            },
          },
        }}>
          <SearchForm onSearch={handleSearch} />
          {/* Only show results table after first search */}
          {searchParams !== null && (
            <ResultsTable searchParams={searchParams} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default StudentStatusApp;