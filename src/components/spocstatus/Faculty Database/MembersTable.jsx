import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Paper,
  Chip,
  Collapse,
  Skeleton,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FileCopy as FileCopyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Enhanced Material UI Blue colors
const BLUE = {
  solight: "#EEF7FE",
  light: "#1976D2",
  main: "#2196F3",
  dark: "#1565C0",
  white: "#FFFFFF",
  gradient: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
  gradientDark: "linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)",
};

// Skeleton Row Component
const SkeletonRow = ({
  isDarkMode,
  showCheckbox = false,
  showBranch = false,
  showStatus = false,
  showActions = false,
}) => (
  <TableRow>
    {/* Checkbox column */}
    {showCheckbox && (
      <TableCell sx={{ padding: "12px 16px", width: "40px" }}>
        <Skeleton
          variant="rectangular"
          width={18}
          height={18}
          sx={{ borderRadius: "3px" }}
        />
      </TableCell>
    )}

    {/* Staff Member - 16% */}
    <TableCell sx={{ padding: "12px 16px", width: "16%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width="60%" height={16} sx={{ ml: 1.5 }} />
      </Box>
    </TableCell>

    {/* Email - 16% */}
    <TableCell sx={{ padding: "12px 16px", width: "16%" }}>
      <Skeleton variant="text" width="80%" height={16} />
    </TableCell>

    {/* Mobile - 12% */}
    <TableCell sx={{ padding: "12px 16px", width: "12%" }}>
      <Skeleton variant="text" width="70%" height={16} />
    </TableCell>

    {/* Branch - 12% (only for DSPOC) */}
    {showBranch && (
      <TableCell sx={{ padding: "12px 16px", width: "12%" }}>
        <Skeleton variant="text" width="85%" height={16} />
      </TableCell>
    )}

    {/* Designation - Adjusted width */}
    <TableCell
      sx={{
        padding: "12px 16px",
        width: showBranch ? "12%" : "14%",
      }}
    >
      <Skeleton variant="text" width="75%" height={16} />
    </TableCell>

    {/* First Sign In - 12% */}
    <TableCell sx={{ padding: "12px 16px", width: "12%" }}>
      <Skeleton variant="text" width="85%" height={16} />
    </TableCell>

    {/* Last Sign In - 12% */}
    <TableCell sx={{ padding: "12px 16px", width: "12%" }}>
      <Skeleton variant="text" width="85%" height={16} />
    </TableCell>

    {/* Status - 8% (only for Faculty and Leaders/DSPOC) */}
    {showStatus && (
      <TableCell sx={{ padding: "12px 16px", width: "8%" }}>
        <Skeleton
          variant="rectangular"
          width={60}
          height={20}
          sx={{ borderRadius: "10px" }}
        />
      </TableCell>
    )}

    {/* Actions - 80px (only for Faculty and Leaders/DSPOC) */}
    {showActions && (
      <TableCell
        sx={{ padding: "12px 16px", width: "80px", textAlign: "center" }}
      >
        <Skeleton variant="circular" width={24} height={24} />
      </TableCell>
    )}
  </TableRow>
);

const MembersTable = ({
  loading = false,
  members = [],
  isDarkMode = false,
  isFacultyTab = false,
  isDSPOCTab = false,
  isLeaderOrDspocTab = false,
  shouldShowAddButton = false,
  expandedRows = new Set(),
  facultyActions = null,
  leaderDspocActions = null,
  formatDate = () => "N/A",
  formatBranchName = () => "N/A",
  getRemainingBranchCount = () => 0,
  toggleRowExpansion = () => {},
  handleCopyIndividualEmail = () => {},
  handleAddEducator = () => {},
  getAvatarColor = () => BLUE.light,
  getTextColor = () => "#212121",
  getRoleDisplayName = () => "",
  getCurrentTabType = () => "",
}) => {
  // Calculate minimum table width based on columns
  const getMinTableWidth = () => {
    let baseWidth = 900; // Base width for core columns

    if (isFacultyTab || isLeaderOrDspocTab) {
      baseWidth += 128; // Add width for checkbox (40px) + status (88px)
    }

    if (isDSPOCTab) {
      baseWidth += 120; // Add width for branch column
    }

    if (isFacultyTab || isLeaderOrDspocTab) {
      baseWidth += 80; // Add width for actions column
    }

    return baseWidth;
  };

  if (loading) {
    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: isDarkMode
            ? "rgba(255, 255, 255, 0.12)"
            : "rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "white",
          // Add horizontal scroll for small screens
          overflowX: "auto",
          "& .MuiTable-root": {
            minWidth: getMinTableWidth(),
          },
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                  whiteSpace: "nowrap", // Prevent header text wrapping
                },
              }}
            >
              <TableCell
                sx={{
                  width: "16%",
                  minWidth: "140px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  padding: "12px 16px",
                  letterSpacing: "0.3px",
                }}
              >
                NAME
              </TableCell>
              <TableCell
                sx={{
                  width: "16%",
                  minWidth: "160px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                EMAIL ADDRESS
              </TableCell>
              <TableCell
                sx={{
                  width: "12%",
                  minWidth: "100px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                MOBILE
              </TableCell>
              <TableCell
                sx={{
                  width: "14%",
                  minWidth: "120px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                  padding: "12px 16px",
                }}
              >
                DESIGNATION
              </TableCell>
              <TableCell
                sx={{
                  width: "12%",
                  minWidth: "120px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                FIRST SIGN IN
              </TableCell>
              <TableCell
                sx={{
                  width: "12%",
                  minWidth: "120px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                LAST SIGN IN
              </TableCell>
              <TableCell
                sx={{
                  width: "8%",
                  minWidth: "80px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                STATUS
              </TableCell>
              <TableCell
                sx={{
                  width: "80px",
                  minWidth: "80px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                  textAlign: "center",
                }}
              >
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <SkeletonRow
                key={index}
                isDarkMode={isDarkMode}
                showCheckbox={false}
                showBranch={false}
                showStatus={true}
                showActions={true}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: isDarkMode
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.06)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "white",
        // Add horizontal scroll for small screens
        overflowX: "auto",
        "& .MuiTable-root": {
          minWidth: getMinTableWidth(),
        },
        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
          height: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#c1c1c1",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: isDarkMode
              ? "rgba(255, 255, 255, 0.3)"
              : "#a1a1a1",
          },
        },
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              background: isDarkMode ? BLUE.gradientDark : BLUE.gradient,
              "& .MuiTableCell-root": {
                borderBottom: "none",
                whiteSpace: "nowrap", // Prevent header text wrapping
              },
            }}
          >
            {/* Checkbox column - Show for Faculty and Leaders/DSPOC tabs */}
            {(isFacultyTab || isLeaderOrDspocTab) &&
              (isFacultyTab
                ? facultyActions?.renderHeaderCheckbox?.(members)
                : leaderDspocActions?.renderHeaderCheckbox?.(members))}

            <TableCell
              sx={{
                width: "16%",
                minWidth: "140px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                padding: "12px 16px",
                letterSpacing: "0.3px",
              }}
            >
              NAME
            </TableCell>
            <TableCell
              sx={{
                width: "16%",
                minWidth: "160px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.3px",
              }}
            >
              EMAIL ADDRESS
            </TableCell>
            <TableCell
              sx={{
                width: "12%",
                minWidth: "100px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.3px",
              }}
            >
              MOBILE
            </TableCell>
            {isDSPOCTab && (
              <TableCell
                sx={{
                  width: "12%",
                  minWidth: "120px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                BRANCH
              </TableCell>
            )}
            <TableCell
              sx={{
                width: isDSPOCTab ? "12%" : "14%",
                minWidth: "120px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.3px",
                padding: "12px 16px",
              }}
            >
              DESIGNATION
            </TableCell>
            <TableCell
              sx={{
                width: "12%",
                minWidth: "120px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.3px",
              }}
            >
              FIRST SIGN IN
            </TableCell>
            <TableCell
              sx={{
                width: "12%",
                minWidth: "120px",
                color: BLUE.white,
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.3px",
              }}
            >
              LAST SIGN IN
            </TableCell>
            {/* Status column - Show for Faculty and Leaders/DSPOC tabs */}
            {(isFacultyTab || isLeaderOrDspocTab) && (
              <TableCell
                sx={{
                  width: "8%",
                  minWidth: "80px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                }}
              >
                STATUS
              </TableCell>
            )}
            {/* Actions column - Show for Faculty and Leaders/DSPOC tabs */}
            {(isFacultyTab || isLeaderOrDspocTab) && (
              <TableCell
                sx={{
                  width: "80px",
                  minWidth: "80px",
                  color: BLUE.white,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  letterSpacing: "0.3px",
                  textAlign: "center",
                }}
              >
                ACTIONS
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {members.length > 0 ? (
            members.map((member, index) => {
              const isItemSelected = isFacultyTab
                ? facultyActions?.isSelected?.(member.id)
                : isLeaderOrDspocTab
                ? leaderDspocActions?.isSelected?.(member.id)
                : false;
              const isRowExpanded = expandedRows.has(member.id);
              const remainingBranches = getRemainingBranchCount(
                member.branch_name
              );

              return (
                <TableRow
                  key={member.id}
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                  sx={{
                    "&:hover": {
                      backgroundColor: isDarkMode
                        ? "rgba(25, 118, 210, 0.06)"
                        : "rgba(25, 118, 210, 0.03)",
                      transform: "translateY(-0.5px)",
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                    },
                    opacity:
                      (isFacultyTab || isLeaderOrDspocTab) &&
                      (member.active === 0 || member.active === false)
                        ? 0.6
                        : 1,
                    borderBottom:
                      index === members.length - 1
                        ? "none"
                        : `1px solid ${
                            isDarkMode
                              ? "rgba(255, 255, 255, 0.06)"
                              : "rgba(0, 0, 0, 0.03)"
                          }`,
                    transition: "all 0.2s ease",
                    backgroundColor: isItemSelected
                      ? isDarkMode
                        ? "rgba(25, 118, 210, 0.08)"
                        : "rgba(25, 118, 210, 0.04)"
                      : "transparent",
                  }}
                >
                  {/* Checkbox column */}
                  {isFacultyTab && facultyActions?.renderRowCheckbox?.(member)}
                  {isLeaderOrDspocTab &&
                    leaderDspocActions?.renderRowCheckbox?.(member)}

                  {/* Staff Member - 16% */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: "16%",
                      minWidth: "140px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(member.initial),
                          color: getTextColor(member.initial),
                          width: 32,
                          height: 32,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          border: "1.5px solid white",
                          flexShrink: 0,
                        }}
                      >
                        {member.initial}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 1.5,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.87)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {member.name && member.name.trim() !== ""
                          ? member.name
                          : "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Email - 16% */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: "16%",
                      minWidth: "160px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : "rgba(0, 0, 0, 0.6)",
                          fontWeight: 500,
                          fontSize: "0.8rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {member.email && member.email.trim() !== ""
                          ? member.email
                          : "N/A"}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyIndividualEmail(member.email)}
                        disabled={
                          !member.email ||
                          member.email.trim() === "" ||
                          member.email === "N/A"
                        }
                        sx={{
                          color: BLUE.main,
                          visibility: "hidden",
                          opacity: 0,
                          transition: "all 0.2s ease",
                          padding: "4px",
                          flexShrink: 0,
                          ".MuiTableRow-root:hover &": {
                            visibility:
                              member.email &&
                              member.email.trim() !== "" &&
                              member.email !== "N/A"
                                ? "visible"
                                : "hidden",
                            opacity:
                              member.email &&
                              member.email.trim() !== "" &&
                              member.email !== "N/A"
                                ? 1
                                : 0,
                          },
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <FileCopyIcon sx={{ fontSize: "16px" }} />
                      </IconButton>
                    </Box>
                  </TableCell>

                  {/* Mobile - 12% */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: "12%",
                      minWidth: "100px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.6)",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.mobile && member.mobile.trim() !== ""
                        ? member.mobile
                        : "N/A"}
                    </Typography>
                  </TableCell>

                  {/* Branch - Only show for DSPOC tab - Enhanced with expansion - 12% */}
                  {isDSPOCTab && (
                    <TableCell
                      sx={{
                        padding: "12px 16px",
                        width: "12%",
                        minWidth: "120px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: isDarkMode
                              ? "rgba(255, 255, 255, 0.7)"
                              : "rgba(0, 0, 0, 0.6)",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatBranchName(
                            member.branch_name,
                            member.id,
                            isRowExpanded
                          )}
                        </Typography>

                        {/* Show "more" button only if there are more than 2 branches */}
                        {remainingBranches > 0 && (
                          <Chip
                            label={
                              isRowExpanded
                                ? "less"
                                : `+${remainingBranches} more`
                            }
                            size="small"
                            clickable
                            onClick={() => toggleRowExpansion(member.id)}
                            icon={
                              isRowExpanded ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )
                            }
                            sx={{
                              height: "20px",
                              fontSize: "0.7rem",
                              fontWeight: 500,
                              backgroundColor: isDarkMode
                                ? "rgba(33, 150, 243, 0.15)"
                                : BLUE.solight,
                              color: isDarkMode ? BLUE.light : BLUE.dark,
                              borderColor: "transparent",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              flexShrink: 0,
                              "&:hover": {
                                backgroundColor: isDarkMode
                                  ? "rgba(33, 150, 243, 0.25)"
                                  : "rgba(33, 150, 243, 0.1)",
                                transform: "scale(1.05)",
                              },
                              "& .MuiChip-icon": {
                                fontSize: "14px",
                                marginLeft: "4px",
                                marginRight: "-2px",
                              },
                            }}
                          />
                        )}
                      </Box>

                      {/* Collapsible content for expanded view */}
                      {isDSPOCTab && remainingBranches > 0 && (
                        <Collapse
                          in={isRowExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              mt: 1,
                              pt: 1,
                              borderTop: `1px solid ${
                                isDarkMode
                                  ? "rgba(255, 255, 255, 0.1)"
                                  : "rgba(0, 0, 0, 0.1)"
                              }`,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDarkMode
                                  ? "rgba(255, 255, 255, 0.6)"
                                  : "rgba(0, 0, 0, 0.5)",
                                fontWeight: 400,
                                fontSize: "0.75rem",
                                lineHeight: 1.3,
                              }}
                            >
                              {formatBranchName(
                                member.branch_name,
                                member.id,
                                true
                              )}
                            </Typography>
                          </Box>
                        </Collapse>
                      )}
                    </TableCell>
                  )}

                  {/* Designation - Adjusted width */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: isDSPOCTab ? "12%" : "14%",
                      minWidth: "120px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.6)",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {member.designation && member.designation.trim() !== ""
                        ? member.designation
                        : "N/A"}
                    </Typography>
                  </TableCell>

                  {/* First Sign In - 12% (for all tabs) */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: "12%",
                      minWidth: "120px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.6)",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(member.first_login)}
                    </Typography>
                  </TableCell>

                  {/* Last Sign In - 12% (for all tabs) */}
                  <TableCell
                    sx={{
                      padding: "12px 16px",
                      width: "12%",
                      minWidth: "120px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.6)",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        textTransform: "uppercase",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(member.last_login)}
                    </Typography>
                  </TableCell>

                  {/* Status - Show for Faculty and Leaders/DSPOC tabs - 8% */}
                  {isFacultyTab && facultyActions?.renderStatusColumn?.(member)}
                  {isLeaderOrDspocTab &&
                    leaderDspocActions?.renderStatusColumn?.(member)}

                  {/* Actions - Show for Faculty and Leaders/DSPOC tabs - 80px */}
                  {isFacultyTab &&
                    facultyActions?.renderActionsColumn?.(member)}
                  {isLeaderOrDspocTab &&
                    leaderDspocActions?.renderActionsColumn?.(member)}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={
                  isFacultyTab || isLeaderOrDspocTab
                    ? isDSPOCTab
                      ? 10 // checkbox + name + email + mobile + branch + designation + first_login + last_login + status + actions
                      : 9 // checkbox + name + email + mobile + designation + first_login + last_login + status + actions
                    : isDSPOCTab
                    ? 7 // name + email + mobile + branch + designation + first_login + last_login
                    : 6 // name + email + mobile + designation + first_login + last_login
                }
                align="center"
                sx={{ py: 4 }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <SearchIcon
                    sx={{
                      fontSize: 40,
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)",
                      mb: 1.5,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.5)"
                        : "rgba(0, 0, 0, 0.5)",
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: "1rem",
                    }}
                  >
                    No {getRoleDisplayName(getCurrentTabType()).toLowerCase()}{" "}
                    found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(0, 0, 0, 0.4)",
                      fontSize: "0.8rem",
                      mb: 2,
                    }}
                  >
                    {members.length === 0
                      ? `No ${getRoleDisplayName(
                          getCurrentTabType()
                        ).toLowerCase()} have been added yet.`
                      : "Try adjusting your search criteria or filters"}
                  </Typography>
                  {/* Show Add button in empty state for addable tabs */}
                  {shouldShowAddButton && members.length === 0 && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddEducator}
                      size="small"
                      sx={{
                        borderRadius: "24px",
                        px: 3,
                        py: 1,
                        background: isDarkMode
                          ? BLUE.gradientDark
                          : BLUE.gradient,
                        boxShadow: "0 4px 10px rgba(33, 150, 243, 0.3)",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        "&:hover": {
                          background: isDarkMode
                            ? BLUE.gradient
                            : BLUE.gradientDark,
                          boxShadow: "0 6px 15px rgba(33, 150, 243, 0.4)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Add {getRoleDisplayName(getCurrentTabType())}
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MembersTable;
