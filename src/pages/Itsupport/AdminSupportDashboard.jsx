import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Mail,
  Calendar,
  FileText,
  Download,
  MessageSquare,
  Eye,
  X,
  Send,
  Settings,
  BookOpen,
  HelpCircle,
  HeadphonesIcon,
  UsersIcon,
  UserCheck,
  CheckSquare,
  Edit3,
  ChevronDown,
} from "lucide-react";
import { BASE_URL } from "../../services/configUrls";
const AdminSupportDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState({});
  
  // New state for closing remark editing
  const [closingRemarkText, setClosingRemarkText] = useState("");
  const [isUpdatingClosingRemark, setIsUpdatingClosingRemark] = useState(false);

  // NEW STATES FOR SOLVE POPUP
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [solveModalRequest, setSolveModalRequest] = useState(null);
  const [solveResponseText, setSolveResponseText] = useState("");
  const [isSolvingRequest, setIsSolvingRequest] = useState(false);

  // NEW STATES FOR ASSIGN FUNCTIONALITY
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalRequest, setAssignModalRequest] = useState(null);
  const [supportEmails, setSupportEmails] = useState([]);
  const [selectedAssigneeEmail, setSelectedAssigneeEmail] = useState("");
  const [isLoadingSupportEmails, setIsLoadingSupportEmails] = useState(false);

  // NEW STATE FOR DASHBOARD COUNTS
  const [dashboardCounts, setDashboardCounts] = useState({
    supportMeetingsAll: 0,
    supportMeetingsResolved: 0,
    supportMeetingsUnresolved: 0
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // API Configuration


  // Get token from localStorage or state management
  useEffect(() => {
    const token = localStorage.getItem('accessToken') || 
                 sessionStorage.getItem('accessToken') ;
    setAccessToken(token);
  }, []);

  // NEW FUNCTION: Handle attachment downloads
  const handleAttachmentDownload = (attachmentName) => {
    if (!attachmentName) {
      alert('Attachment name not found');
      return;
    }
    
    // Use the base URL you specified for attachment downloads
    const downloadUrl = `https://erpapi.eduskillsfoundation.org/support/${attachmentName}`;
    
    // Open in new tab for download
    window.open(downloadUrl, '_blank');
  };

  // NEW FUNCTION: Handle solve button click to show modal
  const handleSolveButtonClick = (request) => {
    setSolveModalRequest(request);
    setSolveResponseText(""); // Reset response text
    setIsSolveModalOpen(true);
  };

  // NEW FUNCTION: Handle actual solve with response
  const handleConfirmSolve = async () => {
    if (!solveResponseText.trim()) {
      alert('Please enter a response message before solving the request');
      return;
    }

    setIsSolvingRequest(true);
    
    try {
      // Call updateStudentQuestion API with status 2 (solved) and closing_remark
      const data = JSON.stringify({
       
        "support_meetings_id": solveModalRequest.support_meetings_id,
        "closing_remark": solveResponseText,
        "status": "2"
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateStudentQuestion`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('Solve response:', response.data);
      
      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.support_meetings_id === solveModalRequest.support_meetings_id
            ? { 
                ...req, 
                status: "solved",
                closingRemark: solveResponseText
              }
            : req
        )
      );
      
      // Refresh dashboard counts after status update
      fetchDashboardCounts();
      
      // Close modal and reset states
      setIsSolveModalOpen(false);
      setSolveModalRequest(null);
      setSolveResponseText("");
      
      alert('Request solved successfully and response sent!');
      

    } catch (error) {
      console.error('Error solving request:', error);
      alert('Failed to solve request. Please try again.');
    } finally {
      setIsSolvingRequest(false);
    }
  };

  // NEW FUNCTION: Fetch support emails
  const fetchSupportEmails = async () => {
    if (!accessToken) {
      console.error('No access token available for support emails');
      return;
    }

    setIsLoadingSupportEmails(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/supportEmails`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        }
      };

      const response = await axios.request(config);
      console.log('Support emails response:', response.data);
      
      // Set support emails data
      setSupportEmails(response.data || []);
      
    } catch (error) {
      console.error('Error fetching support emails:', error);
      if (error.response?.status === 401) {
        handleTokenError();
      }
      setSupportEmails([]);
    } finally {
      setIsLoadingSupportEmails(false);
    }
  };

  // NEW FUNCTION: Handle assign button click to show modal
  const handleAssignButtonClick = async (request) => {
    setAssignModalRequest(request);
    setSelectedAssigneeEmail("");
    setIsAssignModalOpen(true);
    
    // Fetch support emails when opening assign modal
    await fetchSupportEmails();
  };

  // NEW FUNCTION: Handle actual assignment with selected email
  const handleConfirmAssignment = async () => {
    if (!selectedAssigneeEmail || !assignModalRequest) {
      alert('Please select an email to assign the request');
      return;
    }

    const requestKey = `${assignModalRequest.support_meetings_id}_assign`;
    setIsUpdatingStatus(prev => ({ ...prev, [requestKey]: true }));
    
    try {
      // Find the selected assignee data
      const selectedAssignee = supportEmails.find(
        user => user.email === selectedAssigneeEmail
      );
      
      if (!selectedAssignee) {
        throw new Error('Selected assignee not found');
      }

      // Call updateStudentQuestion API with selected user data
      const data = JSON.stringify({
        "assigned_userid": selectedAssignee.assigned_userid,
        "support_meetings_id": assignModalRequest.support_meetings_id,
        "status": "1"
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateStudentQuestion`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('Assignment response:', response.data);
      
      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.support_meetings_id === assignModalRequest.support_meetings_id
            ? { 
                ...req, 
                status: "in_progress",
                assignedTo: selectedAssigneeEmail,
                closingRemark: `Request assigned to ${selectedAssigneeEmail}`
              }
            : req
        )
      );
      
      // Refresh dashboard counts after status update
      fetchDashboardCounts();
      
      // Close modal and reset states
      setIsAssignModalOpen(false);
      setAssignModalRequest(null);
      setSelectedAssigneeEmail("");
      
      alert(`Request assigned successfully to ${selectedAssigneeEmail}!`);
    } catch (error) {
      console.error('Error assigning request:', error);
      alert('Failed to assign request. Please try again.');
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [requestKey]: false }));
    }
  };

  // NEW FUNCTION: Fetch dashboard counts
  const fetchDashboardCounts = async () => {
    if (!accessToken) {
      console.error('No access token available for dashboard counts');
      return;
    }

    setIsLoadingCounts(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/supportDashboard`,
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        }
      };

      const response = await axios.request(config);
      console.log('Dashboard counts:', response.data);
      
      // Update dashboard counts state
      setDashboardCounts({
        supportMeetingsAll: response.data.supportMeetingsAll || 0,
        supportMeetingsResolved: response.data.supportMeetingsResolved || 0,
        supportMeetingsUnresolved: response.data.supportMeetingsUnresolved || 0
      });
      
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
      if (error.response?.status === 401) {
        handleTokenError();
      }
      // Keep existing counts or set to 0
      setDashboardCounts({
        supportMeetingsAll: 0,
        supportMeetingsResolved: 0,
        supportMeetingsUnresolved: 0
      });
    } finally {
      setIsLoadingCounts(false);
    }
  };

  // Update student question status API call
  const updateStudentQuestionStatus = async (supportMeetingsId, assignedUserId, status, closingRemark = "") => {
    try {
      const response = await axios.post(
        `${BASE_URL}/aiservices/updateStudentQuestion`,
        {
          assigned_userid: assignedUserId,
          support_meetings_id: supportMeetingsId,
          closing_remark: closingRemark,
          status: status.toString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating student question:', error);
      throw error;
    }
  };

  // FIXED function to update ONLY closing remark (without status change)
  const handleUpdateClosingRemark = async () => {
    if (!closingRemarkText.trim()) {
      alert('Please enter a closing remark');
      return;
    }

    setIsUpdatingClosingRemark(true);
    
    try {
      // Make API call with only closing_remark data - status will remain unchanged
      const data = JSON.stringify({
       
        "support_meetings_id": selectedRequest.support_meetings_id,
        "closing_remark": closingRemarkText,
        "status": "1" // This should be ignored by backend for closing remark only updates
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/updateStudentQuestion`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('Closing remark updated:', response.data);
      
      // Update only the closing remark in local state (don't change status)
      setRequests(prev =>
        prev.map(req =>
          req.support_meetings_id === selectedRequest.support_meetings_id
            ? { 
                ...req, 
                closingRemark: closingRemarkText
                // Keep existing status unchanged
              }
            : req
        )
      );

      // Update selected request with only closing remark
      setSelectedRequest(prev => ({
        ...prev,
        closingRemark: closingRemarkText
        // Keep existing status unchanged
      }));
      
      alert('Closing remark updated successfully!');
    } catch (error) {
      console.log('Error updating closing remark:', error);
      alert('Failed to update closing remark. Please try again.');
    } finally {
      setIsUpdatingClosingRemark(false);
    }
  };

  // Helper function to convert category name to code - UPDATED with profile update issue
  const getCategoryCodeFromName = (categoryName) => {
    const categoryCodeMap = {
      "technical": "1",
      "course": "2", 
      "certificate": "3",
      "assessment": "4",
      "account": "5",
      "profile update issue": "7", // NEW CATEGORY ADDED
      "other": "6"
    };
    return categoryCodeMap[categoryName] || "6";
  };

  // Updated fetch requests from API with search functionality - UPDATED to also fetch counts
  const fetchSupportRequests = async (categoryFilter = "", emailFilter = "") => {
    if (!accessToken) {
      console.error('No access token available');
      return;
    }

    setLoading(true);
    try {
      // Prepare request data based on search parameters
      let requestData = {};
      
      // Add category search if provided
      if (categoryFilter && categoryFilter !== "all") {
        requestData.category_search = getCategoryCodeFromName(categoryFilter);
      }
      
      // Add email search if provided
      if (emailFilter && emailFilter.trim()) {
        requestData.search = emailFilter.trim();
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/aiservices/studentQuestions`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: JSON.stringify(requestData)
      };

      const response = await axios.request(config);
      console.log('API Response:', response.data);

      // FIXED: Transform the data WITHOUT converting category
      const transformedData = response.data.map(item => ({
        id: `REQ${item.support_meetings_id.toString().padStart(3, '0')}`,
        support_meetings_id: item.support_meetings_id,
        category: item.category, // Use category directly from backend, don't convert
        status: getStatusFromData(item),
        userEmail: item.email,
        userName: `${item.first_name} ${item.middle_name || ''} ${item.last_name}`.trim(),
        description: item.reason || "Support request submitted",
        errorMessage: item.error_message,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        expiry: item.expiry,
        assignedTo: item.closing_remark ? "Technical Team" : null,
        attachments: [],
        responseHistory: [],
        websiteLink: item.website_link,
        googleMeetLink: item.google_meet_link,
        isFeedback: item.is_feedback === "1",
        closingRemark: item.closing_remark,
        userId: item.user_id
      }));

      setRequests(transformedData);
      setFilteredRequests(transformedData);

      // Fetch dashboard counts after loading requests
      fetchDashboardCounts();
      
    } catch (error) {
      console.error('Error fetching support requests:', error);
      if (error.response?.status === 401) {
        handleTokenError();
      }
      setRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed data for modal
  const fetchRequestDetails = async (userId, supportMeetingsId) => {
    if (!accessToken) {
      console.error('No access token available');
      return null;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/aiservices/studentQuestionsAttachments`,
        {
          student_userid: userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching request details:', error);
      if (error.response?.status === 401) {
        handleTokenError();
      }
      return null;
    }
  };

  // Handle token errors
  const handleTokenError = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    setAccessToken('');
    alert('Session expired. Please login again.');
  };

  // Helper functions - UPDATED with profile update issue
  const getCategoryFromCode = (code) => {
    const categoryMap = {
      "1": "technical",
      "2": "course", 
      "3": "certificate",
      "4": "assessment",
      "5": "account",
      "6": "other",
      "7": "profile update issue" // NEW CATEGORY ADDED
    };
    return categoryMap[code] || "other";
  };

  const getStatusFromData = (item) => {
    if (item.closing_remark) return "solved";
    if (item.google_meet_link) return "in_progress";
    return "pending";
  };

  // Token input component
  const TokenInput = () => (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Access Token Required
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Enter your access token..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            localStorage.setItem('accessToken', accessToken);
            fetchSupportRequests();
          }}
          disabled={!accessToken.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: "#1161A0" }}
        >
          Save & Load
        </button>
      </div>
    </div>
  );

  // Search handlers
  const handleCategorySearch = () => {
    fetchSupportRequests(selectedCategory, searchTerm);
  };

  const handleEmailSearch = () => {
    fetchSupportRequests(selectedCategory, searchTerm);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    fetchSupportRequests();
  };

  useEffect(() => {
    if (accessToken) {
      fetchSupportRequests();
    }
  }, [accessToken]);

  // Updated useEffect to remove status filtering
  useEffect(() => {
    let filtered = requests;

    // Remove status filtering - keep only category and search filtering
    if (selectedCategory !== "all") {
      filtered = filtered.filter((req) => req.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [selectedCategory, searchTerm, requests]); // Remove selectedStatus from dependency array

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
        };
      case "in_progress":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "solved":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "closed":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  // UPDATED getCategoryIcon with profile update issue
  const getCategoryIcon = (category) => {
    const iconMap = {
      technical: <Settings className="w-3 h-3" />,
      course: <BookOpen className="w-3 h-3" />,
      certificate: <FileText className="w-3 h-3" />,
      assessment: <HelpCircle className="w-3 h-3" />,
      account: <User className="w-3 h-3" />,
      "profile update issue": <Edit3 className="w-3 h-3" />, // NEW ICON FOR PROFILE UPDATE
      other: <MessageSquare className="w-3 h-3" />,
    };
    return iconMap[category] || <MessageSquare className="w-3 h-3" />;
  };

  // NEW DATE/TIME FORMATTING FUNCTIONS
  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTimeOnly = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleStatusChange = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              assignedTo:
                newStatus === "in_progress" ? "Admin" : req.assignedTo,
            }
          : req
      )
    );

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: newStatus,
        assignedTo: newStatus === "in_progress" ? "Admin" : prev.assignedTo,
      }));
    }
  };

  const handleAssignToTechnical = (requestId) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: "in_progress", assignedTo: "Technical Team" }
          : req
      )
    );

    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest((prev) => ({
        ...prev,
        status: "in_progress",
        assignedTo: "Technical Team",
      }));
    }
  };

  const handleViewDetails = async (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
    setAdminResponse("");
    setClosingRemarkText(request.closingRemark || ""); // Initialize with existing closing remark
    
    const details = await fetchRequestDetails(request.userId, request.support_meetings_id);
    setDetailData(details);
  };

  const handleSendResponse = async () => {
    if (!adminResponse.trim()) return;

    setIsSubmittingResponse(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newResponse = {
        id: Date.now(),
        message: adminResponse,
        sender: "Admin",
        timestamp: new Date().toISOString(),
      };

      setRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                responseHistory: [...req.responseHistory, newResponse],
                status: "in_progress",
              }
            : req
        )
      );

      setSelectedRequest((prev) => ({
        ...prev,
        responseHistory: [...prev.responseHistory, newResponse],
        status: "in_progress",
      }));

      setAdminResponse("");
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  
const calculateTimeRemaining = (expiryTime) => {
  try {
    const currentTime = new Date();
    const expiry = new Date(expiryTime);
    
    // Calculate difference in seconds
    const diffInSeconds = (expiry - currentTime) / 1000;
    
    if (diffInSeconds <= 0) {
      // Expired - show 00:00 and mark as disabled
      return {
        isExpired: true,
        isDisabled: true,
        displayText: "00:00",
        shortText: "00:00",
        badgeColor: "red",
        status: "expired",
        timeRemaining: "00:00"
      };
    } else {
      // Time remaining - format as MM:SS (minutes:seconds)
      const totalMinutes = Math.floor(diffInSeconds / 60);
      const seconds = Math.floor(diffInSeconds % 60);
      
      const timeDisplay = `${totalMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Determine urgency based on time remaining
      let badgeColor, status;
      if (diffInSeconds < 300) { // Less than 5 minutes - critical
        badgeColor = "red";
        status = "critical";
      } else if (diffInSeconds < 900) { // Less than 15 minutes - urgent
        badgeColor = "orange";
        status = "urgent";
      } else if (diffInSeconds < 1800) { // Less than 30 minutes - warning
        badgeColor = "yellow";
        status = "warning";
      } else { // More than 30 minutes - active
        badgeColor = "green";
        status = "active";
      }
      
      return {
        isExpired: false,
        isDisabled: false,
        displayText: timeDisplay,
        shortText: timeDisplay,
        badgeColor,
        status,
        timeRemaining: timeDisplay
      };
    }
  } catch (error) {
    return {
      isExpired: null,
      isDisabled: true,
      displayText: "00:00",
      shortText: "00:00",
      badgeColor: "gray",
      status: "error",
      timeRemaining: "00:00"
    };
  }
};


// Add useEffect to update time every minute
useEffect(() => {
  const interval = setInterval(() => {
    // Force re-render to update countdown timers
    setRequests(prevRequests => [...prevRequests]);
  }, 1000); // Update every minute

  return () => clearInterval(interval);
}, []);

  // UPDATED STATS TO USE API COUNTS
  const stats = [
    {
      title: "Total Requests",
      value: isLoadingCounts ? "..." : dashboardCounts.supportMeetingsAll,
      subtitle: "All support meetings",
      icon: FileText,
      color: "#1161A0",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending",
      value: isLoadingCounts ? "..." : dashboardCounts.supportMeetingsUnresolved,
      subtitle: "Unresolved requests",
      icon: Clock,
      color: "#F47D34",
      bgColor: "bg-orange-50",
    },
    {
      title: "In Progress",
      value: requests.filter((r) => r.status === "in_progress").length,
      subtitle: "Being resolved",
      icon: AlertTriangle,
      color: "#1161A0",
      bgColor: "bg-blue-50",
    },
    {
      title: "Solved",
      value: isLoadingCounts ? "..." : dashboardCounts.supportMeetingsResolved,
      subtitle: "Resolved requests",
      icon: CheckCircle,
      color: "#10B981",
      bgColor: "bg-green-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
        {!accessToken && <TokenInput />}

        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Admin Support Dashboard</h1>
          <div className="flex items-center space-x-2">
           
          </div>
        </div>

        {accessToken && (
          <>


            {/* UPDATED Search Controls Section with profile update issue */}
            <div className="mb-4 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="course">Course</option>
                  <option value="certificate">Certificate</option>
                  <option value="assessment">Assessment</option>
                  <option value="account">Account</option>
                  <option value="profile update issue">Profile Update Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex-1 max-w-md">
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email address..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
              <div
                className="px-4 py-2 border-b border-gray-200"
                style={{ backgroundColor: "#1161A0" }}
              >
                <h2 className="text-sm font-bold text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Support Requests ({filteredRequests.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                {/* UPDATED TABLE WITH SEPARATE DATE AND TIME COLUMNS */}
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Request Details
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        User Information
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
      Time Remaining
    </th>
                      <th className="px-3 py-2 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {filteredRequests.map((request) => {
    const assignButtonLoading = isUpdatingStatus[`${request.support_meetings_id}_assign`];
    const timeRemaining = request.expiry ? calculateTimeRemaining(request.expiry) : null;
    
    // Check if the row should be disabled
    const isRowDisabled = timeRemaining && timeRemaining.isExpired;

    return (
      <tr
        key={request.id}
        className={`transition-colors duration-200 ${
          isRowDisabled 
            ? 'bg-gray-100 opacity-60 pointer-events-none' 
            : 'hover:bg-gray-50'
        }`}
      >
        {/* Request Details Column */}
        <td className="px-3 py-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-900">
                #{request.id}
              </span>
              {isRowDisabled && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  EXPIRED
                </span>
              )}
            </div>
            <p className={`text-xs line-clamp-2 max-w-xs leading-relaxed ${
              isRowDisabled ? 'text-gray-500' : 'text-gray-700'
            }`}>
              {request.description}
            </p>
          </div>
        </td>

        {/* User Information Column - unchanged */}
        <td className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#1161A0" }}
            >
              <User className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className={`text-xs font-semibold ${
                isRowDisabled ? 'text-gray-500' : 'text-gray-900'
              }`}>
                {request.userName}
              </p>
              <div className={`flex items-center text-xs ${
                isRowDisabled ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Mail className="w-2 h-2 mr-1" />
                {request.userEmail}
              </div>
            </div>
          </div>
        </td>

        {/* Category Column - unchanged */}
        <td className="px-3 py-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#F47D34" }}
            >
              <div className="text-white">
                {getCategoryIcon(request.category)}
              </div>
            </div>
            <span className={`text-xs font-medium capitalize ${
              isRowDisabled ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {request.category.replace("_", " ")}
            </span>
          </div>
        </td>

        {/* Date and Time Columns - unchanged */}
        <td className="px-3 py-2">
          <div className={`flex items-center text-xs ${
            isRowDisabled ? 'text-gray-400' : 'text-gray-700'
          }`}>
            <Calendar className="w-3 h-3 mr-1 text-gray-500" />
            {formatDateOnly(request.createdAt)}
          </div>
        </td>

        <td className="px-3 py-2">
          <div className={`flex items-center text-xs ${
            isRowDisabled ? 'text-gray-400' : 'text-gray-700'
          }`}>
            <Clock className="w-3 h-3 mr-1 text-gray-500" />
            {formatTimeOnly(request.createdAt)}
          </div>
        </td>

        {/* Time Remaining Column - unchanged */}
        <td className="px-3 py-2">
          {timeRemaining ? (
            <div className="flex items-center">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                timeRemaining.badgeColor === 'red' 
                  ? 'bg-red-100 text-red-800'
                  : timeRemaining.badgeColor === 'orange'
                  ? 'bg-orange-100 text-orange-800'
                  : timeRemaining.badgeColor === 'green'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <Clock className="w-3 h-3 mr-1" />
                {timeRemaining.shortText}
              </div>
            </div>
          ) : (
            <span className="text-xs text-gray-400">--</span>
          )}
        </td>

        {/* Actions Column - Modified to disable buttons */}
        <td className="px-3 py-2">
          <div className="flex items-center justify-center space-x-1">
            {isRowDisabled ? (
              <span className="text-xs text-red-500 font-medium">
                Request Expired
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleViewDetails(request)}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#1161A0" }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </button>

                <button
                  onClick={() => handleAssignButtonClick(request)}
                  disabled={assignButtonLoading}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {assignButtonLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                  ) : (
                    <UserCheck className="w-3 h-3 mr-1" />
                  )}
                  Assign
                </button>

                <button
                  onClick={() => handleSolveButtonClick(request)}
                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Solve
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

                </table>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      No requests found
                    </h3>
                    <p className="text-xs text-gray-500">
                      {!accessToken ? "Please enter your access token to load data." : "Try adjusting your search criteria or filters."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* NEW SOLVE MODAL */}
      {isSolveModalOpen && solveModalRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2200] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div
              className="px-4 py-3 text-white rounded-t-lg"
              style={{ backgroundColor: "#10B981" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Solve Request</h2>
                  <p className="text-green-100 text-xs mt-1">
                    #{solveModalRequest.id} â€¢ {solveModalRequest.userEmail}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSolveModalOpen(false);
                    setSolveModalRequest(null);
                    setSolveResponseText("");
                  }}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Category:</span> {solveModalRequest.category}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Description:</span> {solveModalRequest.description}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-xs text-red-600 mb-2">
                  Please provide a detailed response explaining how the issue has been resolved. This will be used as the closing remark.
                </p>
                <textarea
                  value={solveResponseText}
                  onChange={(e) => setSolveResponseText(e.target.value)}
                  placeholder="Enter your response explaining how the request has been resolved..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsSolveModalOpen(false);
                    setSolveModalRequest(null);
                    setSolveResponseText("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSolve}
                  disabled={!solveResponseText.trim() || isSolvingRequest}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#10B981" }}
                >
                  {isSolvingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Solving...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline-block" />
                      Send & Solve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW ASSIGN MODAL */}
      {isAssignModalOpen && assignModalRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2100] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div
              className="px-4 py-3 text-white rounded-t-lg"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Assign Request</h2>
                  <p className="text-purple-100 text-xs mt-1">
                    #{assignModalRequest.id} â€¢ {assignModalRequest.userEmail}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setAssignModalRequest(null);
                    setSelectedAssigneeEmail("");
                  }}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Support Team Member
                </label>
                
                {isLoadingSupportEmails ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Loading support emails...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedAssigneeEmail}
                      onChange={(e) => setSelectedAssigneeEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none pr-10"
                    >
                      <option value="">Choose an email to assign...</option>
                      {supportEmails.map((user, index) => (
                        <option key={index} value={user.email}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                )}
                
                {supportEmails.length === 0 && !isLoadingSupportEmails && (
                  <p className="text-sm text-gray-500 mt-2">
                    No support emails available. Please contact the administrator.
                  </p>
                )}
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Request Details</h4>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Category:</span> {assignModalRequest.category}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Description:</span> {assignModalRequest.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setAssignModalRequest(null);
                    setSelectedAssigneeEmail("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  disabled={!selectedAssigneeEmail || isUpdatingStatus[`${assignModalRequest.support_meetings_id}_assign`]}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {isUpdatingStatus[`${assignModalRequest.support_meetings_id}_assign`] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Assigning...
                    </>
                  ) : (
                    'Assign Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - Keep existing modal code here */}
      {isDetailModalOpen && selectedRequest && accessToken && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-2">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div
              className="px-4 py-3 text-white"
              style={{ backgroundColor: "#1161A0" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold">Request Details</h2>
                  <p className="text-blue-100 text-xs mt-1">
                    #{selectedRequest.id} â€¢{" "}
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setDetailData(null);
                    setClosingRemarkText("");
                  }}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-150px)] p-4 space-y-4">
              {/* User Information */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <User className="w-4 h-4 mr-2" style={{ color: "#1161A0" }} />
                  User Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Full Name
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {selectedRequest.userName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Email Address
                    </label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.userEmail}
                      </p>
                    </div>
                  </div>
                  
                  {detailData?.student && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Program
                        </label>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {detailData.student.program}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Branch
                        </label>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {detailData.student.branch}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Institute
                        </label>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {detailData.student.institute}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Final Year
                        </label>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {detailData.student.final_year}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <FileText
                    className="w-4 h-4 mr-2"
                    style={{ color: "#F47D34" }}
                  />
                  Request Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Category
                    </label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-4 h-4 rounded-lg flex items-center justify-center mr-2"
                        style={{ backgroundColor: "#F47D34" }}
                      >
                        <div className="text-white">
                          {getCategoryIcon(selectedRequest.category)}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {selectedRequest.category.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Submitted On
                    </label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Description
                  </label>
                  <div className="bg-white rounded-lg p-3 mt-2 border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {selectedRequest.description}
                    </p>
                  </div>
                </div>

                {selectedRequest.errorMessage && (
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Error Message
                    </label>
                    <div className="bg-red-50 rounded-lg p-3 mt-2 border border-red-200">
                      <p className="text-red-800 font-mono text-sm">
                        {selectedRequest.errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.websiteLink && (
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Website Link
                    </label>
                    <div className="bg-white rounded-lg p-3 mt-2 border border-gray-200">
                      <a 
                        href={selectedRequest.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        {selectedRequest.websiteLink}
                      </a>
                    </div>
                  </div>
                )}
                {/* Editable Closing Remark Section */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Closing Remark
                  </label>
                  <div className="mt-2 space-y-3">
                    <textarea
                      value={closingRemarkText}
                      onChange={(e) => setClosingRemarkText(e.target.value)}
                      placeholder="Enter closing remark..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      rows={3}
                    />
                    <button
                      onClick={handleUpdateClosingRemark}
                      disabled={!closingRemarkText.trim() || isUpdatingClosingRemark}
                      className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all text-sm"
                      style={{ backgroundColor: "#10B981" }}
                    >
                      {isUpdatingClosingRemark ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Closing Remark
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* UPDATED Attachments with Download Functionality */}
              {detailData?.supportMeetingAttachments && detailData.supportMeetingAttachments.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                    <FileText className="w-4 h-4 mr-2 text-gray-600" />
                    Attachments ({detailData.supportMeetingAttachments.length})
                  </h3>
                  <div className="space-y-2">
                    {detailData.supportMeetingAttachments.map((attachment, index) => {
                      // Extract the original filename from the attachment name
                      // The format appears to be: uuid + original_filename
                      const originalFilename = attachment.support_meeting_attachments_name?.includes('whatsappvideo') 
                        ? attachment.support_meeting_attachments_name.substring(36) // Remove UUID prefix
                        : attachment.support_meeting_attachments_name || `Attachment ${index + 1}`;

                      return (
                        <div
                          key={attachment.support_meeting_attachments_id || index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700 block">
                                {originalFilename}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(attachment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAttachmentDownload(attachment.support_meeting_attachments_name)}
                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "#1161A0" }}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminSupportDashboard;