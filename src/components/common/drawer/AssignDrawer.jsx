// import React, { useEffect, useState } from "react";
// import Drawer from "@mui/material/Drawer";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   TextField,
//   FormControl,
//   InputAdornment,
//   Paper,
//   Container,
//   useTheme,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { tokens } from "../../../theme";
// import CommonModal from "../modal/CommonModal";
// import { AdminService } from "../../../services/dataService";
// import DomainConfirmationModal from "../modal/DomainConfirmationModal";

// const CommonDrawer = ({
//   isOpen,
//   onClose,
//   drawerData,
//   setSelectedAssignItems,
// }) => {
//   const [selectedColleges, setSelectedColleges] = useState([]);
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
//   const [currentAction, setCurrentAction] = useState("");
//   const [loadingList, setLoadingList] = useState(true);
//   const [doaminList, setDoaminList] = useState([]);
//   const [isDomainConfirmationModalOpen, setIsDomainConfirmationModalOpen] =
//     useState(false);
//   const [instStatus, setInstStatus] = useState(false);
//   const [isAllChecked, setIsAllChecked] = useState(false);
//   const [inst, setInst] = useState(null);

//   const institue_id = drawerData?.institue_id;

//   const fetchData = async (institue_id) => {
//     if (institue_id === 407) {
//       try {
//         const response = await AdminService.admin_inst_domain_list(institue_id);
//         const data = response.data.data.map((domain) => ({
//           ...domain,
//           status: domain.status === "Active" ? "1" : "0",
//         }));

//         setDoaminList(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoadingList(false); // Set loading to false when fetching is complete (success or failure)
//       }
//     }
//   };

//   useEffect(() => {
//     if (institue_id) {
//       fetchData(institue_id);
//     }
//   }, [institue_id]);

//   //.............................................................................

//   const handleOpenDomainConfirmationModal = () => {
//     setIsDomainConfirmationModalOpen(true);
//   };

//   const handleCloseDomainConfirmationModal = () => {
//     setIsDomainConfirmationModalOpen(false);
//   };

//   const handleOpenConfirmationModal = (action) => {
//     setCurrentAction(action);
//     setIsConfirmationModalOpen(true);
//   };

//   const handleCloseConfirmationModal = () => {
//     setIsConfirmationModalOpen(false);
//   };

//   const handleClose = () => {
//     onClose();
//     setSearchTerm("");
//     setIsAllChecked(false);
//   };

//   const handleConfirmAction = () => {
//     if (currentAction === "update") {
//       const updatedData = doaminList.map((domain) => {
//         const isSelected = selectedColleges.includes(domain.domain_id);

//         return {
//           domain_id: domain.domain_id,
//           status: isSelected ? "1" : "0",
//         };
//       });

//       setSelectedAssignItems({ data: updatedData, institue_id: institue_id });
//       setIsAllChecked(false);
//       setSelectedColleges([]);
//     } else if (currentAction === "save") {
//       // Perform delete action
//       // ...
//     }

//     handleCloseConfirmationModal();
//   };

//   const handleCancel = () => {
//     onClose();
//     setSelectedColleges([]);
//     setSearchTerm("");
//     setIsAllChecked(false);
//   };

//   const handleSelectAll = () => {
//     if (isAllChecked) {
//       setSelectedColleges([]);
//       const updatedList = doaminList.map((domain) => ({
//         ...domain,
//         status: "0",
//       }));
//       setDoaminList(updatedList);
//     } else {
//       const selectedIds = doaminList.map((domain) => domain.domain_id);
//       setSelectedColleges(selectedIds);

//       const updatedList = doaminList.map((domain) => ({
//         ...domain,
//         status: domain.domain_email === false ? "1" : domain.status,
//       }));
//       setDoaminList(updatedList);
//     }
//     setIsAllChecked(!isAllChecked);
//   };

//   useEffect(() => {
//     const activeList = doaminList.filter((domain) => domain.status === "1");
//     const activeDomainIds = activeList.map((domain) => domain.domain_id);
//     setSelectedColleges(activeDomainIds);
//   }, [doaminList]);

