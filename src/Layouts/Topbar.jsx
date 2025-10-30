import { useState, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserRole } from "../store/Slices/auth/authoriseSlice";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Typography,
  Tooltip,
  Divider,
  useMediaQuery,
  Chip,
} from "@mui/material";

import {
  LightModeOutlined as LightModeOutlinedIcon,
  DarkModeOutlined as DarkModeOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  WidgetsOutlined as WidgetsOutlinedIcon,
  MenuOutlined as MenuOutlinedIcon,
  CampaignOutlined as AnnouncementIcon,
  ConnectWithoutContact as ConnectIcon,
  HowToVote as VoteIcon,
} from "@mui/icons-material";

// Import our custom button component
import InstituteProfileButton from "./InstituteProfileButton";
// Import the new InstitutionFilters component
import InstitutionFilters from "./InstitutionFilters";

import { useTheme } from "@mui/material/styles";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Profile from "../assets/imgs/profile.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ColorModeContext, tokens } from "../theme";

import { Icon } from "@iconify/react";

import { AuthService } from "../services/dataService";
import clearAllSlicesThunk from "../store/Slices/auth/logout";
import Searchbar from "./top/Searchbar";
// import NotificationsPopover from "./top/NotificationsPopover";
import MembershipBadge from "./MembershipBadge";
import AnimatedModal from "./AnimatedModal";
import connectimg from "../assets/imgs/favicon (3).png"; // Import the connect registration image
import VoteNowBadge from "./VotingButton";
import ConnectRegistrationBadge from "./ConnectRegistrationBadge";
import ConnectFeedbackBadge from "./ConnectFeedbackBadge";

const HEADER_MOBILE = 54;
const HEADER_DESKTOP = 70;

