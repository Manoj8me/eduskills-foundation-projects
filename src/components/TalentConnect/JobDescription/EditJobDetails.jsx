import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  useTheme,
  Autocomplete,
  MenuItem,
} from "@mui/material";

import { tokens } from "../../../theme";
import { TalentConnectService } from "../../../services/dataService";
// import label from "../../label";
const genderOptions = [
  { value: 1, label: "male" },
  { value: 2, label: "female" },
  { value: 3, label: "other" },
];

const weeklyOffOptions = [
  { value: 0, label: "No Weekly Off" },
  { value: 1, label: "1 Day" },
  { value: 2, label: "2 Days" },
  { value: 3, label: "3 Days" },
];

const EditJobDetails = ({ setJobDetails, setIsDetailsFilled }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const jobDetails = localStorage.getItem("JOB_DETAILS");
  const updateValue = JSON.parse(jobDetails && jobDetails);
  const value = {
    ...updateValue,
    jd_title: updateValue?.job_title,
    jd_role: updateValue?.job_role,
    jd_location: updateValue?.job_location,
  };

  // Remove the old keys
  delete value?.job_title;
  delete value?.job_role;
  delete value?.job_location;
  // delete value.company_name;

  delete value?.created_at;

  const [hasChanges, setHasChanges] = useState(false);
  const [fieldValidities, setFieldValidities] = useState({});
  const [selectedValues, setSelectedValues] = useState({}); // Added this line
  const [companies, setCompanies] = useState([]);
  const fetchCompanyList = async () => {
    try {
      const response = await TalentConnectService.company();
      const data = response?.data?.data;
      const companyList = data.map((item) => ({
        value: item.company_id,
        label: item.company_name,
      }));

      setCompanies(companyList);
      // setEducator(response.data.data);
    } catch (error) {
      //   console.error("Error fetching data:", error);
      console.error(error);
    } finally {
      // setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fetchCompanyList();
  }, []);

  // const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // console.log(fieldValidities);

  const initialValue = () => {
    const defaultValues = {};
    config.fields.forEach((field) => {
      if (field.type === "switch") {
        // Set default value for switch type fields
        defaultValues[field.name] =
          field.variant === "yesNo" ? "no" : "InActive";
      }
    });

    return defaultValues;
  };

  const config = {
    fields: [
      {
        label: "Company Name",
        name: "company_id",
        type: "select",
        options: companies,
      },
      { label: "Jd Title", name: "jd_title", type: "text" },
      { label: "Jd Role", name: "jd_role", type: "text" },
      {
        label: "Weekly Off",
        name: "weekly_off",
        type: "select",
        options: weeklyOffOptions,
      },
      { label: "No. of Openings", name: "no_of_opening", type: "number" },
      { label: "Shifting Time", name: "shifting_time", type: "text" },
      { label: "Job Location", name: "jd_location", type: "text" },
      {
        label: "Gender",
        name: "gender",
        type: "multiselect",
        options: genderOptions,
      },
      { label: "Qualification", name: "qualification", type: "text" },
      { label: "Year of Passing", name: "year_of_passing", type: "text" },
      {
        label: "Matric Mark",
        name: "matric_mark",
        type: "number",
        inputProps: { min: 0, max: 100, step: 1 },
      },
      {
        label: "Diploma/12th Mark",
        name: "diploma_mark",
        type: "number",
        inputProps: { min: 0, max: 100, step: 1 },
      },
      {
        label: "Btech CGPA",
        name: "btech_mark",
        type: "number",
        inputProps: { min: 0, max: 10, step: 0.1 },
      },

      { label: "Package", name: "package", type: "text" },
      { label: "Joining", name: "joining", type: "text" },
      { label: "Backlog", name: "backlog", type: "switch", variant: "yesNo" },
      {
        label: "Status",
        name: "status",
        type: "switch",
        variant: "activeInactive",
      },
    ],
  };

  const [addedItem, setAddedItem] = useState(() => initialValue());

  useEffect(() => {
    const updateJD = {
      ...value,
      company_id: companies?.filter(
        (company) => company?.label === value?.company_name
      )[0]?.value,
      gender: value?.gender?.map((label) => {
        const matchingOption = genderOptions.find(
          (option) => option.label === label
        );
        return matchingOption ? { value: matchingOption.value, label } : null;
      }),

      backlog: value?.backlog == 0 ? "no" : value?.backlog == 1 ? "yes" : "no",
      year_of_passing:parseYearOfPassing(value?.year_of_passing)
      // status:
      //   value?.status === "InActive"
      //     ? 0
      //     : value?.status === "Active"
      //     ? "Active"
      //     : "InActive",
    };

    const initialItem = jobDetails ? updateJD : initialValue();

    setAddedItem(initialItem);
    setSelectedValues({});

  }, [companies, value !== null]);

  const parseYearOfPassing = (yearOfPassing) => {
    try {
      return JSON.parse(yearOfPassing);
    } catch (error) {
      console.error("Error parsing year_of_passing:", error);
      // Handle the error or return a default value as needed
      return null;
    }
  };

  useEffect(() => {
    validateFields();
  }, [addedItem]);

  useEffect(() => {
    if (hasChanges) {
      const numberFields = config.fields
        .filter((field) => field.type === "number")
        .map((field) => field.name);
      const data = {
        ...addedItem,
        gender: addedItem?.gender?.map((value) => value.label),
        status: addedItem?.status === "Active" ? 1 : 0,
        backlog: addedItem?.backlog === "yes" ? 1 : 0,
      };

      // Convert the values of number fields to numbers
      numberFields.forEach((fieldName) => {
        if (!isNaN(data[fieldName])) {
          data[fieldName] = parseFloat(data[fieldName]);
        }
      });
      setIsDetailsFilled(true);
      setJobDetails(data);
    } else {
      setIsDetailsFilled(false);
    }
  }, [hasChanges, addedItem]);

  const handleFieldChange = (name, value) => {
    const newAddedItem = { ...addedItem, [name]: value };
    setAddedItem(newAddedItem);

    const allFieldsFilled = config.fields.every((field) => {
      const fieldValue = newAddedItem[field.name];
      return (
        fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      );
    });

    if (name === "mobile") {
      if (value.length === 10) {
        setHasChanges(allFieldsFilled);
      } else {
        setHasChanges(false);
      }
    } else {
      setHasChanges(allFieldsFilled);
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const fieldValiditiesCopy = { ...fieldValidities };

    if (config.fields.find((field) => field.name === name)) {
      if (
        config.fields.find(
          (field) => field.name === name && field.type === "date"
        )
      ) {
        fieldValiditiesCopy[name] = value !== "null";
      }

      if (
        config.fields.find(
          (field) => field.name === name && field.type === "switch"
        )
      ) {
        fieldValiditiesCopy[name] = value !== undefined && value !== null;
      }
    }

    setFieldValidities(fieldValiditiesCopy);
  };

  const validateFields = () => {
    const fieldValiditiesCopy = { ...fieldValidities };

    config.fields.forEach((field) => {
      const fieldValue = addedItem[field.name];

      if (field.type === "date") {
        fieldValiditiesCopy[field.name] = fieldValue !== "null";
      }

      if (field.type === "switch") {
        fieldValiditiesCopy[field.name] =
          fieldValue !== undefined && fieldValue !== null;
      }
    });

    setFieldValidities(fieldValiditiesCopy);
  };

  return (
    <Box>
      <Grid container spacing={1}>
        {config.fields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.name}>
            {field.type === "switch" ? (
              <Box sx={{ alignItems: "center", display: "flex" }}>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 500,
                    color:
                      (field.variant === "yesNo" &&
                        addedItem[field.name] === "yes") ||
                      (field.variant === "activeInactive" &&
                        addedItem[field.name] === "Active")
                        ? colors.blueAccent[300]
                        : colors.grey[600],
                    bgcolor:
                      (field.variant === "yesNo" &&
                        addedItem[field.name] === "yes") ||
                      (field.variant === "activeInactive" &&
                        addedItem[field.name] === "Active")
                        ? colors.blueAccent[700]
                        : colors.grey[900],
                    px: 1.5,
                    py: 0.3,
                    borderRadius: 1,
                  }}
                >
                  {field.label}
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      name={field.name}
                      color="info"
                      sx={{ ml: 1.5 }}
                      checked={
                        (field.variant === "yesNo" &&
                          addedItem[field.name] === "yes") ||
                        (field.variant === "activeInactive" &&
                          addedItem[field.name] === "Active")
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          field.name,
                          e.target.checked
                            ? field.variant === "yesNo"
                              ? "yes"
                              : "Active"
                            : field.variant === "yesNo"
                            ? "no"
                            : "InActive"
                        )
                      }
                    />
                  }
                  label={
                    (field.variant === "yesNo" && addedItem[field.name]) ||
                    (field.variant === "activeInactive" &&
                      addedItem[field.name])
                  }
                />
              </Box>
            ) : field.type === "date" ? (
              <TextField
                label={field.label}
                color="info"
                size="small"
                name={field.name}
                type="date"
                value={addedItem[field.name] || "null"}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                fullWidth
                margin="dense"
              />
            ) : field.type === "select" ? (
              <Autocomplete
                value={
                  field.options.find(
                    (option) => option.value === addedItem[field.name]
                  ) ||
                  selectedValues[field.name] ||
                  null
                }
                onChange={(event, newValue) => {
                  const newSelectedValues = {
                    ...selectedValues,
                    [field.name]: newValue,
                  };
                  setSelectedValues(newSelectedValues);
                  handleFieldChange(
                    field.name,
                    newValue ? newValue.value : null
                  );
                }}
                options={field.options || []}
                size="small"
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    variant="outlined"
                    margin="dense"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                  />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                  const parts = option.label.split(
                    new RegExp(`(${inputValue})`, "gi")
                  );

                  return (
                    <MenuItem {...props}>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={matches ? { fontWeight: 700 } : {}}
                        >
                          {part}
                        </span>
                      ))}
                    </MenuItem>
                  );
                }}
              />
            ) : field.type === "multiselect" ? (
              <Autocomplete
                multiple
                value={
                  field.options.filter((option) =>
                    addedItem[field.name]?.some(
                      (selectedItem) => selectedItem.value === option.value
                    )
                  ) ||
                  selectedValues[field.name] ||
                  null
                }
                onChange={(event, newValues) => {
                  const newSelectedValues = {
                    ...selectedValues,
                    [field.name]: newValues,
                  };

                  setSelectedValues(newSelectedValues);
                  handleFieldChange(
                    field.name,
                    newValues.map((val) => ({
                      value: val.value,
                      label: val.label,
                    }))
                  );
                }}
                options={field?.options || []}
                size="small"
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    variant="outlined"
                    margin="dense"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <>{params.InputProps.endAdornment}</>,
                    }}
                  />
                )}
              />
            ) : field.type === "multiline" ? (
              <TextField
                label={field.label}
                color="info"
                size="small"
                multiline
                rows={4} // Set the number of rows as needed
                name={field.name}
                value={addedItem[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                fullWidth
                margin="dense"
              />
            ) : (
              <TextField
                label={field.label}
                color="info"
                size="small"
                // type={field.type === "number" ? "number" : "text"}
                name={field.name}
                value={addedItem[field.name] || ""}
                onChange={(e) => {
                  if (field.type === "number") {
                    if (field?.inputProps?.step === 0.1) {
                      const inputValue = e.target.value;
                      const validFormat = /^(\d*\.\d{0,1}|\d{0,1})$/.test(
                        inputValue
                      );

                      if (validFormat) {
                        handleFieldChange(field.name, inputValue);
                      }
                    } else if (field?.inputProps?.step === 1) {
                      const inputValue = e.target.value;
                      const validFormat = /^\d{0,2}$/.test(inputValue);

                      if (validFormat) {
                        handleFieldChange(field.name, inputValue);
                      }
                    } else {
                      const inputValue = e.target.value;
                      if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                        // Only allow numeric characters and limit to a maximum of 10
                        handleFieldChange(field.name, inputValue);
                      }
                    }
                  } else {
                    handleFieldChange(field.name, e.target.value);
                  }
                }}
                fullWidth
                margin="dense"
                // {...(field.inputProps ? { inputProps: field.inputProps } : {})}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EditJobDetails;