//   const handleCheckboxChange = (domainId) => {
//     const selectedDomain = doaminList.find(
//       (item) => item.domain_id === domainId
//     );

//     if (selectedDomain.domain_email === false || instStatus) {
//       // If domain_email is false, update the status directly

//       const updatedColleges = [...selectedColleges];
//       const domainIndex = updatedColleges.indexOf(selectedDomain.domain_id);

//       if (domainIndex > -1) {
//         updatedColleges.splice(domainIndex, 1);
//       } else {
//         updatedColleges.push(selectedDomain.domain_id);
//         if (inst && selectedDomain.domain_email === true) {
//           handleOpenDomainConfirmationModal();
//         }
//       }

//       setDoaminList((prevDoaminList) =>
//         prevDoaminList.map((item) =>
//           item.domain_id === selectedDomain.domain_id
//             ? {
//                 ...item,
//                 status: updatedColleges.includes(item.domain_id) ? "1" : "0",
//               }
//             : item
//         )
//       );
//     } else {
//       handleOpenDomainConfirmationModal();
//       // handleOpenDomainConfirmationModal();
//     }
//   };

//   const filterDomains = () => {
//     return doaminList?.filter((domain) =>
//       domain.domain_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   return (
//     <Drawer
//       anchor="left"
//       open={isOpen}
//       sx={{ display: "flex", justifyContent: "space-between" }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           bgcolor: colors.blueAccent[800],
//           px: 2,
//           py: 0.5,
//         }}
//       >
//         <Typography
//           variant="h6"
//           color={colors.blueAccent[200]}
//           fontWeight={600}
//         >
//           {/* {title} */}
//           {drawerData?.institute_name}
//         </Typography>
//         <IconButton
//           color="inherit"
//           aria-label="Close Drawer"
//           onClick={handleClose}
//           edge="end"
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
//       <Container
//         sx={{
//           [theme.breakpoints.down("sm")]: {
//             maxWidth: "600px",
//           },
//           [theme.breakpoints.up("sm")]: {
//             width: "600px",
//           },
//           my: 1,
//         }}
//       >
//         <FormControl fullWidth>
//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="space-between"
//             mt={0.5}
//             mb={1}
//             maxWidth="600px"
//           >
//             <Box display="flex" alignItems="center">
//               <Checkbox
//                 color="info"
//                 checked={isAllChecked}
//                 onChange={handleSelectAll}
//               />
//               <Typography mr={1}>Select All</Typography>
//             </Box>
//             <Box>
//               <TextField
//                 variant="outlined"
//                 fullWidth
//                 placeholder="Search..."
//                 color="info"
//                 size="small"
//                 margin="dense"
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">&#128269;</InputAdornment>
//                   ),
//                 }}
//               />
//             </Box>
//           </Box>
//           <Paper
//             elevation={1}
//             style={{
//               minHeight: "72vh",
//               maxHeight: "72vh",
//               overflowY: "auto",
//               maxWidth: "600px",
//             }}
//           >
//             {loadingList ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   minHeight: "70vh",
//                   maxHeight: "70vh",
//                 }}
//               >
//                 <CircularProgress color="info" />
//               </Box>
//             ) : (
//               filterDomains().map((domain) => (
//                 <Box
//                   key={domain.domain_id}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     px: 1,
//                     borderRadius: 0.5,
//                     // justifyContent: "space-between",
//                     bgcolor:
//                       selectedColleges.indexOf(domain.domain_id) > -1
//                         ? colors.blueAccent[800]
//                         : "1",
//                     m: 0.3,
//                     "&:hover": {
//                       bgcolor: colors.blueAccent[800],
//                     },
//                   }}
//                 >
//                   <Checkbox
//                     color="info"
//                     checked={domain.status === "1"}
//                     onChange={() => handleCheckboxChange(domain.domain_id)}
//                   />
//                   <Typography>{domain.domain_name}</Typography>
//                   {/* <Typography sx={{ ml: 1 }}>{college.status}</Typography> */}
//                 </Box>
//               ))
//             )}
//           </Paper>
//         </FormControl>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             width: "100%",
//             pt: 2,
//             mr: 1.1,
//           }}
//         >
//           <Button
//             variant="contained"
//             sx={{ mr: 1 }}
//             color="info"
//             onClick={() => handleOpenConfirmationModal("update")}
//           >
//             Update
//           </Button>
//           <Button variant="contained" color="inherit" onClick={handleCancel}>
//             Cancel
//           </Button>
//         </Box>
//         <CommonModal
//           open={isConfirmationModalOpen}
//           onClose={handleCloseConfirmationModal}
//           onConfirm={handleConfirmAction}
//           action={currentAction}
//         />
//         <DomainConfirmationModal
//           isOpen={isDomainConfirmationModalOpen}
//           onClose={handleCloseDomainConfirmationModal}
//           setInstStatus={setInstStatus}
//           setInst={setInst}
//           inst={inst}
//           // onConfirm={handleDomainConfirmation}
//           // domain={selectedDomain}
//           institueId={institue_id}
//         />
//       </Container>
//     </Drawer>
//   );
// };

