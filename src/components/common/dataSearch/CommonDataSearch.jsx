import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import SelectWithSearch from "../SelectWithSearch";
import { useDispatch } from "react-redux";
// import { setSelectedDataSearchValues } from "../../../store/Slices/common/commonSlice";

const CommonDataSearch = React.memo(({ data, setSelected, isTableLoading }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const dispatch = useDispatch();

  // const selectedDataSearchValues = useSelector(
  //   (state) => state.common.selectedDataSearchValues
  // );

  const handleSearch = () => {
    dispatch(setSelected(selectedValues));
    // dispatch(setSelectedDataSearchValues(selectedValues));
  };

  const handleSelectChange = (key, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };
  const index1Label = data[0].label;
  const index3Label = data[2].label;

  const allFieldsSelected =
    Object.values(selectedValues).every(
      (value) => value !== null && value !== ""
    ) &&
    selectedValues[index1Label] !== 0 &&
    selectedValues[index3Label] !== 0;

  return (
    <Grid container spacing={2} sx={{ mt: -1.5 }}>
      {data.map((item, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          {index === data.length - 1 ? (
            <Box display="flex">
              <Box width="60%">
                <SelectWithSearch
                  Label={item.label}
                  options={item.option || []}
                  isLoading={isTableLoading}
                  setValue={(value) => handleSelectChange(item.label, value)}
                  borderRadius={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px 0 0 5px !important",
                    },
                  }}
                />
              </Box>
              <Box width="40%">
                <Button
                  fullWidth
                  variant="contained"
                  color="info"
                  sx={{
                    height: 37,
                    mt: 1.01,
                    
                    borderRadius: "0px 5px 5px 0px",
                  }}
                  disabled={!allFieldsSelected || isTableLoading}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Box>
          ) : (
            <SelectWithSearch
              Label={item.label}
              options={item.option || []}
              isLoading={isTableLoading}
              setValue={(value) => handleSelectChange(item.label, value)}
              defaultValue={item.option ? item.option[0] : null}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
});

export default CommonDataSearch;