const Topbar = ({ onToggleDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isDarkMode = theme.palette.mode === "dark";
  const [notificationCount, setNotificationCount] = useState(0);
  const [roles, setRoles] = useState([]);
  const [isMultiRole, setIsMultiRole] = useState(false);
  const showIconButton = useMediaQuery(theme.breakpoints.down("lg"));
  const showMobileHeader = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSwitch, setIsLoadingSwitch] = useState(false);
  const userRole = localStorage.getItem("Authorise");
  const dispatch = useDispatch();
  const location = useLocation();
  const isActiveRole = useSelector((state) => state.authorise.userRole);
  const userName = localStorage.getItem("userName");
  const formattedUserName = userName
    ? userName
        .split("@")[0] // Get the part before '@'
        .replace(/(?:^|\s|\.)(.)/g, (match, letter) => letter.toUpperCase()) // Capitalize the first letter after space or dot
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space between camelCase
    : "";

  // Check if we're on paths that should show the institution filters
  const shouldShowInstitutionFilters = [
    "/total-staff",
    "/internship-all-staff",
    "/student-staff",
  ].includes(location.pathname);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const profileButtonRef = useRef(null);

  // Connect Registration Badge Component
  // const ConnectRegistrationBadge = () => {
  //   const navigate = useNavigate();

  //   const handleConnectRegistration = () => {
  //     navigate("/multi");
  //   };

  //   return (
  //     <Tooltip title="Connect">
  //       <Box
  //         sx={{
  //           position: "relative",
  //           mr: 2,
  //           "&::before": {
  //             content: '""',
  //             position: "absolute",
  //             top: "-2px",
  //             left: "-2px",
  //             right: "-2px",
  //             bottom: "-2px",
  //             background:
  //               "linear-gradient(45deg, #FF9800, #FF5722, #FF9800, #FF5722)",
  //             backgroundSize: "300% 300%",
  //             borderRadius: "18px",
  //             zIndex: -1,
  //             animation: "gradient-shift 3s ease infinite",
  //           },
  //           "@keyframes gradient-shift": {
  //             "0%": { backgroundPosition: "0% 50%" },
  //             "50%": { backgroundPosition: "100% 50%" },
  //             "100%": { backgroundPosition: "0% 50%" },
  //           },
  //           "@keyframes pulse-glow": {
  //             "0%": {
  //               boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
  //               transform: "scale(1)",
  //             },
  //             "50%": {
  //               boxShadow: "0 6px 20px rgba(255, 152, 0, 0.6)",
  //               transform: "scale(1.02)",
  //             },
  //             "100%": {
  //               boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
  //               transform: "scale(1)",
  //             },
  //           },
  //           "@keyframes bounce-icon": {
  //             "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
  //             "25%": { transform: "translateY(-2px) rotate(-2deg)" },
  //             "75%": { transform: "translateY(-1px) rotate(2deg)" },
  //           },
  //           "@keyframes shimmer": {
  //             "0%": { transform: "translateX(-100%)" },
  //             "100%": { transform: "translateX(100%)" },
  //           },
  //         }}
  //       >
  //         <Chip
  //           icon={
  //             <img
  //               src={connectimg}
  //               alt="Connect"
  //               style={{
  //                 width: 18,
  //                 height: 18,
  //                 objectFit: "contain",
  //                 filter: "brightness(0) invert(1)",
  //                 animation: "bounce-icon 2s ease-in-out infinite",
  //               }}
  //             />
  //           }
  //           label="Connect"
  //           onClick={handleConnectRegistration}
  //           sx={{
  //             position: "relative",
  //             overflow: "hidden",
  //             background: "linear-gradient(135deg, #FF9800 0%, #FF5722 100%)",
  //             color: "#FFFFFF",
  //             fontSize: "0.8rem",
  //             fontWeight: 600,
  //             height: 32,
  //             cursor: "pointer",
  //             borderRadius: "16px",
  //             boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
  //             transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  //             animation: "pulse-glow 3s ease-in-out infinite",
  //             "&::after": {
  //               content: '""',
  //               position: "absolute",
  //               top: 0,
  //               left: "-100%",
  //               width: "100%",
  //               height: "100%",
  //               background:
  //                 "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
  //               animation: "shimmer 2.5s ease-in-out infinite",
  //             },
  //             "&:hover": {
  //               background: "linear-gradient(135deg, #FF5722 0%, #FF9800 100%)",
  //               transform: "translateY(-3px) scale(1.05)",
  //               boxShadow: "0 8px 25px rgba(255, 152, 0, 0.5)",
  //               animation: "none",
  //               "& img": {
  //                 animation: "bounce-icon 0.6s ease-in-out infinite",
  //               },
  //               "&::after": {
  //                 animation: "shimmer 1s ease-in-out infinite",
  //               },
  //             },
  //             "&:active": {
  //               transform: "translateY(-1px) scale(1.02)",
  //               transition: "all 0.1s ease",
  //             },
  //             "& .MuiChip-icon": {
  //               marginLeft: "8px",
  //             },
  //             "& .MuiChip-label": {
  //               paddingLeft: "8px",
  //               paddingRight: "12px",
  //               position: "relative",
  //               zIndex: 2,
  //             },
  //           }}
  //         />
  //       </Box>
  //     </Tooltip>
  //   );
  // };

  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  const handleProfile = (popupState) => {
    if (popupState) popupState.close();

    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setButtonRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      });
    }

    setTimeout(() => {
      setIsModalOpen(true);
    }, 10);
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
  };

  const navigate = useNavigate();

  const handleSettings = (popupState) => {
    navigate("/settings");
    popupState.close();
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.logout();

      if (response.status === 200) {
        localStorage.clear();
        clearAllSlicesThunk(dispatch);
        handleSuccessMessage("Logout successful");
        navigate("/login");
      } else {
        console.error("Logout failed with status:", response.status);
      }

      return response;
    } catch (error) {
      localStorage.clear();
      clearAllSlicesThunk(dispatch);
      console.error("Logout error:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoadingSwitch(true);
      try {
        const response = await AuthService.roles();

        if (response && response?.status === 200) {
          const fetchedRoles = response.data.roles;
          setRoles(fetchedRoles);
          setIsMultiRole(response.data.multi_role);
          const activeRole = fetchedRoles.find((role) => role.status === true);

          if (activeRole) {
            const activeRoleNameModified = activeRole.role_name
              .toLowerCase()
              .replace(/ /g, "_");
            localStorage.setItem("Authorise", activeRoleNameModified);
            dispatch(setUserRole(activeRoleNameModified));
            setIsLoadingSwitch(false);
          }
        } else {
          console.error("Invalid response:", response);
          setIsLoadingSwitch(false);
        }
      } catch (error) {
        console.error("Error fetching data:");
        setIsLoadingSwitch(false);
      }
    }

    fetchData();
  }, [dispatch]);

  const handleRoleSwitch = async (id) => {
    setIsLoadingSwitch(true);
    navigate("/dashboard");

    try {
      const response = await AuthService.switch_role(id);
      const fetchedRoles = response?.data.roles;
      console.log(fetchedRoles);
      setRoles(fetchedRoles);
      setIsMultiRole(response?.data.multi_role);
      const activeRole = fetchedRoles?.find((role) => role?.status === true);
      if (activeRole) {
        const activeRoleNameModified = activeRole?.role_name
          .toLowerCase() // Convert to lowercase
          .replace(/ /g, "_"); // Replace spaces with underscores
        localStorage.setItem("Authorise", activeRoleNameModified);
        dispatch(setUserRole(activeRoleNameModified));

        // navigate("/");
        handleSuccessMessage(`${activeRole?.role_name} switched successfully`);
        setIsLoadingSwitch(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoadingSwitch(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          boxShadow: `0px 1px 4px ${colors.grey[900]}`,
          height: showMobileHeader ? HEADER_MOBILE : HEADER_DESKTOP,
          borderRadius: "0px 0px",
          bgcolor: colors.background[100],
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          height={"100%"}
        >
          <Box display="flex" alignItems="center">
            {showIconButton && (
              <IconButton sx={{ mr: 2 }} onClick={onToggleDrawer}>
                <MenuOutlinedIcon />
              </IconButton>
            )}

            {userRole === "spoc" && <MembershipBadge />}
            {userRole === "dspoc" && <MembershipBadge />}
            {userRole === "leaders" && <MembershipBadge />}
            {userRole === "tpo" && <MembershipBadge />}

            {/* Connect Registration Badge - Only for spoc, dspoc, and leaders */}
            {(userRole === "spoc" ||
              userRole === "dspoc" ||
              userRole === "leaders" ||
              userRole === "tpo") && <ConnectRegistrationBadge />}

            {userRole === "admin" && <ConnectFeedbackBadge />}

            {/* Vote Now Badge - Only for spoc, dspoc, and leaders */}
            {/* {(userRole === "leaders" || userRole === "tpo") && <VoteNowBadge />} */}

            {/* SEARCH BAR */}
            {userRole === "staff" && (
              <>
                <Searchbar />

                {/* Institution Selector - Only show on allowed paths */}
                {shouldShowInstitutionFilters && (
                  <InstitutionFilters colors={colors} />
                )}
              </>
            )}
          </Box>

          {/* ICONS */}
          <Box display="flex" alignItems="center">
            {isMultiRole && (
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <Box>
                    <Tooltip title="Roles Switch">
                      <IconButton {...bindTrigger(popupState)} sx={{ mr: 1 }}>
                        <WidgetsOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      {...bindMenu(popupState)}
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          icon="fluent:window-multiple-16-filled"
                          height={15}
                          width={15}
                        />
                        <Typography variant="body2" ml={0.2}>
                          Manage User Roles
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          m: "1px 9px",
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "8px",
                        }}
                      >
                        {roles.map((role) => {
                          if (role) {
                            const isRoleActive =
                              role.role_name
                                .toLowerCase()
                                .replace(/ /g, "_") === isActiveRole;

                            return (
                              <MenuItem
                                key={role.role_id}
                                disabled={isLoadingSwitch}
                                onClick={() => {
                                  if (!isRoleActive) {
                                    popupState.close();
                                    handleRoleSwitch(role.role_id);
                                  }
                                }}
                                sx={{
                                  borderRadius: 1,
                                  minWidth: 125,
                                  display: "flex",
                                  justifyContent: "center",
                                  backgroundColor: role.status
                                    ? colors.blueAccent[600]
                                    : "inherit",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  {/* Render the role-specific icon here */}
                                  {role.role_name === "Admin" && (
                                    <Icon
                                      icon="ic:baseline-admin-panel-settings"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Talent" && (
                                    <Icon
                                      icon="game-icons:hive-mind"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Staff" && (
                                    <Icon
                                      icon="mdi:people-group"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Manager" && (
                                    <Icon
                                      icon="fa-solid:user-cog"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Talent Module" && (
                                    <Icon
                                      icon="fluent:brain-circuit-20-filled"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Educator" && (
                                    <Icon
                                      icon="fa-solid:user-tie"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Management" && (
                                    <Icon
                                      icon="mdi:user-group"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Spoc" && (
                                    <Icon
                                      icon="solar:user-speak-bold"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "Account Manager" && (
                                    <Icon
                                      icon="mdi:account-lock-outline"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "leaders" && (
                                    <Icon
                                      icon="mdi:account-star"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {role.role_name === "dspoc" && (
                                    <Icon
                                      icon="mdi:account-supervisor"
                                      height={22}
                                      width={22}
                                    />
                                  )}
                                  {/* Render the role name */}
                                  <Typography variant="subtitle2">
                                    {role.role_name}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </Box>
                    </Menu>
                  </Box>
                )}
              </PopupState>
            )}
            <Tooltip
              title={
                theme.palette.mode === "light"
                  ? "Toggle Dark Mode"
                  : "Toggle Light Mode"
              }
            >
              <IconButton onClick={colorMode.toggleColorMode} sx={{ mr: 1 }}>
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>

            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <>
                  <Tooltip title="Profile">
                    <Avatar
                      alt="Remy Sharp"
                      src={Profile}
                      sx={{ width: 32, height: 32, ml: 1, cursor: "pointer" }}
                      {...bindTrigger(popupState)}
                    />
                  </Tooltip>
                  <Menu {...bindMenu(popupState)} sx={{ mt: 2.5, px: 3 }}>
                    <Box sx={{ py: 1, px: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color={colors.blueAccent[200]}
                        sx={{ ml: 0.4, mt: -0.8 }}
                      >
                        {formattedUserName ? formattedUserName : "User Name"}
                      </Typography>
                      <Badge
                        color="secondary"
                        badgeContent="active"
                        variant="dot"
                      >
                        <Typography
                          fontWeight="bold"
                          variant="caption"
                          sx={{
                            bgcolor: colors.grey[900],
                            px: 0.8,
                            borderRadius: 1,
                          }}
                        >
                          {isActiveRole ? isActiveRole : "Email Address"}
                        </Typography>
                      </Badge>
                    </Box>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        // When clicked from menu, use the menu item as position reference
                        const menuItem = document.activeElement;
                        if (menuItem) {
                          const rect = menuItem.getBoundingClientRect();
                          setButtonRect({
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                            centerX: rect.left + rect.width / 2,
                            centerY: rect.top + rect.height / 2,
                          });
                          setTimeout(() => {
                            setIsModalOpen(true);
                            popupState.close();
                          }, 10);
                        } else {
                          handleProfile(popupState);
                        }
                      }}
                      disabled={true}
                      sx={{
                        borderRadius: 1,
                        minWidth: 125,
                        m: "2px 10px",
                        mt: 1,
                      }}
                    >
                      <AccountCircleOutlinedIcon sx={{ mr: 1 }} />
                      Institute Profile
                    </MenuItem>

                    <MenuItem
                      onClick={() => handleSettings(popupState)}
                      sx={{
                        borderRadius: 1,
                        minWidth: 125,
                        m: "2px 10px",
                      }}
                      disabled
                    >
                      <SettingsOutlinedIcon sx={{ mr: 1 }} />
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      disabled={isLoading}
                      onClick={handleLogout}
                      sx={{
                        borderRadius: 1,
                        minWidth: 125,
                        m: "3px 10px",
                        "&:hover": {
                          backgroundColor: colors.redAccent[800],
                        },
                      }}
                    >
                      <LogoutOutlinedIcon sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </PopupState>
          </Box>
        </Box>
      </Box>

      {/* Animated Modal */}
      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        buttonRect={buttonRect}
      />
    </>
  );
};

export default Topbar;
