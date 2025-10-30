import api from "./api";
import axios from "axios";
import { BASE_URL, API_URLS } from "./configUrls";

// testing................................
// export const testService = axios.create({
//   baseURL: BASE_URL_2,
// });

const dataService = axios.create({
  baseURL: BASE_URL,
});

// AuthService --------------------------------------------------

export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post(API_URLS.LOGIN, {
        email,
        password,
      });

      return response; // Optionally return response data
    } catch (error) {
      // throw error;
      handleServiceError(error);
      // handleServiceError(error, "Login failed");
    }
  },

  logout: async () => {
    try {
      const response = await api.post(API_URLS.LOGOUT, {
        refresh_token: localStorage.getItem("refreshToken"),
      });
      return response;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
      
    }
  },

  sendOtp: async (email, turnstileToken) => {
    try {
      const response = await dataService.post(API_URLS.SEND_OTP, {
        email: email,
        turnstile_response: turnstileToken,
      });
      return response; // Optionally return response data
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await dataService.post(API_URLS.VERIFY_OTP, {
        email: email,
        otp: otp,
      });
      return response; // Optionally return response data
    } catch (error) {
      throw error;
    }
  },

  roles: async () => {
    try {
      const response = await api.get(API_URLS.ROLES);
      return response;
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  },

  switch_role: async (id) => {
    try {
      const response = await api.put(`${API_URLS.SWITCH_ROLE}${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const HomeService = {
  home: async () => {
    try {
      const response = await api.get(API_URLS.HOME);
      return response;
    } catch (error) {
      throw error;
    }
  },
  feedback: async (feedbackData) => {
    try {
      const response = await api.post(API_URLS.FEEDBACK, feedbackData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// InternshipService --------------------------------------------------

export const InternshipService = {
  domain_list: async () => {
    try {
      const response = await api.post(API_URLS.DOMAIN_LIST);
      return response;
    } catch (error) {
      throw error;
    }
  },

  cohort_list: async () => {
    try {
      const response = await api.post(API_URLS.COHORT_LIST);
      return response;
    } catch (error) {
      throw error;
    }
  },

  internship_status: async (cohort_id) => {
    try {
      const response = await api.get(
        `${API_URLS.STATUS_LIST}${cohort_id || 0}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  intern_filter: async (dataSearch) => {
    try {
      const response = await api.post(API_URLS.INTERN_FILTER, dataSearch);
      return response;
    } catch (error) {
      throw error;
    }
  },

  intern_approval_list: async (selectedItems) => {
    try {
      const response = await api.post(API_URLS.INTERN_APPROVAL, selectedItems);
      return response;
    } catch (error) {
      throw error;
    }
  },

  intern_approval_update: async (selectedItems) => {
    try {
      const response = await api.put(
        `${API_URLS.INTERN_APPROVAL}/${selectedItems.internship_id}`,
        selectedItems.data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  internship_register_status: async () => {
    try {
      const response = await api.get(API_URLS.INTERN_STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
  internship_bulk_approval: async (selectedItems) => {
    try {
      const response = await api.put(
        API_URLS.INTERN_BULK_APPROVAL,
        selectedItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  internship_export: async (selectedIDs) => {
    try {
      const response = await api.post(API_URLS.INTERN_EXPORT, selectedIDs);
      return response;
    } catch (error) {
      throw error;
    }
  },
  internship_approval_export: async (selectedIDs) => {
    try {
      const response = await api.post(
        API_URLS.INTERN_APPROVAL_EXPORT,
        selectedIDs
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  internship_approval_domain_list: async (userId) => {
    try {
      const res = await api.get(`${API_URLS.INTERN_APPROVAL_DOMAIN}${userId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
  internship_approval_domain_send: async (userId, domainId) => {
    try {
      const res = await api.get(
        `${API_URLS.INTERN_APPROVAL_DOMAIN}${userId}/${domainId}`
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  internship_approval_domain_otp: async (userId, domainId, otp) => {
    try {
      const res = await api.put(
        `${API_URLS.INTERN_APPROVAL_DOMAIN}${userId}/${domainId}`,
        otp
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  internship_edit_branch_rollno: async (userId, body) => {
    try {
      const res = await api.put(
        `${API_URLS.INTERN_EDIT_BRANCH_ROLLNO}${userId}`,
        body
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  internship_get_branch: async (userId) => {
    try {
      const res = await api.post(`${API_URLS.INTERN_BRANCH}${userId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
};

// EducatorService -----------------------------------------------------

export const EducatorService = {
  educator_academy: async () => {
    try {
      const response = await api.get(API_URLS.EDUCATOR_ACADEMY);
      return response;
    } catch (error) {
      throw error;
    }
  },
  educator_batch: async () => {
    try {
      const response = await api.get(API_URLS.EDUCATOR_BATCH);
      return response;
    } catch (error) {
      throw error;
    }
  },
  educator_program: async (dataSearch) => {
    try {
      const response = await api.post(API_URLS.EDUCATOR_PROGRAM, dataSearch);
      return response;
    } catch (error) {
      throw error;
    }
  },
  educator_statistics: async () => {
    try {
      const response = await api.get(API_URLS.EDUCATOR_STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// CorporateService --------------------------------------------------------

export const CorporateService = {
  corporate_program: async (dataSearch) => {
    try {
      const response = await api.post(API_URLS.CORPORATE_LIST, dataSearch);
      return response;
    } catch (error) {
      throw error;
    }
  },
  corporate_statistics: async () => {
    try {
      const response = await api.get(API_URLS.CORPORATE_STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export const DashboardService = {
  academy_report: async () => {
    try {
      const response = await api.get(API_URLS.ACADEMY_REPORT);
      return response;
    } catch (error) {
      throw error;
    }
  },
  cohort: async (cohort_id) => {
    try {
      const response = await api.get(`${API_URLS.COHORT}${cohort_id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  intern_total: async () => {
    try {
      const response = await api.get(API_URLS.INTERN_TOTAL);
      return response;
    } catch (error) {
      throw error;
    }
  },
  membership_package: async () => {
    try {
      const response = await api.get(API_URLS.MEMBERSHIP_INSTITUTE_PACKAGE);
      return response;
    } catch (error) {
      throw error;
    }
  },
  institute_state: async () => {
    try {
      const response = await api.get(API_URLS.MEMBERSHIP_INSTITUTE_STATE);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const MembershipService = {
  institute: async () => {
    try {
      const response = await api.get(API_URLS.MEMBERSHIP_INSTITUTE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  agreement: async () => {
    try {
      const response = await api.get(API_URLS.MEMBERSHIP_AGREEMENT);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// AdminService ------------------------------------------------------

export const AdminService = {
  // admin dashboard........................................
  admin_dashboard: async () => {
    try {
      const response = await api.get(API_URLS.ADMIN_DASHBOARD);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_dashboard_state: async () => {
    try {
      const response = await api.get(API_URLS.ADMIN_DASHBOARD_STATE);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_dashboard_cohort_summery: async (cohort_id, Id) => {
    try {
      const response = await api.get(
        `${API_URLS.ADMIN_DASHBOARD_COHORT_SUMMERY}${cohort_id}/${Id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // educator ..............................
  admin_educator_designation: async () => {
    try {
      const response = await api.get(API_URLS.EDUCATOR_DESIGNATION);
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_educator_list: async (page, pagesize) => {
    try {
      const response = await api.get(
        `${API_URLS.ADMIN_EDUCATOR}?page=${page}&page_size=${pagesize}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_educator_add: async (addItems) => {
    try {
      const response = await api.post(API_URLS.ADMIN_EDUCATOR, addItems);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_educator_update: async (editItems, educatorId) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_EDUCATOR}${educatorId}`,
        editItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_educator_delete: async (educatorId) => {
    try {
      const response = await api.delete(
        `${API_URLS.ADMIN_EDUCATOR}${educatorId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // admin MOU........................................
  admin_mou_list: async (data) => {
    try {
      const response = await api.post(API_URLS.ADMIN_MOU_LIST, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_academy_edit_all: async (program_id) => {
    try {
      const response = await api.get(`${API_URLS.ADMIN_MOU_LIST}${program_id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_update_mou: async (selectedEditItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_MOU_LIST}${selectedEditItems.program_id}`,
        selectedEditItems.data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_add_mou: async (selectedAddItems) => {
    try {
      const response = await api.post(
        `${API_URLS.ADMIN_MOU_LIST}${selectedAddItems.institute_id}`,
        selectedAddItems.data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  // admin Institute...................
  admin_institute_list: async () => {
    try {
      const response = await api.get(API_URLS.ADMIN_INSTITUTE);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  admin_institute: async (inst_id) => {
    try {
      const response = await api.get(`${API_URLS.ADMIN_INSTITUTE}${inst_id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_institute_update: async (selectedEditItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_INSTITUTE}${selectedEditItems.institue_id}`,
        selectedEditItems.data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_domain_list: async (institue_id) => {
    try {
      const response = await api.get(
        `${API_URLS.ADMIN_INSTITUTE_ASSIGN}${institue_id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_damain_update: async (selectedAssignItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_INSTITUTE_ASSIGN}${selectedAssignItems.institue_id}`,
        selectedAssignItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_domain_name: async (institue_id) => {
    try {
      const response = await api.get(
        `${API_URLS.ADMIN_DOMAIN_NAME}${institue_id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_domain_update: async (selectedEditItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_DOMAIN_NAME}${selectedEditItems.institue_id}`,
        selectedEditItems.data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_institute_add: async (selectedAddItems) => {
    try {
      const response = await api.post(
        `${API_URLS.ADMIN_INSTITUTE}`,
        selectedAddItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_institute_delete: async (institue_id) => {
    try {
      const response = await api.delete(
        `${API_URLS.ADMIN_INSTITUTE}${institue_id}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  //...................................
  admin_academy_all: async () => {
    try {
      const response = await api.get(API_URLS.ADMIN_INSTITUTE_ALL);
      return response;
    } catch (error) {
      throw error;
    }
  },

  admin_academy_list: async () => {
    try {
      const res = await api.get(API_URLS.ADMIN_ACADEMY);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_academy_add: async (addData) => {
    try {
      const res = await api.post(API_URLS.ADMIN_ACADEMY, addData);
      return res;
    } catch (error) {
      throw error;
    }
  },
  admin_academy_view: async (acdmyId) => {
    try {
      const res = await api.get(`${API_URLS.ADMIN_ACADEMY}${acdmyId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
  admin_academy_edit: async (acdmyId, editData) => {
    try {
      const res = await api.put(
        `${API_URLS.ADMIN_ACADEMY}${acdmyId}`,
        editData
      );
      return res;
    } catch (error) {
      throw error;
    }
  },
  admin_academy_delete: async (acdmyId) => {
    try {
      const res = await api.delete(`${API_URLS.ADMIN_ACADEMY}${acdmyId}`);
      return res;
    } catch (error) {
      throw error;
    }
  },
  //Staff............................................
  admin_all_staff: async () => {
    try {
      const res = await api.get(API_URLS.ADMIN_STAFF);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_add_staff: async (addData) => {
    try {
      const res = await api.post(API_URLS.ADMIN_STAFF, addData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_view_staff: async (staff_id) => {
    try {
      const res = await api.get(`${API_URLS.ADMIN_STAFF}${staff_id}`);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_edit_staff: async (staff_id, editData) => {
    const id = parseInt(staff_id);
    try {
      const res = await api.put(`${API_URLS.ADMIN_STAFF}${id}`, editData);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_delete_staff: async (staff_id) => {
    const id = parseInt(staff_id);
    try {
      const res = await api.delete(`${API_URLS.ADMIN_STAFF}${id}`);
      return res;
    } catch (error) {
      throw error;
    }
  },

  admin_staff_role: async () => {
    try {
      const res = await api.get(API_URLS.ADMIN_STAFF_ROLE);
      return res;
    } catch (error) {
      throw error;
    }
  },
  //................................................
  admin_academy_all_Institute: async (academyId) => {
    try {
      const response = await api.get(
        `${API_URLS.ADMIN_INSTITUTE_ALL}/${academyId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_academy_update: async (selectedItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_INSTITUTE_ALL}/${selectedItems.academy_id}`,
        selectedItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // admin testing .......
  // ADMIN_DOMAIN_LIST
  admin_inst_domain_list: async (instId) => {
    try {
      const response = await api.get(`${API_URLS.ADMIN_DOMAIN_LIST}/${instId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  admin_inst_domain_update: async (selectedAssignItems) => {
    try {
      const response = await api.put(
        `${API_URLS.ADMIN_DOMAIN_LIST}${selectedAssignItems.institue_id}`,
        selectedAssignItems
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  // admin_inst_domain_update: async (instId) => {
  //   try {
  //     const response = await api.get(
  //       `${API_URLS.ADMIN_DOMAIN_LIST}/${instId}`
  //     );
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};

// StaffService -------------------------------------------------------

export const StaffService = {
  // STAFF_DASHBOARD.....................
  staff_dashboard_domain: async (cohortId, institueId) => {
    try {
      const response = await api.get(
        `${API_URLS.STAFF_DASHBOARD_DOMAIN}${cohortId}/${institueId}`
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  staff_dashboard_institution: async (cohortId) => {
    try {
      const response = await api.get(
        `${API_URLS.STAFF_DASHBOARD_INSTITUTION}${cohortId}`
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  staff_dashboard_state: async (cohortId) => {
    try {
      const response = await api.get(
        `${API_URLS.STAFF_DASHBOARD_STATE}${cohortId}`
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  //.................................
  staff_Statistics: async (cohort_id) => {
    try {
      const response = await api.get(
        `${API_URLS.STAFF_STATISTICS}${cohort_id || 8}`
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  staff_institute: async () => {
    try {
      const response = await api.get(API_URLS.STAFF_INSTITUTE);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  staff_internship: async (selectedItems) => {
    try {
      const response = await api.post(
        `${API_URLS.STAFF_INTERNSHIP}`,
        selectedItems
      );
      return response;
    } catch (error) {
      // handleServiceError(error,"staff internship");
      handleServiceError(error, "silent");
      throw error;
    }
  },

  staff_search: async (searchEmail) => {
    try {
      const response = await api.get(`${API_URLS.STAFF_SEARCH}${searchEmail}`);
      return response;
    } catch (error) {
      // handleServiceError(error,"staff internship");
      handleServiceError(error, "silent");
      throw error;
    }
  },
  getCourseDropdown: async () => {
    try {
      const response = await api.get(API_URLS.COURSE_DROPDOWN);

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  getBranchDropdown: async (courseId) => {
    try {
      const response = await api.get(`${API_URLS.BRANCH_DROPDOWN}${courseId}`);

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  getSemesterDropdown: async (courseId) => {
    try {
      const response = await api.get(
        `${API_URLS.SEMESTER_DROPDOWN}${courseId}`
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  getUserForApproval: async (courseId) => {
    try {
      const response = await api.get(`${API_URLS.USER_APPROVAL}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  getUserForFinalYear: async (page, page_size, search) => {
    try {
      const response = await api.get(`${API_URLS.USER_PASSOUT_CHANGE}`, {
        params: {
          page,
          page_size,
          search, // Only include search if it's non-empty
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  sendOtpMarkAsFailed: async (user_id) => {
    try {
      const response = await api.get(
        `${API_URLS.INTERN_MARK_FAILED}/${user_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  verifyOtpAndMarkAsFailed: async (user_id, otp) => {
    try {
      const response = await api.put(
        `${API_URLS.INTERN_MARK_FAILED}/${user_id}`,
        Number(otp),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  uploadIntakeData: async (intakeData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(API_URLS.INTAKE_DATA, intakeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadIntakeBranch: async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `${BASE_URL}/profile/studentIntakeBranch`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  uploadIntakeYear: async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `${BASE_URL}/profile/studentIntakeYear`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateIntakeDetails: async (intakeId, intakeData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put(
        `${API_URLS.UPDATE_INTAKE_DATA}/${intakeId}`,
        intakeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Update intake details error:", error);
      throw error;
    }
  },

  deleteIntakeDetails: async (intakeId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.delete(
        `${API_URLS.DELETE_INTAKE_DATA}/${intakeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  bulkDeleteIntakeDetails: async (selectedRows) => {
    try {
      const token = localStorage.getItem("accessToken");

      // Create a new FormData instance
      const formData = new FormData();
      // Append the selected rows to the FormData
      formData.append("intake_ids", JSON.stringify(selectedRows));

      const response = await api.delete(`${API_URLS.DELETE_INTAKE_DATA}`, {
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required when sending FormData
        },
      });
      return response;
    } catch (error) {
      console.error("Update intake details error:", error);
      throw error;
    }
  },

  getUsersOfIntakeData: async (page, page_size, search) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(API_URLS.INTAKE_DATA, {
        params: {
          page,
          page_size,
          search, // Only include search if it's non-empty
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateFinalYearDetails: async (user_id, passout_year) => {
    try {
      const response = await api.put(
        `${API_URLS.INTERN_APPROVAL_FINAL_YEAR}/${user_id}`,
        passout_year,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  updateDetails: async (data) => {
    try {
      const response = await api.put(
        `${API_URLS.UPDATE_DETALS}${data.user_id}`,
        {
          program_id: Number(data.program_id),
          branch: data.branch,
          roll_no: data.roll_no,
          semester: data.semester,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  rejectAndApproval: async (data, selectedData) => {
    try {
      const response = await api.put(
        `${API_URLS.USER_APPROVAL}/${selectedData.user_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  bulkApproval: async (selectedData) => {
    try {
      const response = await api.put(
        `${API_URLS.BULK_APPROVAL}`,
        selectedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
};

// Talent Connect ........................................
export const TalentConnectService = {
  company: async () => {
    try {
      const response = await api.get(API_URLS.TALENT_CONNECT_COMPANY);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  add_company: async (addData) => {
    try {
      const response = await api.post(API_URLS.TALENT_CONNECT_COMPANY, addData);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  update_company: async (updateData, companyId) => {
    try {
      const response = await api.put(
        `${API_URLS.TALENT_CONNECT_COMPANY}${companyId}`,
        updateData
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  // jd.................
  jd: async () => {
    try {
      const response = await api.get(API_URLS.TALENT_CONNECT_JD);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  create_jd: async (createData) => {
    try {
      const response = await api.post(API_URLS.TALENT_CONNECT_JD, createData);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  update_jd: async (jdId, updateData) => {
    try {
      const response = await api.put(
        `${API_URLS.TALENT_CONNECT_JD}${jdId}`,
        updateData
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  single_jd: async (jdId) => {
    try {
      const response = await api.get(`${API_URLS.TALENT_CONNECT_JD}${jdId}`);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  // job .......................
  job_post: async (postData) => {
    try {
      const response = await api.post(API_URLS.TALENT_CONNECT_JOB, postData);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  job_list: async () => {
    try {
      const response = await api.get(API_URLS.TALENT_CONNECT_JOB);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  single_job: async (jodId) => {
    try {
      const response = await api.get(`${API_URLS.TALENT_CONNECT_JOB}${jodId}`);
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  institute_by_state: async (postData) => {
    try {
      const response = await api.post(
        API_URLS.TALENT_CONNECT_INSTITUTE,
        postData
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  update_jod: async (jodId, updateData) => {
    try {
      const response = await api.put(
        `${API_URLS.TALENT_CONNECT_JOB}${jodId}`,
        updateData
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },

  appliedStudent: async (searchData) => {
    try {
      const response = await api.get(
        `${API_URLS.TALENT_CONNECT_STUDENTS}?page=${
          searchData.page
        }&page_size=${searchData?.page_size}${
          searchData?.company_id
            ? `&company_id=${searchData?.company_id}&jd_id=${searchData?.jd_id}&is_active=${searchData?.is_active}`
            : ""
        }`,
        {}
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  resume: async (data) => {
    try {
      console.log("data@@@@@@@", data);
      const response = await api.get(
        // `${API_URLS.TALENT_CONNECT_RESUME}${data.user_id}/${data.resume_id}`
        `${API_URLS.TALENT_CONNECT_RESUME}${data.resume_id}`
      );
      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
  status: async (data) => {
    try {
      const response = await api.put(
        `${API_URLS.TALENT_CONNECT_STATUS}${data.user_id}`,
        data.data
      );

      return response;
    } catch (error) {
      handleServiceError(error, "silent");
      throw error;
    }
  },
};

// Export the data service if needed
export default dataService;

/// General function to handle service errors............................
const handleServiceError = (error, customMessage = "") => {
  if (!navigator.onLine) {
    console.error(
      "Network error: The device is not connected to the internet."
    );
    // Add your logic for handling the disconnected internet error here
    return;
  }
  // Add your custom error handling logic here
  if (error.code === "ENOTFOUND") {
    console.error("DNS error: The domain could not be found.");
    // Add your DNS error handling logic here
  } else if (error.message === "Network Error") {
    console.error("Network error: Unable to connect to the server.");
    // Add your network error handling logic here
  } else if (error.code === "ECONNABORTED") {
    console.error("Request timeout: The server took too long to respond.");
    // Add your custom error handling logic here
  } else if (error.response) {
    // Add your logic to handle specific error statuses
    if (error.response?.status === 401) {
      // Handle unauthorized access, maybe redirect to the login page
      console.error("Unauthorized access.");
      // Add your navigation logic here
    } else if (error.response?.status === 404) {
      // Handle not found error
      console.error("Resource not found.");
    } else if (error.response?.status === 500) {
      // Handle server error
      console.error("Internal server error.");
      // Add your logic for handling a 500 error here
    } else if (error.response?.status === 422) {
      // Handle unprocessable entity error
      console.error("Unprocessable entity.");
      // Add your logic for handling a 422 error here
    } else if (error.response?.status === 403) {
      // Handle forbidden error
      console.error(
        "Forbidden. You don't have permission to access this resource."
      );
      // Add your logic for handling a 403 error here
    } else {
      // Handle other error statuses
      console.error("Unhandled server error.");
    }

    // For example, if your API returns error messages in a specific format, you can extract and handle them
    if (error.response?.data && error.response.data.message) {
      console.error("Server error message:", error.response?.data.message);
      // Add your logic to handle specific error messages here
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received from the server.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request setup error:", error.message);
  }

  // Rethrow the error for the calling component to handle if needed
  if (customMessage !== "silent") {
    // throw error;
  }
};
