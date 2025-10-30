import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

export const useSupportStaff = () => {
  const [supportStaff, setSupportStaff] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Authorization token
  const authToken = localStorage.getItem("accesstoken");

  // Redux state
  const stateList = useSelector((state) => state.statePackage.instituteState);

  const updateStateList = stateList?.map((state) => {
    return {
      value: state.state_id,
      label: state.state_name,
    };
  });

  // Configuration for form fields
  const configField = [
    {
      name: "email",
      label: "Email ID",
      type: "text",
      variant: "email",
    },

    {
      name: "google_meet_link",
      label: "Google Meet Link ",
      type: "text",
    },
  ];

  // Success message handler
  function handleSuccessMessage(message) {
    toast.success(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  // Error message handler
  function handleErrorMessage(message) {
    toast.error(message, {
      autoClose: 2000,
      position: "top-center",
    });
  }

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/reasonCategories`,
        headers: {
          Authorization: authToken,
        },
      };

      const response = await axios.request(config);
      const categoryOptions = response.data.map((category) => ({
        value: category.reasonNumber,
        label: category.name,
      }));
      setCategories(categoryOptions);
    } catch (error) {
      console.error("Error fetching categories:", error);
      handleErrorMessage("Failed to fetch categories");
    }
  };

  // API function to fetch all support staff
  const fetchSupportStaffList = async () => {
    try {
      setLoadingTable(true);
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/allSupports`,
        headers: {
          Authorization: authToken,
        },
      };

      const response = await axios.request(config);
      const staffData = response.data;

      const mappedStaffData = staffData.map((staff, index) => ({
        ...staff,
        sl_no: index + 1,
        support_id: staff.user_id,
      }));

      setSupportStaff(mappedStaffData);
    } catch (error) {
      console.error("Error fetching support staff:", error);
      handleErrorMessage("Failed to fetch support staff data");
    } finally {
      setLoadingTable(false);
    }
  };

  // API call for adding support staff
  const handleAddSupportStaff = async (addedItem) => {
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/createNewSupport`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: JSON.stringify(addedItem),
      };

      const response = await axios.request(config);
      console.log("Support staff created:", response.data);
      handleSuccessMessage("Support staff added successfully");
      setRefresh((prev) => !prev);
    } catch (error) {
      handleErrorMessage(error.response?.data?.detail || error.message);
      console.error("Error adding support staff:", error);
    }
  };

  // API call for updating support staff
  const handleUpdateSupportStaff = async (editItem) => {
    try {
      // Replace with actual API call when available
      handleSuccessMessage("Support staff updated successfully");
      setRefresh((prev) => !prev);
    } catch (error) {
      handleErrorMessage(error.response?.data?.detail || error.message);
      console.error("Error updating support staff:", error);
    }
  };

  // API call for deleting support staff
  const handleDeleteSupportStaff = async (staffId) => {
    try {
      // Replace with actual API call when available
      handleSuccessMessage("Support staff deleted successfully");
      setRefresh((prev) => !prev);
    } catch (error) {
      handleErrorMessage(error.response?.data?.detail || error.message);
      console.error("Error deleting support staff:", error);
    }
  };

  // Fetch specific user categories
  const fetchUserCategories = async (userId) => {
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/allSupportCategories`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: JSON.stringify({
          supportUserId: userId,
        }),
      };

      const response = await axios.request(config);
      console.log("User categories response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user categories:", error);
      handleErrorMessage("Failed to fetch user categories");
      return [];
    }
  };

  // Handle toggle switch for support status
  const handleSupportStatusToggle = async (supportProfileId, currentStatus) => {
    const newStatus = currentStatus === "1" ? "0" : "1";

    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateSupportStatus`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: JSON.stringify({
          support_profile_id: supportProfileId,
          is_active: newStatus,
        }),
      };

      const response = await axios.request(config);
      console.log("Status updated:", response.data);

      handleSuccessMessage(
        `Support status ${
          newStatus === "1" ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating support status:", error);
      handleErrorMessage("Failed to update support status");
    }
  };

  // Update Google Meet Link
  const updateGoogleMeetLink = async (userId, meetingLink) => {
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateGoogleMeet`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: JSON.stringify({
          user_id: userId,
          google_meet_link: meetingLink.trim(),
        }),
      };

      const response = await axios.request(config);
      console.log("Meeting link updated:", response.data);

      // Update the local state immediately
      setSupportStaff((prevStaff) =>
        prevStaff.map((staff) =>
          staff.user_id === userId
            ? { ...staff, google_meet_link: meetingLink.trim() }
            : staff
        )
      );

      handleSuccessMessage("Google Meet link updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating meeting link:", error);
      handleErrorMessage(
        error.response?.data?.detail || "Failed to update meeting link"
      );
      return false;
    }
  };

  // Add user to category
  const addUserToCategory = async (userId, categoryId) => {
    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/createNewSupportUser`,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        data: JSON.stringify({
          user_id: userId,
          category: categoryId,
        }),
      };

      const response = await axios.request(config);
      console.log("User added to category:", response.data);

      handleSuccessMessage("User successfully added to category");
      return true;
    } catch (error) {
      console.error("Error adding user to category:", error);
      handleErrorMessage(
        error.response?.data?.detail || "Failed to add user to category"
      );
      return false;
    }
  };

  // Validate Google Meet Link
  const validateGoogleMeetLink = (link) => {
    if (!link.trim()) {
      return "Meeting link is required";
    }

    // Basic Google Meet link validation
    const googleMeetRegex =
      /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    if (!googleMeetRegex.test(link.trim())) {
      return "Please enter a valid Google Meet link (e.g., https://meet.google.com/abc-defg-hij)";
    }

    return "";
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter support staff by search term
  const filterSupportStaff = (staff, searchTerm) => {
    if (!searchTerm) return staff;

    return staff.filter(
      (member) =>
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.google_meet_link &&
          member.google_meet_link
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  };

  // Get category name by value
  const getCategoryName = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : "Unknown Category";
  };

  // Check if user has active categories
  const hasActiveCategories = (userCategories) => {
    return userCategories.some((category) => category.is_active === "1");
  };

  // Count categories by status
  const countCategoriesByStatus = (userCategories) => {
    return {
      total: userCategories.length,
      active: userCategories.filter((cat) => cat.is_active === "1").length,
      inactive: userCategories.filter((cat) => cat.is_active === "0").length,
    };
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSupportStaffList();
  }, [refresh]);

  return {
    // State
    supportStaff,
    categories,
    loadingTable,
    refresh,
    configField,
    authToken,
    updateStateList,

    // Setters
    setRefresh,
    setSupportStaff,
    setCategories,

    // API functions
    handleAddSupportStaff,
    handleUpdateSupportStaff,
    handleDeleteSupportStaff,
    fetchUserCategories,
    handleSupportStatusToggle,
    updateGoogleMeetLink,
    addUserToCategory,
    fetchSupportStaffList,
    fetchCategories,

    // Utility functions
    handleSuccessMessage,
    handleErrorMessage,
    validateGoogleMeetLink,
    validateEmail,
    formatDate,
    filterSupportStaff,
    getCategoryName,
    hasActiveCategories,
    countCategoriesByStatus,
  };
};
