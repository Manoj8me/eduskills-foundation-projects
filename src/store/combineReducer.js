import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./Slices/auth/authSlice";
import authoriseReducer from "./Slices/auth/authoriseSlice";
import paymentReducer from "./Slices/paymentSlice";
import dashboardReducer from "./Slices/dashboard/dashboardSlice";
import totalReducer from "./Slices/dashboard/totalSlice";
import totalInternshipReducer from "./Slices/dashboard/totalInternshipSlice";
import cohortInternshipReducer from "./Slices/dashboard/cohortInternshipSlice";
import internStatusReducer from "./Slices/internship/internStatusSlice";
import domainListSlice from "./Slices/dashboard/domainListSlice";
import statepackageSlice from "./Slices/dashboard/statepackageSlice";
import internshipStatusRegisterSlice from "./Slices/internship/internRegisterStatus";
import adminDashboardSlice from "./Slices/admin/adminDashboardSlice";
import adminEduDesigSlice from "./Slices/admin/adminEduDesigSlice";
import adminInstListSlice from "./Slices/admin/adminInstListSlice";
// import adminDashStateSlice from "./Slices/admin/adminDashStateSlice";
import { adminReducer } from "./combReducer/adminCombReducer";
import staffInstSlice from "./Slices/staff/staffInstSlice";
import commonSlice from "./Slices/common/commonSlice";
import staffEduSlice from "./Slices/staff/staffEduSlice";
import staffInternSlice from "./Slices/staff/staffInternSlice";
import adminMouSlice from "./Slices/admin/adminMouSlice";
import studentMetricsSlice from "./Slices/studentmetricsdashboard/studentMetricsSlice";
import studentNewMetricsSlice from "./Slices/studentnewmetric/studentNewMetricsSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  authorise: authoriseReducer,
  payment: paymentReducer,
  // Dashboard ....
  total: totalReducer,
  totalInternship: totalInternshipReducer,
  cohortInternship: cohortInternshipReducer,
  dashboard: dashboardReducer,
  domainList: domainListSlice,
  statePackage: statepackageSlice,
  // Admin dashboard ....
  adminDashboard: adminDashboardSlice,
  adminMou: adminMouSlice,
  // adminDashState:adminDashStateSlice,
  adminState: adminReducer,
  // Internship ....
  internshipStatus: internStatusReducer,
  internshipStatusRegisterSlice: internshipStatusRegisterSlice,
  // Educator ....
  educatorDesignation: adminEduDesigSlice,
  adminInstList: adminInstListSlice,
  // Staff ....
  staffInternship: staffInternSlice,
  staffInstitute: staffInstSlice,
  staffEducator: staffEduSlice,
  // Common ....
  common: commonSlice,
  //Student Metrics Dashboard
  studentMetrics: studentMetricsSlice,
  studentNewMetrics: studentNewMetricsSlice,
});
