// import { useState } from "react";
// import { Box } from "@mui/system";
// import Topbar from "./Topbar";
// import Sidebar from "./Sidebar";
// // import Footer from "./Footer";
// import { useMediaQuery, useTheme } from "@mui/material";

// function Layout(props) {
//   const [toggleDrawer, setToggleDrawer] = useState(false);
//   // const [disableMouseover, setDisableMouseover] = useState(true);

//   const theme = useTheme();
//   const isMediumScreen = useMediaQuery(theme.breakpoints.up("lg"));

//   // Use useLayoutEffect to avoid layout thrashing
//   // useLayoutEffect(() => {
//   //   // setIsCollapsed(!isMediumScreen);
//   //   setDisableMouseover(!isMediumScreen);
//   // }, [isMediumScreen]);

//   const onToggleDrawer = () => {
//     setToggleDrawer(!toggleDrawer);
//   };

//   return (
//     <>
//       {isMediumScreen ? (
//         <Box
//           display="flex"
//           flex={1}
//           height="100vh"
//           width="100vw"
//           overflow="auto"
//         >
//           <Sidebar toggleDrawer={toggleDrawer} />
//           <Box
//             display="flex"
//             flexDirection="column"
//             width="100%"
//             overflow="auto"
//           >
//             <Box sx={{ position: "static", top: 0 }}>
//               <Topbar onToggleDrawer={onToggleDrawer} />
//             </Box>
//             <main
//               flex={1}
//               overflow="auto"
//               // overflowX="auto"
//             >
//               {props.children}
//             </main>
//             {/* <Box sx={{ position: "static", top: 0 }}><Footer /></Box> */}
//           </Box>
//         </Box>
//       ) : (
//         <div className="app">
//           <Sidebar
//             toggleDrawer={toggleDrawer}
//             setToggleDrawer={setToggleDrawer}
//           />

//           <Box className="content">
//             <Topbar onToggleDrawer={onToggleDrawer} />

//             <main style={{ overflow: "auto", height: "100%" }}>
//               {props.children}
//               {/* <Footer /> */}
//             </main>
//           </Box>
//         </div>
//       )}
//     </>
//   );
// }

// export default Layout;

import { useState } from "react";
import { Box } from "@mui/system";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
// import Footer from "./Footer";
import { useMediaQuery, useTheme } from "@mui/material";

function Layout(props) {
  const [toggleDrawer, setToggleDrawer] = useState(false);
  // const [disableMouseover, setDisableMouseover] = useState(true);

  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const onToggleDrawer = () => {
    setToggleDrawer(!toggleDrawer);
  };

  return (
    <>
      <Box display="flex" flex={1} height="100vh" width="100vw">
        {isMediumScreen ? (
          <Sidebar toggleDrawer={toggleDrawer} />
        ) : (
          <Sidebar
            toggleDrawer={toggleDrawer}
            setToggleDrawer={setToggleDrawer}
          />
        )}
        <Box display="flex" flexDirection="column" width="100%" overflow="auto">
          <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
            <Topbar onToggleDrawer={onToggleDrawer} />
          </Box>
          <main
            flex={1}
            overflow="auto"
            // overflowX="auto"
          >
            {props.children}
          </main>
          {/* <Box sx={{ position: "static", top: 0 }}><Footer /></Box> */}
        </Box>
      </Box>
    </>
  );
}

export default Layout;
