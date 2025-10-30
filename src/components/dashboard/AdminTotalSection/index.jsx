import {
  Grid,
  // Slide
} from "@mui/material";
import React, {
  useEffect,
  // useState
} from "react";
import InstituteDetails from "./InstituteDetails";
import AdminCards from "./AdminCards";
import AcademyDetails from "./AcademyDetails";
// import { AdminService } from "../../../services/dataService";
import { fetchAdminDashboard } from "../../../store/Slices/admin/adminDashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import AdminStateSection from "./AdminStateSection";
import AdminMouSection from "./AdminMouSection";
// import CurrentSummary from "./CurrentSummary";

const AdminTotalSection = () => {
  // const [isCurrentSummary, setIsCurrentSummary] = useState(true);
  const dispatch = useDispatch();
  const corporateList = useSelector(
    (state) => state.adminDashboard.corporate_list
  );
  const institute = useSelector((state) => state.adminDashboard.institute);
  const total = useSelector((state) => state.adminDashboard.total);
  const isLoading = useSelector((state) => state.adminDashboard.isLoading);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  // const handleCloseCurrent = () => {
  //   setIsCurrentSummary(!isCurrentSummary);
  // };

  return (
    <Grid container spacing={2} mb={3} mt={0.1}>
      {/* <Slide direction="left" in={isCurrentSummary} mountOnEnter unmountOnExit>
        <Grid item xs={12}>
          <CurrentSummary close={handleCloseCurrent} />
        </Grid>
      </Slide> */}

      <Grid item xs={12} sm={12} md={6}>
        <Grid container spacing={2}>
          <AdminCards total={total} isLoading={isLoading} />
          <InstituteDetails institute={institute} isLoading={isLoading} />
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <AcademyDetails corporateList={corporateList} isLoading={isLoading} />
      </Grid>
      <Grid item xs={12}>
        <AdminMouSection />
      </Grid>
      <Grid item xs={12}>
        <AdminStateSection />
      </Grid>
    </Grid>
  );
};

export default AdminTotalSection;
