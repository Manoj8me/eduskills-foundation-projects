import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Tabs, Tab, Typography, Paper, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import AwardManagementSystem from "../Admin/NominationMarking/AwardManagementSystem";
import Agenda from "../AdminAgenda/Addagenda";
import ConnectRegistrations from "../Admin/NominationMarking/ConnectRegistrations";
import FeedbackTable from "../Admin/NominationMarking/FeedbackTable";

// Color design tokens
const colorModeKey = "colorMode";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#c2c2c2",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#F2FAFF",
          200: "#E6F5FF",
          300: "#C3F0FF",
          400: "#7DD0F8",
          500: "#5BB6E7",
          600: "#39A1D5",
          700: "#1B7CB3",
          800: "#004B86",
          900: "#003662",
        },
        background: {
          100: "#141b2d",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#003662",
          200: "#004B86",
          300: "#1B7CB3",
          400: "#39A1D5",
          500: "#5BB6E7",
          600: "#7DD0F8",
          700: "#C3F0FF",
          800: "#E6F5FF",
          900: "#F2FAFF",
        },
        background: {
          100: "#fcfcfc",
        },
      }),
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [mode, setMode] = useState(
    localStorage.getItem(colorModeKey) || (prefersDarkMode ? "dark" : "light")
  );

  useEffect(() => {
    localStorage.setItem(colorModeKey, mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};

// Tab Panel Component
function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main Tab Switch Component
function EventTabsComponent() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: colors.background[100],
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h2" sx={{ color: colors.grey[100] }}>
              Connect 25
            </Typography>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <Brightness7 sx={{ color: colors.grey[100] }} />
              ) : (
                <Brightness4 />
              )}
            </IconButton>
          </Box>

          <Box sx={{ width: "100%" }}>
            <Paper
              sx={{
                backgroundColor: "white",
                position: "sticky",
                top: "70px",
                zIndex: 999,
                // boxShadow: 3,
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                sx={{
                  "& .MuiTab-root": {
                    color: colors.grey[100],
                    fontWeight: 500,
                    fontSize: "14px",
                    textTransform: "none",
                  },
                  "& .Mui-selected": {
                    color: colors.blueAccent[500],
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: colors.blueAccent[500],
                  },
                }}
              >
                <Tab label="Awards" />
                <Tab label="Agenda" />
                <Tab label="Registrations" />
                <Tab label="Feedback" />
              </Tabs>
            </Paper>

            <TabPanel value={value} index={0}>
              <AwardManagementSystem />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Agenda />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ConnectRegistrations />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <FeedbackTable />
            </TabPanel>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default EventTabsComponent;
