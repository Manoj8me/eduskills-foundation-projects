import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  useTheme,
  TableContainer,
  useMediaQuery,
  Typography,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../../../theme";

const InstituteWise = ({ data, isLoading, errInstitute }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const maxHeight = isMobileScreen ? 405 : 285;
  // Sample data (replace this with your actual data)

  return (
    <Box>
      <TableContainer style={{ height: maxHeight }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  p: 1,
                  pl: 2,
                  textAlign: "left",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Institute Name
              </TableCell>
              <TableCell
                sx={{
                  p: 1,
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Applied
              </TableCell>
              <TableCell
                sx={{
                  p: 1,
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Shortlist
              </TableCell>
              <TableCell
                sx={{
                  p: 1,
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Certificate Verified
              </TableCell>
              <TableCell
                sx={{
                  p: 1,
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Assessment Completed
              </TableCell>
              <TableCell
                sx={{
                  p: 1,
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  backgroundColor: colors.blueAccent[800],
                }}
              >
                Internship Certificate Issued
              </TableCell>
            </TableRow>
          </TableHead>
          {data.length !== 0 && (
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { borderBottom: 0 },
                  }}
                >
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "left",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.title}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.applied}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.shortlist}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.inprogress}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.provisional}
                  </TableCell>
                  <TableCell
                    sx={{
                      p: 0.8,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: colors.blueAccent[900],
                    }}
                  >
                    {row.completed}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {data.length === 0 && (
          <Box
            sx={{
              display: "flex",
              width: "100%", // Set width to "100%" to take up full width
              justifyContent: "center",
              alignItems: "center",
              height: maxHeight - 55,
              bgcolor: colors.blueAccent[900],
            }}
          >
            {isLoading ? (
              <CircularProgress color="info" />
            ) : errInstitute ? (
              <Typography>{errInstitute}</Typography>
            ) : (
              <Typography>Oops! Institute Not Found</Typography>
            )}
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default InstituteWise;
