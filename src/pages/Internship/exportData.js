import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { InternshipService } from "../../services/dataService";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { tokens } from "../../theme";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearDomainList,
//   fetchDomainList,
//   setMounted,
// } from "../../store/Slices/dashboard/domainListSlice";
// import { useRef } from "react";

const ExportModal = ({ exportData, isApproval }) => {
  const [cohort, setCohort] = useState("");
  const [status, setStatus] = useState("");
  const [domain, setDomain] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportButtonDisabled, setExportButtonDisabled] = useState(true);
  const [downloadData, setDownLoadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todayDate, setTodayDate] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const statusName = isApproval
    ? [
        { id: 0, name: "Applied" },
        { id: 1, name: "Approved" },
        { id: 5, name: "Rejected" },
      ]
    : [
        { id: 0, name: "Applied" },
        { id: 1, name: "Shortlisted" },
        { id: 2, name: "Inprogress" },
        { id: 3, name: "Provisional" },
        { id: 4, name: "Completed" },
        { id: 5, name: "Rejected" },
        { id: 6, name: "Pending" },
      ];
  //...........................................
  // const dispatch = useDispatch();
  // const domainLists = useSelector((state) => state.domainList.domainList);
  // const isMounted = useSelector((state) => state.domainList.isMounted);

  // console.log(domainLists);
  // console.log(isMounted);

  // const isMountedRef = useRef(isMounted);

  // useEffect(() => {
  //   // isMounted.current = true;
  //   dispatch(setMounted(true));
  //   dispatch(fetchDomainList());
  //   return () => {
  //     console.log("Cleanup function executed");
  //     isMountedRef.current = false;
  //     dispatch(setMounted(false));

  //     setTimeout(() => {
  //       console.log("Timeout function executed");
  //       if (!isMountedRef.current) {
  //         if (isMounted) {
  //           dispatch(clearDomainList());
  //         }
  //       }
  //     }, 10000);
  //   };
  // }, [dispatch]);
  //..........................................
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setDownLoadData([]);
    setCohort("");
    setStatus("");
    setDomain("");
  };

  const domainList = exportData?.domainList;
  const cohortList = exportData?.cohortList?.filter(
    (cohort) => cohort.cohort_id !== 0
  );

  useEffect(() => {
    // Enable export button only if all fields are selected
    setExportButtonDisabled(
      isApproval ? !(status && domain) : !(cohort && status && domain)
    );
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    setTodayDate(formattedDate);
  }, [cohort, status, domain]);

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }
  //...............................
  const handleExport = async () => {
    // Add your export logic here
    // aprove 1 , applied 0, reject 5, all 6
    const domain_id = domainList?.filter(
      (item) => item.domain_name === domain
    )[0].domain_id;

    const cohort_id = cohortList?.filter(
      (item) => item.cohort_name === cohort
    )[0].cohort_id;

    const is_status = statusName?.filter((item) => item.name === status)[0].id;

    if (isApproval) {
      if (is_status !== undefined || null) {
        setIsLoading(true);
        try {
          const response = await InternshipService.internship_approval_export({
            domain_id,
            is_status,
          });
          const data = response.data.data;
          setDownLoadData(data);
          if (data.length === 0) {
            handleErrorMessage("No record found");
          }
        } catch (error) {
          console.error(error);
          handleErrorMessage(
            error.response.data.detail || "Error fetching data"
          );
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      if (cohort_id && (is_status !== undefined || null)) {
        setIsLoading(true);
        try {
          const response = await InternshipService.internship_export({
            domain_id,
            cohort_id,
            is_status,
          });
          const data = response.data.data;
          setDownLoadData(data);
          if (data.length === 0) {
            handleErrorMessage("No record found");
          }
        } catch (error) {
          console.error(error);
          handleErrorMessage(
            error.response.data.detail || "Error fetching data"
          );
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // const exportToExcel = () => {
  //   // Create a workbook and add a worksheet
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Sheet 1");
  //   // Add header row
  //   const headerRow = worksheet.addRow(Object.keys(downloadData[0]));
  //   // Add data rows
  //   downloadData.forEach((data) => {
  //     const values = Object.values(data);
  //     worksheet.addRow(values);
  //   });
  //   // Save the workbook as a blob
  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
  //     // Save the blob using FileSaver.js
  //     saveAs(blob, `EduSkills-Internship-${todayDate}.xlsx`);
  //   });
  //   closeModal();
  // };

  const exportToExcel = () => {
    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Function to capitalize the first letter of each word
    const capitalizeFirstLetter = (str) => {
      return str.replace(/(?:^|\s|_)\S/g, (match) => match.toUpperCase());
    };

    // Add header row with underscores removed and headers capitalized
    const headerRow = worksheet.addRow(
      Object.keys(downloadData[0]).map((header) =>
        capitalizeFirstLetter(header.replace(/_/g, " "))
      )
    );

    // Make the header row bold
    headerRow.font = { bold: true };

    // Add data rows
    downloadData.forEach((data) => {
      const values = Object.values(data);
      worksheet.addRow(values);
    });

    // Save the workbook as a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Save the blob using FileSaver.js
      saveAs(blob, `EduSkills-Internship-${todayDate}.xlsx`);
    });

    closeModal();
  };

  const exportToCSV = () => {
    // Convert data to CSV string
    const csvContent = downloadData.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`)
        .join(",")
    );

    const csvString = csvContent.join("\n");
    // Save as blob
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `EduSkills-Internship-${todayDate}.csv`);
    closeModal();
  };

  return (
    <div>
      <Button
        variant="outlined"
        size="small"
        color="info"
        sx={{ height: 22, textTransform: "capitalize" }}
        onClick={openModal}
      >
        Export
      </Button>
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle sx={{ pb: 1 }}>Export Data</DialogTitle>
        <DialogContent>
          <TextField
            label="Domain"
            select
            size="small"
            color="info"
            margin="normal"
            value={domain}
            disabled={isLoading}
            onChange={(event) => {
              setDomain(event.target.value);
              setDownLoadData([]);
            }}
            sx={{ width: 300 }}
          >
            {domainList?.map((name) => (
              <MenuItem
                key={name.domain_id}
                value={name.domain_name}
                sx={{ whiteSpace: "normal" }}
              >
                {name.domain_name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {!isApproval && (
              <TextField
                label="Cohort"
                select
                size="small"
                color="info"
                value={cohort}
                disabled={isLoading}
                onChange={(event) => {
                  setCohort(event.target.value);
                  setDownLoadData([]);
                }}
                margin="normal"
                sx={{ width: "100%", minWidth: 120, mr: 2 }}
              >
                {cohortList?.map((name) => (
                  <MenuItem key={name.cohort_id} value={name.cohort_name}>
                    {name.cohort_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Status"
              select
              size="small"
              margin="normal"
              color="info"
              disabled={isLoading}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setDownLoadData([]);
              }}
              sx={{
                width: "100%",
                minWidth: 120,
              }}
            >
              {statusName.map((name) => (
                <MenuItem key={name.id} value={name.name}>
                  {name.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, mb: 1 }}>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={closeModal}
            sx={{ textTransform: "capitalize" }}
          >
            Close
          </Button>
          {downloadData.length > 0 && (
            <Button
              size="small"
              color="info"
              variant="outlined"
              onClick={exportToCSV}
              disabled={exportButtonDisabled || isLoading}
              sx={{ textTransform: "capitalize" }}
            >
              export To CSV
              {/* Export */}
            </Button>
          )}
          <Button
            size="small"
            color="info"
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
            onClick={downloadData.length > 0 ? exportToExcel : handleExport}
            disabled={exportButtonDisabled || isLoading}
          >
            {downloadData.length > 0 ? "export To Excel" : "Submit"}
            {/* Export */}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportModal;
