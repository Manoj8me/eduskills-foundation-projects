import { Grid, Stack, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { tokens } from "../../../theme";
import OngoingHiring from "./OngoingHiring";
import Institution from "./Institution";
import Company from "./Company";
import { fetchAdminDashboard } from "../../../store/Slices/admin/adminDashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import InstituteDetails from "../../dashboard/AdminTotalSection/InstituteDetails";

const TalentConnectDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const institute = useSelector((state) => state.adminDashboard.institute);
  // const total = useSelector((state) => state.adminDashboard.total);
  const isLoading = useSelector((state) => state.adminDashboard.isLoading);

  return (
    <Stack sx={{ my: 1.5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <OngoingHiring />
        </Grid>
        <Grid item xs={12} md={6}>
          <InstituteDetails institute={institute} isLoading={isLoading}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <Company />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TalentConnectDashboard;
