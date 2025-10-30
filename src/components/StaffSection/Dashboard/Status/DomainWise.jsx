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

const DomainWise = ({ data, isLoading, errDomain }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const maxHeight = isMobileScreen ? 405 : 285;

  const headers = [
    { id: "title", label: "Domain Name" },
    { id: "applied", label: "APPLIED" },
    { id: "shortlist", label: "SHORTLIST" },
    { id: "inprogress", label: "CERTIFICATE VERIFIED" },
    { id: "provisional", label: "ASSESSMENT COMPLETED" },
    { id: "completed", label: "INTERNSHIP CERTIFICATE ISSUED" },
  ];

  return (
    <Box>
      <TableContainer style={{ height: maxHeight }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{
                    p: 1,
                    pl: header.id === "title" ? 2 : 1,
                    textAlign: header.id === "title" ? "left" : "center",
                    position: "sticky",
                    top: 0,
                    backgroundColor: colors.blueAccent[800],
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
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
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: maxHeight - 55,
              bgcolor: colors.blueAccent[900],
            }}
          >
            {isLoading ? (
              <CircularProgress color="info" />
            ) : errDomain ? (
              <Typography>{errDomain}</Typography>
            ) : (
              <Typography>Oops! Domain Not Found</Typography>
            )}
          </Box>
        )}
      </TableContainer>
    </Box>
  );
};

export default DomainWise;
