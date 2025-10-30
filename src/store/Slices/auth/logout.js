
import { clearCohortInternship } from "../dashboard/cohortInternshipSlice";
import { clearDashboard } from "../dashboard/dashboardSlice";
import { clearTotalInternship } from "../dashboard/totalInternshipSlice";
import { clearTotal } from "../dashboard/totalSlice";
// import { clearDomainList } from "./internship/domainListSlice";
import { clearInternshipStatus } from "../internship/internStatusSlice";
// import { clearAuthorise } from "./authoriseSlice";
import { clearPayment } from "../paymentSlice";
import { clearTokens } from "./authSlice";
import { clearDomainList } from "../dashboard/domainListSlice"; 
import { clearAdminDashboard } from "../admin/adminDashboardSlice";
import { clearStaffInstitute } from "../staff/staffInstSlice";
import { clearMouInstituteId } from "../admin/adminMouSlice";


const clearAllSlicesThunk = (dispatch) => {
  dispatch(clearCohortInternship());
  dispatch(clearDashboard());
  dispatch(clearTotalInternship());
  dispatch(clearTotal());
  dispatch(clearDomainList());
  dispatch(clearInternshipStatus());
  // dispatch(clearAuthorise());
  dispatch(clearPayment());
  dispatch(clearTokens());
  dispatch(clearAdminDashboard())
  dispatch(clearStaffInstitute())
  dispatch(clearMouInstituteId())
};

export default clearAllSlicesThunk;
