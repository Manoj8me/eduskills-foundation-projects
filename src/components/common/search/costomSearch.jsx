import React, { useState } from "react";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

const StyledSearch = styled(OutlinedInput)(({ height }) => ({
  minWidth: 220,
  height: `${height}px !important`,
  transition: "width 0.3s",
  "& fieldset": {
    borderWidth: "1px !important",
    borderColor: `gray !important`,
  },
  "&.MuiInputBase-root, &.MuiOutlinedInput-root": {
    paddingRight: "2px !important",
  },
}));

const CustomSearch = ({
  onSearch,
  showSearchButton = true,
  height = 28,
  setRefresh,
}) => {
  const theme = useTheme();
  const [filterName, setFilterName] = useState("");
  const [clearIcon, setClearIcon] = useState(false);

  const handleClearSearch = () => {
    setFilterName("");
    setClearIcon(false);
    setRefresh((pre) => !pre);
  };

  const handleSearchClick = () => {
    // Perform search using filterName
    onSearch(filterName);
  };

  return (
    <StyledSearch
      value={filterName}
      onChange={(e) => {
        setFilterName(e.target.value);
        setClearIcon(Boolean(e.target.value.trim()));
      }}
      placeholder="Search..."
      height={height}
      endAdornment={
        <>
          {clearIcon && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} sx={{ p: 0.1, mr: -0.8 }}>
                <Icon
                  icon="entypo:cross"
                  fontSize={16}
                  sx={{ color: "text.disabled" }}
                />
              </IconButton>
            </InputAdornment>
          )}

          {showSearchButton && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleSearchClick}>
                <Icon icon="bx:search-alt" />
              </IconButton>
            </InputAdornment>
          )}
        </>
      }
    />
  );
};

export default CustomSearch;
