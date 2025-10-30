// export const BASE_URL =
//   "http://ec2-15-206-231-196.ap-south-1.compute.amazonaws.com/api/v1";
// export const BASE_URL = "https://erpapi.eduskillsfoundation.org";

// export const BASE_URL = "http://192.168.1.4:8000";

// export const BASE_URL = "http://192.168.2.140:8000";

// export const BASE_URL = "http://192.168.2.236:8000";

// export const BASE_URL = "http://192.168.2.155:8003";
// export const BASE_URL = "http://192.168.2.216:8000";
export const BASE_URL = "http://127.0.0.1:8000";
// export const BASE_URL = "http://192.168.0.112:8015";

// export const BASE_URL = "http://localhost:8080";

export const API_URLS = {
  // auth..............................................
  LOGIN: "/token/",
  LOGOUT: "/token/logout",
  SEND_OTP: "/token/send/otp",
  VERIFY_OTP: "/token/verify/otp2",
  REFRESH: "/token/refresh",
  ROLES: "/user/roles",
  SWITCH_ROLE: "/user/switch/role/",

  //spoc dashboard.....................................
  ACADEMY_REPORT: "/dashboard/",
  COHORT: "/dashboard/cohort/",
  INTERN_TOTAL: "/dashboard/internship",
  // internship........................................
  HOME: "/api/home",
  DOMAIN_LIST: "/internship/domain",
  COHORT_LIST: "/internship/cohort",
  STATUS_LIST: "/internship/statistics/",
  INTERN_FILTER: "/internship/",
  // internship approval...............................
  INTERN_APPROVAL: "/internship/spoc/approval",
  INTERN_STATISTICS: "/internship/register/statistics",
  INTERN_BULK_APPROVAL: "/internship/spoc/bulk/approval",
  INTERN_EXPORT: "/internship/download",
  INTERN_APPROVAL_EXPORT: "/internship/register/download",
  INTERN_APPROVAL_DOMAIN: "/internship/change/domain/",
  INTERN_BRANCH: "/internship/getBranch/",
  INTERN_EDIT_BRANCH_ROLLNO: "/internship/edit/details/",
  INTERN_APPROVAL_FINAL_YEAR: "internship/updateDetailsOfStudent",
  INTERN_MARK_FAILED: "internship/internshipStatusChange",
  // educator
  EDUCATOR_ACADEMY: "/educator/academy",
  EDUCATOR_BATCH: "/educator/batch",
  EDUCATOR_PROGRAM: "/educator/edp",
  EDUCATOR_STATISTICS: "/educator/edp/statistics",
  EDUCATOR_DESIGNATION: "/user/designation",
  //corporate program..................................
  CORPORATE_LIST: "/educator/corporate",
  CORPORATE_STATISTICS: "/educator/corporate/statistics",
  // membership........................................
  MEMBERSHIP_INSTITUTE: "/institute/",
  MEMBERSHIP_INSTITUTE_PACKAGE: "/institute/membership/package",
  MEMBERSHIP_INSTITUTE_STATE: "/institute/state",
  MEMBERSHIP_AGREEMENT: "/institute/agreement",
  // feedback..........................................
  FEEDBACK: "/institute/feedback",
  // admin.............................................
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_DASHBOARD_STATE: "/admin/dashboard/state",
  ADMIN_DASHBOARD_COHORT_SUMMERY: "admin/dashboard/summary/",
  ADMIN_INSTITUTE: "/admin/institute/",
  ADMIN_EDUCATOR: "/admin/educator/",
  ADMIN_MOU_LIST: "/admin/institute/mou/",
  ADMIN_STAFF: "/admin/staff/",
  ADMIN_STAFF_ROLE: "/admin/staff/roles/",
  // Staff.............................................
  STAFF_DASHBOARD_DOMAIN: "/staff/dashboard/statistic/domain/",
  STAFF_DASHBOARD_INSTITUTION: "/staff/dashboard/statistic/institution/",
  STAFF_DASHBOARD_STATE: "/staff/dashboard/statistic/state/",

  STAFF_STATISTICS: "/staff/statistics/",
  STAFF_INSTITUTE: "/staff/institute",
  STAFF_INTERNSHIP: "/staff/internship",
  STAFF_SEARCH: "/staff/intern/detail/",
  // ADMIN_INSTITUTE_ASSIGN:"admin/institute/assign/domain/",
  ADMIN_INSTITUTE_ASSIGN: "admin/institute/assign/academy/",
  ADMIN_DOMAIN_NAME: "/admin/institute/domain/name/",
  ADMIN_INSTITUTE_ALL: "/admin/institute/all/academy",
  ADMIN_ACADEMY: "/admin/academy/",

  // Talent Connect .........................................
  TALENT_CONNECT_COMPANY: "/talent/connect/company/",
  TALENT_CONNECT_JD: "/talent/connect/jd/",
  TALENT_CONNECT_JOB: "/talent/connect/job/",
  TALENT_CONNECT_INSTITUTE: "/institute/by/state",
  TALENT_CONNECT_STUDENTS: "/talent/connect/applied/student/",
  TALENT_CONNECT_RESUME: "/talent/connect/download/resume/",
  TALENT_CONNECT_STATUS: "/talent/connect/applied/student/",

  // Testing ...............
  INTAKE_DATA: "/profile/studentIntake",
  UPDATE_INTAKE_DATA: "/profile/updateDetails",
  DELETE_INTAKE_DATA: "/profile/deleteDetails",
  BULK_DELETE_INTAKE_DATA: "/profile/deleteDetails",
  ADMIN_DOMAIN_LIST: "/admin/institute/assign/domain/",
  COURSE_DROPDOWN: "/internship/courseDropdown",
  BRANCH_DROPDOWN: "/internship/branchDropdown/",
  SEMESTER_DROPDOWN: "/internship/semesterDropdown/",
  USER_APPROVAL: "/internship/getUserForApproval",
  USER_PASSOUT_CHANGE: "internship/getAllData",
  UPDATE_DETALS: "/internship/updateDetails/",
  BULK_APPROVAL: "/internship/apsche/certificate/bulk/approval",
};
