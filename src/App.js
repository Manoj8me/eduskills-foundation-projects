import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Index from "./Routes";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthService } from "./services/dataService";
import { setTokens } from "./store/Slices/auth/authSlice";
import { setUserRole } from "./store/Slices/auth/authoriseSlice";
import IdleDetector from "./utils/IdleDetector";
import loadingGif from "./assets/Untitled design.gif"; // Import your GIF
import { SocketProvider } from "./components/Hooks/Useshocket";

function App() {
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const query = new URLSearchParams(window.location.search);
      const accessToken = query.get("accessToken");
      const refreshToken = query.get("refreshToken");
      const email = query.get("email");

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userName", email);
        dispatch(setTokens({ accessToken, refreshToken }));
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        try {
          const rolesResponse = await AuthService.roles();
          const fetchedRoles = rolesResponse.data.roles;
          const activeRole = fetchedRoles.find((role) => role.status === true);
          if (activeRole) {
            const activeRoleNameModified = activeRole.role_name
              .toLowerCase()
              .replace(/ /g, "_");
            localStorage.setItem("Authorise", activeRoleNameModified);
            dispatch(setUserRole(activeRoleNameModified));
            navigate("/dashboard");
          }
        } catch (error) {
          console.log("Error fetching roles:", error);
        }
      }
      setIsLoading(false);
    };

    initialize();
  }, [navigate, dispatch]);

  // Check if user is logged in (to determine if we should use idle detection)
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Don't show idle detector on login page

  if (isLoading) {
    return (
      <div className="min-h-[100vh] justify-center flex items-center">
        <img
          src={loadingGif}
          alt="Loading..."
          className="w-[30%] h-auto object-cover"
        />
      </div>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? (
          <SocketProvider>
            <IdleDetector idleTimeout={600000}>
              {" "}
              {/* 30000ms = 30 seconds (for testing) */}
              <Index />
            </IdleDetector>
          </SocketProvider>
        ) : (
          <Index />
        )}
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
