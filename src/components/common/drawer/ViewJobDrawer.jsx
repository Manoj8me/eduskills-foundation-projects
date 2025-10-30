// import React from "react";
// import Drawer from "@mui/material/Drawer";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import { Typography, Box, Container, useTheme, Paper } from "@mui/material";
// import { tokens } from "../../../theme";
// import { Icon } from "@iconify/react";

// const CustomViewDrawer = ({
//   isOpen,
//   onClose,
//   drawerData,
//   title,
//   viewData,
//   isJobView,
// }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const handleClose = () => {
//     onClose();
//   };

//   const formatKey = (key) => {
//     const formattedKey = key
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (match) => match.toUpperCase());
//     return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
//   };

//   const renderData = (data) => {
//     const { jd_id, job_id, post_type, ...newData } = data;
//     const updateData = data.jd_id ? newData : data;

//     return (
//       <Paper elevation={0} sx={{ p: 2, bgcolor: colors.blueAccent[900] }}>
//         {Object.entries(updateData).map(([key, value]) => (
//           <Box sx={{ display: "flex" }} key={key}>
//             <Typography sx={{ minWidth: 120 }}>
//               <strong>{formatKey(key)}</strong>
//             </Typography>
//             <Typography sx={{ width: "100%" }}>
//               {typeof value === "object" ? (
//                 Array.isArray(value) ? (
//                   isJobView ? (
//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <Typography>: {value.length}</Typography>
//                       <IconButton onClick={()=>handleModalOpen(value)} color="info" sx={{ p: 0.5 }}>
//                         <Icon icon="carbon:data-view" height={15} />
//                       </IconButton>
//                     </Box>
//                   ) : (
//                     // If isJobView is true, don't render array items
//                     value.map((item, index) => (
//                       <Typography key={index}>: {item}</Typography>
//                     ))
//                   )
//                 ) : (
//                   Object.entries(value).map(([subKey, subValue]) => (
//                     <Typography
//                       key={subKey}
//                       sx={{ fontWeight: 600, fontFamily: "monospace" }}
//                     >
//                       : {formatKey(subKey)}:
//                       {subValue.map((subItem, subIndex) => (
//                         <Typography key={subIndex}>- {subItem}</Typography>
//                       ))}
//                     </Typography>
//                   ))
//                 )
//               ) : (
//                 <Typography key={key}>: {value}</Typography>
//               )}
//             </Typography>
//           </Box>
//         ))}
//       </Paper>
//     );
//   };

//   return (
//     <Drawer anchor="left" open={isOpen}>
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
//           {drawerData?.name || title}
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
//           overflowY: "auto",
//         }}
//       >
//         {viewData ? (
//           renderData(viewData)
//         ) : (
//           <Typography>No data to view</Typography>
//         )}
//       </Container>
//     </Drawer>
//   );
// };

// export default CustomViewDrawer;

import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Typography,
  Box,
  Container,
  useTheme,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { tokens } from "../../../theme";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import { TalentConnectService } from "../../../services/dataService";

const CustomViewDrawer = ({
  isOpen,
  onClose,
  drawerData,
  title,
  viewData,
  isJobView,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClose = () => {
    onClose();
  };
  const dispatch = useDispatch();
  const stateList = useSelector((state) => state.statePackage.instituteState);
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("");
  const [institueList, setInstitueList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleModalOpen = (data, key) => {
    setModalData(data);
    setModalOpen(true);
    setModalType(key);
  };
  const selectedStates = viewData?.state_id;
  const selectedInstituteId = viewData?.institute_id;
  const handleModalClose = () => {
    setModalOpen(false);
    setModalData([]);
    setModalType("");
    setSearchTerm("");
  };

  useEffect(() => {
    dispatch(fetchInstituteState());
  }, []);

  const filteredStateList = stateList.filter((state) =>
    modalData.includes(state.state_id)
  );

  const filteredInstituteList = institueList.filter((state) =>
    selectedInstituteId.includes(state.institute_id)
  );

  const filteredStateListSearch = filteredStateList.filter((item) =>
    item.state_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstituteListSearch = filteredInstituteList.filter((item) =>
    item.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchInstitute = async (data) => {
    const stateIds = { states: data };

    try {
      const res = await TalentConnectService.institute_by_state(stateIds);
      const data = res.data.data;
      setInstitueList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedStates) {
      fetchInstitute(selectedStates);
    }
  }, [selectedStates]);

  const formatKey = (key) => {
    const formattedKey = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  };

  const renderData = (data) => {
    const { jd_id, job_id, post_type, ...newData } = data;
    const updateData = data.jd_id ? newData : data;

    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: colors.blueAccent[900] }}>
        {Object.entries(updateData).map(([key, value]) => (
          <Box sx={{ display: "flex" }} key={key}>
            <Typography sx={{ minWidth: 120 }}>
              <strong>{formatKey(key)}</strong>
            </Typography>
            <Typography sx={{ width: "100%" }}>
              {typeof value === "object" ? (
                Array.isArray(value) ? (
                  isJobView ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>: {value.length}</Typography>
                      <IconButton
                        onClick={() => handleModalOpen(value, key)}
                        color="info"
                        disabled={value.length === 0}
                        sx={{ p: 0.5 }}
                      >
                        <Icon icon="carbon:data-view" height={15} />
                      </IconButton>
                    </Box>
                  ) : (
                    // If isJobView is true, don't render array items
                    value.map((item, index) => (
                      <Typography key={index}>: {item}</Typography>
                    ))
                  )
                ) : (
                  Object.entries(value).map(([subKey, subValue]) => (
                    <Typography
                      key={subKey}
                      sx={{ fontWeight: 600, fontFamily: "monospace" }}
                    >
                      : {formatKey(subKey)}:
                      {subValue.map((subItem, subIndex) => (
                        <Typography key={subIndex}>- {subItem}</Typography>
                      ))}
                    </Typography>
                  ))
                )
              ) : (
                <Typography key={key}>: {value}</Typography>
              )}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  };

  return (
    <>
      <Drawer anchor="left" open={isOpen}>
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
            {drawerData?.name || title}
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
            overflowY: "auto",
          }}
        >
          {viewData ? (
            renderData(viewData)
          ) : (
            <Typography>No data to view</Typography>
          )}
        </Container>
      </Drawer>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose} >
        <DialogTitle>
          {modalType === "state_id" ? "Selected States" : "Selected Institutes"}
          <div style={{ float: "right" }}>
            {/* Your search bar component or input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogTitle>
        <DialogContent sx={{minWidth:600, minHeight:400}}>
          {modalType === "state_id" &&
            filteredStateListSearch.map((item, index) => (
              <Chip key={index} label={item.state_name} sx={{ m: 0.5 }} />
            ))}
          {modalType === "institute_id" &&
            filteredInstituteListSearch.map((item, index) => (
              <Chip key={index} label={item.institute_name} sx={{ m: 0.5 }} />
            ))}
          {/* {modalData.map((item, index) => (
            <Chip key={index} label={item} sx={{m:0.5}}/>
          ))} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomViewDrawer;
