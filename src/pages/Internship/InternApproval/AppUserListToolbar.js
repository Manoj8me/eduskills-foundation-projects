// import PropTypes from 'prop-types';
// // @mui
// import { styled, alpha } from '@mui/material/styles';
// import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment } from '@mui/material';
// // component
// // import Iconify from '../../../components/iconify';
// import { Icon } from '@iconify/react';

// // ----------------------------------------------------------------------

// const StyledRoot = styled(Toolbar)(({ theme }) => ({
//   height: 96,
//   display: 'flex',
//   justifyContent: 'space-between',
//   padding: "0px 1px 0px 3px"
// }));

// const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
//   width: 240,
//   transition: theme.transitions.create(['box-shadow', 'width'], {
//     easing: theme.transitions.easing.easeInOut,
//     duration: theme.transitions.duration.shorter,
//   }),
//   '&.Mui-focused': {
//     width: 320,
//     boxShadow: theme.customShadows.z8,
//   },
//   '& fieldset': {
//     borderWidth: `1px !important`,
//     borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
//   },
// }));

// // ----------------------------------------------------------------------

// UserListToolbar.propTypes = {
//   numSelected: PropTypes.number,
//   filterName: PropTypes.string,
//   onFilterName: PropTypes.func,
// };

// export default function UserListToolbar({ numSelected, filterName, onFilterName }) {
//   return (
//     <StyledRoot
//       sx={{
//         ...(numSelected > 0 && {
//           color: 'gray',
//           bgcolor: 'lightgray',
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography component="div" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <StyledSearch
//           value={filterName}
//           onChange={onFilterName}
//           placeholder="Search user..."
//           startAdornment={
//             <InputAdornment position="start">
//               <Icon icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
//             </InputAdornment>
//           }
//         />
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <Icon icon="eva:trash-2-fill" />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <Icon icon="ic:round-filter-list" />
//           </IconButton>
//         </Tooltip>
//       )}
//     </StyledRoot>
//   );
// }

// import PropTypes from "prop-types";
// import { styled } from "@mui/system";
// import {
//   Toolbar,
//   // Tooltip,
//   // IconButton,
//   Typography,
//   OutlinedInput,
//   InputAdornment,
//   Button,
//   // colors,
//   useTheme,
//   IconButton,
//   Box,
//   Divider,
// } from "@mui/material";
// import { Icon } from "@iconify/react";
// import ExportModal from "../../../pages/Internship/exportData";
// import { tokens } from "../../../theme";

// const StyledRoot = styled(Toolbar)({
//   // backgroundColor:'lightblue',
//   height: `${45}px !important`,
//   display: "flex",
//   justifyContent: "space-between",
//   minHeight: "initial !important",
// });

// UserListToolbar.propTypes = {
//   numSelected: PropTypes.number,
//   filterName: PropTypes.string,
//   onFilterName: PropTypes.func,
// };
// const StyledSearch = styled(OutlinedInput)({
//   width: 220,
//   height: `${28}px !important`,
//   transition: "width 0.3s",
//   "&.Mui-focused": {
//     width: 280,
//   },
//   "& fieldset": {
//     borderWidth: "1px !important",
//     borderColor: `gray !important`,
//   },
//   "&.MuiInputBase-root, &.MuiOutlinedInput-root": {
//     paddingRight: "2px !important",
//   },
// });

// export default function UserListToolbar({
//   numSelected,
//   filterName,
//   onFilterName,
//   handleApprovalAll,
//   showExport,
//   exportData,
//   searchButton,
// }) {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   return (
//     <StyledRoot>
//       {numSelected > 0 ? (
//         <Typography component="div" variant="subtitle1">
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//           }}
//         >
//           <StyledSearch
//             value={filterName}
//             onChange={onFilterName}
//             placeholder="Search user..."
//             startAdornment={
//               !searchButton ? (
//                 <InputAdornment position="start">
//                   <Icon
//                     icon="eva:search-fill"
//                     sx={{ color: "text.disabled", width: 20, height: 20 }}
//                   />
//                 </InputAdornment>
//               ) : null
//             }
//             endAdornment={
//               searchButton ? (
//                 <InputAdornment position="end">
//                   <IconButton sx={{p:0.6}} >
//                     <Icon
//                       icon="eva:search-fill"
//                       sx={{ color: "text.disabled", width: 20, height: 20 }}
//                     />
//                   </IconButton>
//                 </InputAdornment>
//               ) : null
//             }
//           />
//           {/* {searchButton && (
//             <IconButton
//               // size="small"
//               color="info"
//               sx={{ ml: 0.5 }}
//             >
//               <Icon
//                 icon="eva:search-fill"
//                 style={{ color: colors.grey[700], width: 20, height: 20 }}
//               />
//             </IconButton>
//           )} */}
//         </Box>
//       )}

//       {numSelected > 0 ? (
//         <Button color="success" variant="contained" onClick={handleApprovalAll}>
//           <Icon icon="material-symbols:order-approve-rounded" />
//           <Typography fontSize={10} ml={1}>
//             Approve All
//           </Typography>
//         </Button>
//       ) : (
//         <>
//           {showExport && (
//             <ExportModal exportData={exportData} isApproval={true} />
//           )}
//         </>
//       )}
//       {/*  */}
//     </StyledRoot>
//   );
// }

