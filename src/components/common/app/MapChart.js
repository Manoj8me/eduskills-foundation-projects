// import { Box, useTheme } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import DatamapsIndia from "react-datamaps-india";
// import { tokens } from "../../../theme";

// const MapChart = ({ regionData }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const HoverComponent = React.memo(({ value }) => {
//     const [values, setValues] = useState({});

//     useEffect(() => {
//       setValues(value);
//     }, [value?.name]);

//     return (
//       <Box sx={{ color: colors.blueAccent[100] }}>
//         {values?.name} {values?.value}
//       </Box>
//     );
//   });

//   return (
//     <Box
//       sx={{ position: "relative", width: 318, height: 318, cursor: "pointer" }}
//     >
//       <DatamapsIndia
//         regionData={regionData}
//         hoverComponent={({ value }) => <HoverComponent value={value} />}
//         mapLayout={{
//           // title: "OCs Deployed per State in India",
//           legendTitle: "Institute Density",
//           startColor: "#C3F0FF",
//           endColor: "#004B86",
//           hoverTitle: "Count",
//           noDataColor: "#f5f5f5",
//           borderColor: "#8D8D8D",
//           hoverColor: colors.blueAccent[200],
//           hoverBorderColor: colors.greenAccent[200],
//           height: 10,
//           weight: 30,
//         }}
//       />
//     </Box>
//   );
// };

// export default MapChart;
import { Box, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import DatamapsIndia from "react-datamaps-india";
import { tokens } from "../../../theme";

const MapChart = ({ regionData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const HoverComponent = React.memo(({ value }) => {
    const [values, setValues] = useState({});

    useEffect(() => {
      if (value && value.name !== values.name) {
        setValues(value);
      }
    }, [value]);

    if (!values.name) {
      return null;
    }
 
    return (
      <Box sx={{ color: "#004B86" }}>
        {values.name} {values.value}
      </Box>
    );
  });

  const hoverComponent = useMemo(() => {
    return ({ value }) => <HoverComponent value={value} />;
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: 318,
        height: 318,
        cursor: "default",
        bgcolor: colors.background[100],
        borderRadius: 1,
      }}
    >
      <DatamapsIndia
        regionData={regionData}
        hoverComponent={hoverComponent}
        mapLayout={{
          // title: "OCs Deployed per State in India",
          legendTitle: "Institute Density",
          startColor: "#C1F7FF",
          endColor: "#004B86",
          hoverTitle: "Count",
          noDataColor: "#f5f5f5",
          borderColor: "#8D8D8D",
          hoverColor: colors.blueAccent[200],
          hoverBorderColor: colors.greenAccent[200],
          height: 10,
          weight: 30,
        }}
      />
    </Box>
  );
};

export default MapChart;
