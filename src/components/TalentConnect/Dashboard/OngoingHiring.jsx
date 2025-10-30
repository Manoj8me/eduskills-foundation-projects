import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Select,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../../../theme";
import CountCard from "../../common/card/CountCard";
import { Icon } from "@iconify/react";
import HiringDetails from "./HiringDetails";
const companyList = [
  { company_id: 1, company_name: "ABC Comapny1" },
  { company_id: 2, company_name: "ABC Comapny2" },
  { company_id: 3, company_name: "ABC Comapny3" },
];

const titleList = [
    {company_id: 1, company_title: "demo title 1"},
    {company_id: 2, company_title: "demo title 2"},
    {company_id: 3, company_title: "demo title 3"},
    {company_id: 4, company_title: "demo title 4"},

]
const OngoingHiring = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [titleOption, setTitleOption] = useState(1);
  const openfilterPopover = Boolean(anchorEl2);
  const handleFilterPopoverClose = () => {
    setAnchorEl2(null);
  };

  const handleChanges = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleTitleChanges = (event) => {
    setTitleOption(event.target.value);
  };

  const handleFilterIconClick = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  return (
    <Card
      sx={{ bgcolor: colors.blueAccent[800], py: 0.5, px: 1, minHeight: 200 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            color: colors.blueAccent[300],
            fontWeight: 600,
            ml: 0.5,
          }}
        >
          Ongoing Hiring
        </Typography>
        <Tooltip title="Filter" placement="top">
          <IconButton
            color="info"
            sx={{ p: 0.2 }}
            onClick={handleFilterIconClick}
          >
            <Icon icon="ion:filter-circle-sharp" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />

      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CountCard
              data={[]}
              gridSize={{ xs: 12 }}
              bgcolor={colors.blueAccent[900]}
              spacing={1}
              cardSize={{
                // py: 1,
                // px: 1.2,
                py: 0.6,
                px: 1,
                skeleton: { icon: 30, count: 18, title: 12 },
                // skeleton: { icon: 43, count: 25, title: 17.6 },
                // dataCard: { icon: 35, count: 20, title: 13 },
                dataCard: { icon: 30, count: 18, title: 12 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <HiringDetails />
          </Grid>
        </Grid>
      </Box>
      <Popover
        open={openfilterPopover}
        anchorEl={anchorEl2}
        onClose={handleFilterPopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box px={2} py={1.5}>
          {/*  Label, options, setValue, borderRadius, isLoading */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <FormControl sx={{ minWidth: 60, mr: 1 }}>
              <Select
                value={selectedOption}
                size="small"
                color="info"
                // disabled={isLoadingDomain}
                sx={{ maxHeight: 28, fontSize: 10, mx: 0, px: 0 }}
                onChange={handleChanges}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {companyList?.map((item) => (
                  <MenuItem
                    key={item.company_id}
                    value={item.company_id}
                    style={{ textAlign: "center", fontSize: 12 }}
                  >
                    {item.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 60 }}>
              <Select
                value={titleOption}
                size="small"
                color="info"
                // disabled={isLoadingDomain}
                sx={{ maxHeight: 28, fontSize: 10, mx: 0, px: 0 }}
                onChange={handleTitleChanges}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                {titleList?.map((item) => (
                  <MenuItem
                    key={item.company_id}
                    value={item.company_id}
                    style={{ textAlign: "center", fontSize: 12 }}
                  >
                    {item.company_title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              color="info"
              variant="outlined"
              size="small"
              // disabled={isLoadingDomain}
              sx={{ ml: 1 }}
              startIcon={<Icon icon="uil:search" />}
              onClick={() => {
                handleFilterPopoverClose();
                // fetchData();
                // fetchInstituteData();
                // fetchStateData();
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Popover>
    </Card>
  );
};

export default OngoingHiring;
