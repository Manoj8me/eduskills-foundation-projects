import { useState } from "react";
import {
  Input,
  Slide,
  Button,
  IconButton,
  InputAdornment,
  ClickAwayListener,
  styled,
  Box,
  InputBase,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { tokens } from "../../theme";
import { StaffService } from "../../services/dataService";
import { toast } from "react-toastify";
import InternViewDrawer from "../../components/common/drawer/InternViewDrawer";

export default function Searchbar() {
  const [open, setOpen] = useState(false);

  const [inputData, setInputData] = useState("");
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState({});
  const [isInternshipDrawerOpen, setInternshipDrawerOpen] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallMediumScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const handleOpen = () => {
    setOpen(!open);
  };

  const StyledSearchbar = styled("div")({
    top: 0,
    left: 0,
    zIndex: 99,
    width: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    height: "100%",
    backgroundColor: colors.primary[400],
    padding: "8px 24px", // Adjust the padding according to your needs
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)", // Replace with your desired box shadow
  });
  const handleClose = () => {
    setOpen(false);
    setSearchData({});
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputData(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setSearch(value);
    }
  };

  // function handleSuccessMessage(message) {
  //   toast.success(message, {
  //     autoClose: 3000,
  //     position: "top-center",
  //   });
  // }

  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 3000,
      position: "top-center",
    });
  }

  const handleSearch = async () => {
    setSearchData({});
    if (search !== "") {
      try {
        const response = await StaffService.staff_search(search);

        if (response.status === 200) {
          handleErrorMessage(response.data?.detail);
          setSearchData(response.data);

          if (
            response.data?.profile?.length > 0 &&
            response.data?.profile?.length > 0
          ) {
            internshipDrawerOpen();
          }
          setInputData("");
          setSearch("");
        }
      } catch (error) {
        setInputData("");
        setSearch("");
        if (error?.response?.status === 404) {
          handleErrorMessage("Not Found");
        } else if (error?.response?.status === 401){
          handleErrorMessage("Unauthorized access attempted. Access denied.")
        }else {
          handleErrorMessage("Please try after sometime");
        }
      }
    }
  };

  const internshipDrawerOpen = () => {
    setInternshipDrawerOpen(true);
  };
  const closeDrawer = () => {
    setInternshipDrawerOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {isSmallMediumScreen ? (
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
          // bgcolor={"lightblue"}
          minWidth={250}
        >
          <InputBase
            value={inputData}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search email..."
          />
          <IconButton
            onClick={handleSearch}
            type="button"
            disabled={search === ""}
            sx={{ p: 1, height:"100%" }}
          >
            <Icon icon={"iconamoon:search-bold"} />
          </IconButton>
        </Box>
      ) : (
        <ClickAwayListener onClickAway={handleClose}>
          <div>
            {!open && (
              <IconButton onClick={handleOpen}>
                <Icon icon="eva:search-fill" />
              </IconButton>
            )}

            <Slide direction="down" in={open} mountOnEnter unmountOnExit>
              <StyledSearchbar>
                <Input
                  autoFocus
                  fullWidth
                  disableUnderline
                  placeholder="Search email…"
                  value={inputData}
                  onChange={handleChange}
                  // onKeyDown={handleKeyDown}
                  startAdornment={
                    <InputAdornment position="start">
                      <Icon
                        icon="eva:search-fill"
                        style={{
                          color: "rgba(0, 0, 0, 0.54)",
                          width: 20,
                          height: 20,
                        }} // Replace with your desired color
                      />
                    </InputAdornment>
                  }
                  style={{ marginRight: "8px", fontWeight: "bold" }} // Adjust styles as needed
                />
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => {
                    handleSearch();
                    handleClose();
                  }}
                >
                  Search
                </Button>
              </StyledSearchbar>
            </Slide>
          </div>
        </ClickAwayListener>
      )}
      <InternViewDrawer
        isOpen={isInternshipDrawerOpen}
        onClose={closeDrawer}
        viewData={searchData}
        title={"Internship Details"}
      />
    </>
  );
}
