import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Grid,
  Popover,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";

// const filterData = [
//   {
//     placeholder: "Select State",
//     type: "select",
//     name:"state",
//     isDisable: false,
//     option: [
//       {title:"ok ok", id:1}
//     ],
//   },
//   {
//     placeholder: "Select Institute",
//     type: "select",
//     name:"institute",
//     isDisable: false,
//     option: [
//       {title:"ok ok", id:1}
//     ],
//   },
//   {
//     placeholder: "Select Company",
//     type: "select",
//     name:"company",
//     isDisable: false,
//     option: [
//       {title:"ok ok", id:1}
//     ],
//   },
//   {
//     placeholder: "Select Job Title",
//     type: "select",
//     name:"job_title",
//     isDisable: false,
//     option: [
//       {title:"ok ok", id:1}
//     ],
//   },
//   {
//     placeholder: "Select Status",
//     type: "select",
//     name:"status",
//     isDisable: false,
//     option: [
//       {title:"ok ok", id:1},
//       {title:"ok ok ok", id:2},
//     ],
//   },
// ];

const CustomFilterSearch = ({
  openFilter,
  handleClosFilter,
  filterData,
  onSelect,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedValues, setSelectedValues] = useState({});

  const handleAutocompleteChange = (name, value) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    // onSelect(selectedValues);
    handleClosFilter();
  };

  return (
    <Popover
      open={Boolean(openFilter)}
      anchorEl={openFilter}
      onClose={handleClosFilter}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {/* <Box sx={{ bgcolor: colors.blueAccent[900],py: 1,}}>
        <Typography
          variant="h5"
          sx={{ mb: 0.5, fontSize: 10, fontWeight: 600 }}
        >
          Academy
        </Typography>
        <Divider />
        </Box> */}
      <Grid
        container
        spacing={1.5}
        sx={{
          px: 1.5,
          py: 2,
          maxWidth: 400,
          bgcolor: colors.background[100],
        }}
      >
        {filterData.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            {item.type === "select" && (
              <Autocomplete
                size="small"
                disabled={item.isDisable}
                options={item.option}
                getOptionLabel={(option) => option?.title}
                renderInput={(params) => (
                  <TextField
                    color="info"
                    {...params}
                    label={item.placeholder}
                    variant="outlined"
                  />
                )}
                onChange={(value) =>
                  handleAutocompleteChange(item?.name, value)
                }
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12} sm={6}>
          <Button
            color="info"
            variant="outlined"
            size="small"
            sx={{ width: "100%", height: "100%" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
};

export default CustomFilterSearch;
