import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";

const SelectWithSearch = React.memo(
  ({ Label, options, setValue, borderRadius, isLoading }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    useEffect(() => {
      setValue(selectedValue ? selectedValue.value : "");
    }, [selectedValue]);

    useEffect(() => {
      if (!selectedValue && options && options.length > 0) {
        setSelectedValue(options[0]);
      }
    }, [options, selectedValue]);

    return (
      <Autocomplete
        value={selectedValue || null}
        disabled={isLoading}
        inputValue={searchInput}
        onInputChange={(event, newInputValue) => {
          setSearchInput(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedValue(newValue);
          }
        }}
        options={options}
        size="small"
        getOptionLabel={(option) => option?.label}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={Label}
            variant="outlined"
            color="info"
            sx={borderRadius}
            margin="dense"
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const matches = option?.label
            .toLowerCase()
            .includes(inputValue.toLowerCase());
          const parts = option?.label.split(
            new RegExp(`(${inputValue})`, "gi")
          );

          return (
            <MenuItem {...props} >
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  sx={{
                    // ...(matches && selectedValue
                    //   ? { fontWeight: 700, }
                    //   : ''),
                    whiteSpace: "normal",
                    fontSize: 12 
                  }}
                >
                  {part}
                </Typography>
              ))}
            </MenuItem>
          );
        }}
      />
    );
  }
);

export default SelectWithSearch;
