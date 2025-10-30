import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Badge,
  Box,
  Collapse,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Icon } from "@iconify/react";
import { tokens } from "../../theme";
import { CustomPagination } from "../../components/common/pagination";

const Notification = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDetails, setOpenDetails] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const dummyData = {
    requested: [
      {
        id: 1,
        type: "Leave Request",
        date: "2024-05-01",
        status: "Pending",
        details: "Some details about the leave request...",
      },
      {
        id: 2,
        type: "Expense Reimbursement",
        date: "2024-05-02",
        status: "Approved",
        details: "Some details about the expense reimbursement...",
      },
      // Add more dummy data here if needed
    ],
    resolved: [
      {
        id: 3,
        type: "Bug Report",
        date: "2024-04-28",
        status: "Resolved",
        details: "Some details about the bug report...",
      },
      {
        id: 4,
        type: "Support Ticket",
        date: "2024-04-27",
        status: "Closed",
        details: "Some details about the support ticket...",
      },
      // Add more dummy data here if needed
    ],
    alert: [
      {
        id: 5,
        type: "System Alert",
        date: "2024-05-03",
        status: "Active",
        details: "Some details about the system alert...",
      },
      {
        id: 6,
        type: "Security Alert",
        date: "2024-05-04",
        status: "Resolved",
        details: "Some details about the security alert...",
      },
      // Add more dummy data here if needed
    ],
    message: [
      {
        id: 7,
        type: "New Message",
        date: "2024-05-05",
        status: "Unread",
        details: "Some details about the new message...",
      },
      {
        id: 8,
        type: "Notification",
        date: "2024-05-06",
        status: "Read",
        details: "Some details about the notification...",
      },
      // Add more dummy data here if needed
    ],
  };

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleDetails = (id) => {
    setOpenDetails(openDetails === id ? null : id);
  };

  const renderTable = (data) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ my: 1, py: 1 }}>ID</TableCell>
            <TableCell sx={{ my: 1, py: 1 }}>Type</TableCell>
            <TableCell sx={{ my: 1, py: 1 }}>Date</TableCell>
            <TableCell sx={{ my: 1, py: 1 }}>Status</TableCell>
            <TableCell sx={{ my: 1, py: 1 }}>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <TableCell sx={{ my: 0.8, py: 0.8 }}>{row.id}</TableCell>
                <TableCell sx={{ my: 0.8, py: 0.8 }}>{row.type}</TableCell>
                <TableCell sx={{ my: 0.8, py: 0.8 }}>{row.date}</TableCell>
                <TableCell sx={{ my: 0.8, py: 0.8 }}>{row.status}</TableCell>
                <TableCell sx={{ my: 0.8, py: 0.8 }}>
                  <Badge
                    // badgeContent=""
                    color="primary"
                    onClick={() => toggleDetails(row.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <ExpandMoreIcon
                      style={{
                        transform:
                          openDetails === row.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={5}
                >
                  <Collapse
                    in={openDetails === row.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box margin={1}>
                      <Typography variant="body1">{row.details}</Typography>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Helmet>
        <title>Notifications | EduSkills</title>
      </Helmet>
      <Container maxWidth="xl" style={{ marginTop: 20 }}>
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          Welcome back to Notifications!
        </Typography>
        <Box
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          <Tabs value={currentTab} onChange={handleChange} variant="fullWidth">
            {/* <Tab label="Requested" /> */}
            <Tab
              icon={
                <Badge
                  badgeContent={dummyData.requested.length}
                  color="warning"
                >
                  <Icon
                    icon={"carbon:mobile-request"}
                    height={20}
                    style={{
                      color: currentTab === 0 ? colors.blueAccent[200] : "grey",
                    }}
                  />
                </Badge>
              }
              label="Requested"
            />
            <Tab
              icon={
                <Badge
                  badgeContent={dummyData.resolved.length}
                  color="secondary"
                >
                  <Icon
                    icon={"oui:security-signal-resolved"}
                    height={20}
                    style={{
                      color: currentTab === 1 ? colors.blueAccent[200] : "grey",
                    }}
                  />
                </Badge>
              }
              label="Resolved"
            />
            <Tab
              icon={
                <Badge badgeContent={dummyData.alert.length} color="error">
                  <Icon
                    icon={"heroicons:bell-alert-solid"}
                    height={20}
                    style={{
                      color: currentTab === 2 ? colors.blueAccent[200] : "grey",
                    }}
                  />
                </Badge>
              }
              label="Alert"
            />
            <Tab
              icon={
                <Badge badgeContent={dummyData.message.length} color="info">
                  <Icon
                    icon={"uim:comment-alt-message"}
                    height={20}
                    style={{
                      color: currentTab === 3 ? colors.blueAccent[200] : "grey",
                    }}
                  />
                </Badge>
              }
              label="Message"
            />
          </Tabs>
          <Box p={3}>
            {currentTab === 0 && renderTable(dummyData.requested)}
            {currentTab === 1 && renderTable(dummyData.resolved)}
            {currentTab === 2 && renderTable(dummyData.alert)}
            {currentTab === 3 && renderTable(dummyData.message)}
          </Box>
        </Box>
        <CustomPagination
          setRowsPerPage={setRowsPerPage}
          rowsPerPage={rowsPerPage}
          count={4}
          page={page}
          setPage={setPage}
        />
      </Container>
    </>
  );
};

export default Notification;