import PropTypes from "prop-types";
import { styled } from "@mui/system";
import {
  Toolbar,
  Typography,
  OutlinedInput,
  InputAdornment,
  Button,
  useTheme,
  IconButton,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import ExportModal from "../../../pages/Internship/exportData";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";

const StyledRoot = styled(Toolbar)({
  height: `${45}px !important`,
  display: "flex",
  justifyContent: "space-between",
  minHeight: "initial !important",
});

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  handleApprovalAll: PropTypes.func,
  showExport: PropTypes.bool,
  exportData: PropTypes.any,
  searchButton: PropTypes.bool,
  handleSearch: PropTypes.func,
};

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 220,
  height: `${28}px !important`,
  transition: "width 0.3s",
  "& fieldset": {
    borderWidth: "1px !important",
    borderColor: `gray !important`,
  },
  "&.MuiInputBase-root, &.MuiOutlinedInput-root": {
    paddingRight: "2px !important",
  },
  [theme.breakpoints.down("sm")]: {
    width: 160,
  },
}));

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  handleApprovalAll,
  showExport,
  exportData,
  searchButton,
  handleSearch,
  //.....mou pros..
  addButton,
  isMouAdd,
  setAddButton,
  //.....mou table..
  isMouToggle,
  setMouToggle,
  mouToggle,
  mouFilter,
  isFilter,
  onFilterOpen,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [clearIcon, setClearIcon] = useState(false);

  const handleSearchClick = () => {
    handleSearch();
    // handleClearSearch();
  };

  const handleAddMou = () => {
    setAddButton((pre) => !pre);
  };

  const handleViewTypeChange = (event, newMouToggle) => {
    if (newMouToggle !== null) {
      setMouToggle(newMouToggle);
    }
  };

  const handleClearSearch = () => {
    onFilterName({ target: { value: "" } });
    setClearIcon(false);
  };

  useEffect(() => {
    setClearIcon(Boolean(filterName.trim()));
  }, [filterName]);

  return (
    <StyledRoot>
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <StyledSearch
            value={filterName}
            onChange={(e) => {
              onFilterName(e);
              setClearIcon(Boolean(e.target.value.trim()));
            }}
            placeholder="Search..."
            // disabled={addButton}
            startAdornment={
              !searchButton ? (
                <InputAdornment position="start">
                  <Icon
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled", width: 20, height: 20 }}
                  />
                </InputAdornment>
              ) : null
            }
            endAdornment={
              searchButton ? (
                <>
                  {clearIcon && (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{ p: 0.1, mr: -0.8 }}
                        onClick={handleClearSearch}
                      >
                        <Icon
                          icon="entypo:cross"
                          fontSize={16}
                          sx={{ color: "text.disabled" }}
                        />
                      </IconButton>
                    </InputAdornment>
                  )}

                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        mt: 0.05,
                        mr: -0.25,
                        borderRadius: "0px 4px 4px 0px",
                        minWidth: 20,
                        minHeight: 26,
                      }}
                      onClick={handleSearchClick}
                    >
                      <Icon
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </Button>
                  </InputAdornment>
                </>
              ) : null
            }
          />
        </Box>
      )}
      <Box sx={{display:'flex', alignItems:'center'}}>
        {(mouFilter || isFilter) && (
          <Tooltip title="Filter" placement="top">
            <IconButton color="info" sx={{ mr: 1 }} onClick={onFilterOpen}>
              <Icon icon="bi:filter-circle-fill" fontSize={20} />
            </IconButton>
          </Tooltip>
        )}
        {numSelected > 0 ? (
          <Button
            color="success"
            variant="contained"
            onClick={handleApprovalAll}
          >
            <Icon icon="material-symbols:order-approve-rounded" />
            <Typography fontSize={10} ml={1}>
              Approve All
            </Typography>
          </Button>
        ) : (
          <>
            {showExport && (
              <ExportModal exportData={exportData} isApproval={true} />
            )}
          </>
        )}

        {isMouToggle && (
          <ToggleButtonGroup
            value={mouToggle}
            exclusive
            onChange={handleViewTypeChange}
            aria-label="page size"
            sx={{ height: "25px" }}
          >
            <ToggleButton
              color="info"
              value={0}
              aria-label="0"
              sx={{ fontSize: 10 }}
            >
              Institute
            </ToggleButton>
            <ToggleButton
              color="info"
              value={1}
              aria-label="1"
              sx={{ fontSize: 10 }}
            >
              MOU
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>
      {isMouAdd && (
        <Button
          color={addButton ? "inherit" : "info"}
          size="small"
          variant="contained"
          onClick={handleAddMou}
          startIcon={
            <Icon
              icon={
                addButton
                  ? "icon-park-twotone:back"
                  : "icon-park-twotone:add-one"
              }
            />
          }
        >
          {addButton ? "Back" : "Add Mou"}
        </Button>
      )}
    </StyledRoot>
  );
}
