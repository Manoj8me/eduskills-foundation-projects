import React from "react";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function TogglePage({ onChangePageSize, pageSize }) {
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      onChangePageSize(newAlignment);
    }
  };


  return (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup
        value={pageSize} // Set the value prop to the current page size
        exclusive
        onChange={handleAlignment}
        aria-label="page size"
        sx={{ height: "25px" }}
      >
        <ToggleButton value={10} aria-label="10" >
          10    
        </ToggleButton>
        <ToggleButton value={50} aria-label="50" >
          50
        </ToggleButton>
        <ToggleButton value={100} aria-label="100" disabled>
          100
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
