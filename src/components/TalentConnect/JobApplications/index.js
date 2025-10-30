import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Card,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { DataSearch } from "./dataSearch";
import Widgets from "./Widgets";
import CustomTable from "./CustomTable";
import Resume from "./Resume";
import { TalentConnectService } from "../../../services/dataService";

const JobApplications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState();
  const [column, setColumns] = useState();
  const [pagination, setPagination] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [refresh, setRefresh] = useState(false);
  const [exportData, setExportData] = useState({});
  const [resumeData, setResumeData] = useState({});
  const [open, setOpen] = useState(false); // State to manage modal visibility
  const [onSelect, setOnSelect] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);

  

  const userId =
    tableData && tableData.length > 0 ? tableData[0].user_id : null;
    

  const TABLE_HEAD = [
    { id: "sl_no", label: "#" },
    { id: "user_name", label: "Full Name", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "status", label: "Status", alignRight: false },
    { id: "", label: "Action", alignRight: true },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const profile =
    typeof resumeData?.profile === "string"
      ? JSON.parse(resumeData.profile)
      : resumeData?.profile;

  return (
    <>
      <Helmet>
        <title> Job Applications | EduSkills </title>
      </Helmet>

      <Container maxWidth="xl" sx={{ my: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold", color: colors.blueAccent[300] }}
          >
            Welcome back to Job Applications!
          </Typography>
        </Box>

        <Box px={4} bgcolor={colors.blueAccent[900]}></Box>
        {/* <Widgets
          setErrorMsg={setErrorMsg}
          refresh={refresh}
          setRefresh={setRefresh}
        /> */}
        <Box m="0px auto" position="relative">
          <Box>
            <DataSearch
              setTableData={setTableData}
              setColumns={setColumns}
              tableData={tableData}
              page={page}
              setPagination={setPagination}
              loading={loading}
              setLoading={setLoading}
              setErrorMsg={setErrorMsg}
              setTableLoading={setTableLoading}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setRefresh={setRefresh}
              refresh={refresh}
              setExportData={setExportData}
              onSelect={onSelect}
            />
          </Box>
        </Box>
        {tableData?.length > 0 ? (
          <CustomTable
            TABLE_HEAD={TABLE_HEAD}
            tableData={tableData}
            setRowsPerPage={setPageSize}
            rowsPerPage={pageSize}
            count={pagination?.total_pages}
            page={pagination?.page - 1}
            setPage={setPage}
            tableLoading={tableLoading}
            setRefresh={setRefresh}
            refresh={refresh}
            exportData={exportData}
            setOnSelect={setOnSelect}
            setSelectedUserId={setSelectedUserId}
            setResumeData={(data) => {
              setResumeData(data);
              handleOpen();
            }}
          />
        ) : tableData?.length === 0 ? (
          <Card
            sx={{
              width: "100%",
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: colors.blueAccent[800],
            }}
          >
            <Typography variant="h5">
              No students were found. Please check back later.
            </Typography>
          </Card>
        ) : (
          !errorMsg && (
            <Box
              sx={{
                width: "100%",
                height: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="info" size={60} />
            </Box>
          )
        )}
        {errorMsg && (
          <Box
            sx={{
              bgcolor: colors.blueAccent[900],
              height: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 2,
              my: 2,
            }}
          >
            <Typography variant="h4" fontWeight={600}>
              {errorMsg}
            </Typography>
          </Box>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Resume
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Resume
              data={{
                profile: profile,
                objective: resumeData?.objective,
                education: resumeData?.education,
                skills: resumeData?.skills,
                internship: resumeData?.internship,
                aicte_internship:
                  resumeData?.aicte_eduskills_virtual_internship,
                projects: resumeData?.projects,
              }}
              userId={selectedUserId}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default JobApplications;
