// src/components/SearchableDropdownCard.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";

const SearchableDropdownCard = ({ label, options }) => {
  return (
    <Card>
      <CardContent>
        <Autocomplete
          options={options}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
      </CardContent>
    </Card>
  );
};

export default SearchableDropdownCard;