// export default CommonDrawer;

import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  Checkbox,
  TextField,
  FormControl,
  InputAdornment,
  Paper,
  Container,
  useTheme,
  Button,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../../theme";
import CommonModal from "../modal/CommonModal";
import { AdminService } from "../../../services/dataService";
import DomainConfirmationModal from "../modal/DomainConfirmationModal";

const CommonDrawer = ({
  isOpen,
  onClose,
  drawerData,
  setSelectedAssignItems,
}) => {
  const [selectedColleges, setSelectedColleges] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [doaminList, setDoaminList] = useState([]);
  const [isDomainConfirmationModalOpen, setIsDomainConfirmationModalOpen] =
    useState(false);
  const [instStatus, setInstStatus] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [inst, setInst] = useState(null);

  const institue_id = drawerData?.institue_id;

  const fetchData = async (institue_id) => {
    try {
      const response = await AdminService.admin_domain_list(institue_id);
      const data = response.data.data.map((domain) => ({
        ...domain,
        status: domain.status === "Active" ? "1" : "0",
      }));

      setDoaminList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingList(false); // Set loading to false when fetching is complete (success or failure)
    }
  };

  useEffect(() => {
    if (institue_id) {
      fetchData(institue_id);
    }
  }, [institue_id]);

  //.............................................................................

  const handleOpenDomainConfirmationModal = () => {
    setIsDomainConfirmationModalOpen(true);
  };

  const handleCloseDomainConfirmationModal = () => {
    setIsDomainConfirmationModalOpen(false);
  };

  const handleOpenConfirmationModal = (action) => {
    setCurrentAction(action);
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    onClose();
    setSearchTerm("");
    setIsAllChecked(false);
  };

  const handleConfirmAction = () => {
    if (currentAction === "update") {
      const updatedData = doaminList.map((domain) => {
        const isSelected = selectedColleges.includes(domain.academy_id);

        return {
          academy_id: domain.academy_id,
          status: isSelected ? "1" : "0",
        };
      });

      setSelectedAssignItems({ data: updatedData, institue_id: institue_id });
      setIsAllChecked(false);
      setSelectedColleges([]);
    } else if (currentAction === "save") {
      // Perform delete action
      // ...
    }

    handleCloseConfirmationModal();
  };

  const handleCancel = () => {
    onClose();
    setSelectedColleges([]);
    setSearchTerm("");
    setIsAllChecked(false);
  };

  const handleSelectAll = () => {
    if (isAllChecked) {
      setSelectedColleges([]);
      const updatedList = doaminList.map((domain) => ({
        ...domain,
        status: "0",
      }));
      setDoaminList(updatedList);
    } else {
      const selectedIds = doaminList.map((domain) => domain.academy_id);
      setSelectedColleges(selectedIds);

      const updatedList = doaminList.map((domain) => ({
        ...domain,
        status: domain.domain_email === false ? "1" : domain.status,
      }));
      setDoaminList(updatedList);
    }
    setIsAllChecked(!isAllChecked);
  };

  useEffect(() => {
    const activeList = doaminList.filter((domain) => domain.status === "1");
    const activeDomainIds = activeList.map((domain) => domain.academy_id);
    setSelectedColleges(activeDomainIds);
  }, [doaminList]);

  const handleCheckboxChange = (domainId) => {
    const selectedDomain = doaminList.find(
      (item) => item.academy_id === domainId
    );

    if (selectedDomain.domain_email === false || instStatus) {
      // If domain_email is false, update the status directly

      const updatedColleges = [...selectedColleges];
      const domainIndex = updatedColleges.indexOf(selectedDomain.academy_id);

      if (domainIndex > -1) {
        updatedColleges.splice(domainIndex, 1);
      } else {
        updatedColleges.push(selectedDomain.academy_id);
        if (inst && selectedDomain.domain_email === true) {
          handleOpenDomainConfirmationModal();
        }
      }

      setDoaminList((prevDoaminList) =>
        prevDoaminList.map((item) =>
          item.academy_id === selectedDomain.academy_id
            ? {
                ...item,
                status: updatedColleges.includes(item.academy_id) ? "1" : "0",
              }
            : item
        )
      );
    } else {
      handleOpenDomainConfirmationModal();
      // handleOpenDomainConfirmationModal();
    }
  };

  const filterDomains = () => {
    return doaminList?.filter((domain) =>
      domain.academy_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: colors.blueAccent[800],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography
          variant="h6"
          color={colors.blueAccent[200]}
          fontWeight={600}
        >
          {/* {title} */}
          {drawerData?.institute_name}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="Close Drawer"
          onClick={handleClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Container
        sx={{
          [theme.breakpoints.down("sm")]: {
            maxWidth: "600px",
          },
          [theme.breakpoints.up("sm")]: {
            width: "600px",
          },
          my: 1,
        }}
      >
        <FormControl fullWidth>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={0.5}
            mb={1}
            maxWidth="600px"
          >
            <Box display="flex" alignItems="center">
              <Checkbox
                color="info"
                checked={isAllChecked}
                onChange={handleSelectAll}
              />
              <Typography mr={1}>Select All</Typography>
            </Box>
            <Box>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Search..."
                color="info"
                size="small"
                margin="dense"
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">&#128269;</InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
          <Paper
            elevation={1}
            style={{
              minHeight: "72vh",
              maxHeight: "72vh",
              overflowY: "auto",
              maxWidth: "600px",
            }}
          >
            {loadingList ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "70vh",
                  maxHeight: "70vh",
                }}
              >
                <CircularProgress color="info" />
              </Box>
            ) : (
              filterDomains().map((domain) => (
                <Box
                  key={domain.academy_id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    borderRadius: 0.5,
                    // justifyContent: "space-between",
                    bgcolor:
                      selectedColleges.indexOf(domain.academy_id) > -1
                        ? colors.blueAccent[800]
                        : "1",
                    m: 0.3,
                    "&:hover": {
                      bgcolor: colors.blueAccent[800],
                    },
                  }}
                >
                  <Checkbox
                    color="info"
                    checked={domain.status === "1"}
                    onChange={() => handleCheckboxChange(domain.academy_id)}
                  />
                  <Typography>{domain.academy_name}</Typography>
                  {/* <Typography sx={{ ml: 1 }}>{college.status}</Typography> */}
                </Box>
              ))
            )}
          </Paper>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            pt: 2,
            mr: 1.1,
          }}
        >
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            color="info"
            onClick={() => handleOpenConfirmationModal("update")}
          >
            Update
          </Button>
          <Button variant="contained" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
        <CommonModal
          open={isConfirmationModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmAction}
          action={currentAction}
        />
        <DomainConfirmationModal
          isOpen={isDomainConfirmationModalOpen}
          onClose={handleCloseDomainConfirmationModal}
          setInstStatus={setInstStatus}
          setInst={setInst}
          inst={inst}
          // onConfirm={handleDomainConfirmation}
          // domain={selectedDomain}
          institueId={institue_id}
        />
      </Container>
    </Drawer>
  );
};

export default CommonDrawer;
