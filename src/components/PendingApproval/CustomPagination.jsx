import React, { useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  styled,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  NavigateNext,
  NavigateBefore,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(1),
  },
}));

const PageNavigation = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
}));

const PageButton = styled(IconButton)(({ theme, active }) => ({
  width: "28px",
  height: "28px",
  borderRadius: "4px",
  fontSize: "0.75rem",
  fontWeight: active ? 600 : 400,
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.primary.light + "30" : "transparent",
  "&:hover": {
    backgroundColor: active
      ? theme.palette.primary.light + "50"
      : theme.palette.action.hover,
  },
}));

const PageInfo = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
}));

const JumpContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 1),
    fontSize: "0.75rem",
    width: "40px",
  },
}));

const RowsPerPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(1),
  },
}));

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [jumpPageValue, setJumpPageValue] = useState("");

  // Calculate total pages
  const totalPages = Math.ceil(count / rowsPerPage) || 1;

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(null, newPage);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event);
  };

  // Handle jump to page
  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpPageValue, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(null, pageNumber - 1); // Adjust for 0-based index
      setJumpPageValue("");
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(0);

      // Calculate range of pages around current page
      const leftOffset = Math.floor((maxVisiblePages - 3) / 2);
      const rightOffset = Math.ceil((maxVisiblePages - 3) / 2);

      let startPage = Math.max(1, page - leftOffset);
      let endPage = Math.min(totalPages - 2, page + rightOffset);

      // Adjust start and end if current page is near the edges
      if (page < leftOffset + 1) {
        endPage = Math.min(totalPages - 2, maxVisiblePages - 2);
      } else if (page > totalPages - rightOffset - 2) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Add ellipsis before middle pages if needed
      if (startPage > 1) {
        pageNumbers.push(-1); // use -1 to indicate ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis after middle pages if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push(-2); // use -2 to indicate second ellipsis
      }

      // Always show last page
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Calculate displayed rows range
  const from = page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  return (
    <PaginationContainer>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <PageInfo>
          Showing {count > 0 ? from : 0}-{to} of {count} records
        </PageInfo>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RowsPerPageContainer>
            <Typography variant="caption">Rows per page:</Typography>
            <FormControl variant="standard" size="small">
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                sx={{ fontSize: "0.75rem", minWidth: "60px" }}
              >
                {[5, 10, 25, 50].map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </RowsPerPageContainer>

          <PageNavigation>
            <Tooltip title="First page">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                >
                  <FirstPage fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Previous page">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <NavigateBefore fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            {pageNumbers.map((pageNum, index) => {
              if (pageNum === -1) {
                return (
                  <Typography
                    key={`ellipsis-1-${index}`}
                    variant="caption"
                    sx={{ mx: 0.5 }}
                  >
                    ...
                  </Typography>
                );
              } else if (pageNum === -2) {
                return (
                  <Typography
                    key={`ellipsis-2-${index}`}
                    variant="caption"
                    sx={{ mx: 0.5 }}
                  >
                    ...
                  </Typography>
                );
              } else {
                return (
                  <PageButton
                    key={`page-${pageNum}`}
                    size="small"
                    active={page === pageNum ? 1 : 0}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum + 1}
                  </PageButton>
                );
              }
            })}

            <Tooltip title="Next page">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  <NavigateNext fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Last page">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                >
                  <LastPage fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            {!isMobile && (
              <JumpContainer>
                {/* <Typography variant="caption">Go to:</Typography> */}
                {/* <StyledTextField
                  size="small"
                  value={jumpPageValue}
                  onChange={(e) => setJumpPageValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleJumpToPage();
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: totalPages,
                    type: "number",
                  }}
                /> */}
                <Tooltip title="Jump to page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleJumpToPage}
                      disabled={!jumpPageValue}
                    >
                      <KeyboardDoubleArrowRight fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </JumpContainer>
            )}
          </PageNavigation>
        </Box>
      </Box>
    </PaginationContainer>
  );
};

export default CustomPagination;
