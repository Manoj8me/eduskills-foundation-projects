import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Popover,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import { useDispatch, useSelector } from "react-redux";
import { fetchInstituteState } from "../../../store/Slices/dashboard/statepackageSlice";
import { TalentConnectService } from "../../../services/dataService";

const status = [
  { id: 0, title: "Rejected" },
  { id: 1, title: "Applied" },
  { id: 2, title: "Shortlisted R1" },
  { id: 3, title: "Shortlisted R2" },
  { id: 4, title: "Shortlisted R3" },
  { id: 5, title: "Not Attended R1" },
  { id: 6, title: "Not Attended R2" },
  { id: 7, title: "Not Attended R3" },
  { id: 8, title: "Selected" },
];

const FilterSearch = ({ openFilter, handleClosFilter, onSelect }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const [selectedValues, setSelectedValues] = useState({
    // state: null,
    // institute: null,
    company: null,
    job_title: null,
    status: null,
  });

  const [formValid, setFormValid] = useState(false);
  const [instituteList, setInstituteList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [jobTitle, setJobTitle] = useState([]);

  const companyData = companyList?.map((company) => ({
    id: company.company_id,
    title: company.company_name,
  }));

  const instData = instituteList?.map((inst) => ({
    id: inst.institute_id,
    title: inst.institute_name,
  }));

  const jobTitleData = jobTitle?.map((inst) => ({
    id: inst.jd_id,
    title: inst.job_title,
  }));

  useEffect(() => {
    dispatch(fetchInstituteState());
  }, []);

  const stateList = useSelector((state) => state.statePackage.instituteState);

  const stateData = stateList?.map((state) => ({
    id: state.state_id,
    title: state.state_name,
  }));

  // useEffect(() => {
  //   const fetchInstitute = async () => {
  //     if (selectedValues?.state?.id !== (null || undefined)) {
  //       // const stateIds = { states: selectedState.map((item) => item.value) };
  //       const stateIds = { states: [selectedValues?.state?.id] };
  //       try {
  //         const res = await TalentConnectService.institute_by_state(stateIds);
  //         const data = res.data.data;
  //         // const updateData = data.map((item) => ({ ...item, status: "0" }));
  //         setSelectedValues({ ...selectedValues, institute: null });
  //         setInstituteList(data);
  //         // setInstituteList(updateData);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };
  //   fetchInstitute();
  // }, [selectedValues?.state?.id]);

  const fetchEducatorList = async () => {
    try {
      const response = await TalentConnectService.company();
      setCompanyList(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
    }
  };
  useEffect(() => {
    fetchEducatorList();
  }, []);

  const fetchJobTitle = async () => {
    if (selectedValues?.company?.title) {
      try {
        const response = await TalentConnectService.jd();

        const data = response.data.data;

        const filterData = data.filter(
          (item) => item.company_name === selectedValues?.company?.title
        );
        setSelectedValues({ ...selectedValues, job_title: null });
        setJobTitle(filterData);
      } catch (error) {
        //   console.error("Error fetching data:", error);
      } finally {
        // setLoadingTable(false); // Set loading to false when fetching is complete (success or failure)
      }
    }
  };
  useEffect(() => {
    fetchJobTitle();
  }, [selectedValues?.company?.title]);

  useEffect(() => {
    // Check form validity whenever selectedValues change
    const isValid = Object.values(selectedValues).every((value) => !!value);
    setFormValid(isValid);
  }, [selectedValues]);

  const filterData = [
    // {
    //   placeholder: "Select State",
    //   type: "select",
    //   name: "state",
    //   isDisable: false,
    //   option: stateData || [],
    // },
    // {
    //   placeholder: "Select Institute",
    //   type: "select",
    //   name: "institute",
    //   isDisable: !selectedValues.state,
    //   option: instData || [],
    // },
    {
      placeholder: "Select Company",
      type: "select",
      name: "company",
      isDisable: false,
      option: companyData || [],
    },
    {
      placeholder: "Select Job Title",
      type: "select",
      name: "job_title",
      isDisable: !selectedValues.company,
      option: jobTitleData || [],
    },
    {
      placeholder: "Select Status",
      type: "select",
      name: "status",
      isDisable: false,
      option: status,
    },
  ];

  const handleAutocompleteChange = (name, value) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSelect(selectedValues);
    handleClosFilter();
    // setSelectedValues({
    //   state: null,
    //   institute: null,
    //   company: null,
    //   job_title: null,
    //   status: null,
    // });
  };

  return (
    <Popover
      open={Boolean(openFilter)}
      anchorEl={openFilter}
      onClose={handleClosFilter}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
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
                value={selectedValues[item.name]}
                getOptionLabel={(option) => option?.title}
                renderInput={(params) => (
                  <TextField
                    color="info"
                    {...params}
                    label={item.placeholder}
                    variant="outlined"
                  />
                )}
                onChange={(event, value) =>
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
            disabled={!formValid}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Popover>
  );
};

export default FilterSearch;
