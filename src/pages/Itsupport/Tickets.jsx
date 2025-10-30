import React, { useEffect, useState } from "react";
import { useSocket } from "../../components/Hooks/Useshocket";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";

function Tickets() {
  const { socket, lastMessage } = useSocket();
  const [tickets, setTickets] = useState([]);
  const [supportUsers, setSupportUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingTickets, setAcceptingTickets] = useState(new Set());

  // Get access token from localStorage
  const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };

  // Fetch support user IDs from API
  useEffect(() => {
    const fetchSupportUsers = async () => {
      try {
        setLoading(true);
        const accessToken = getAccessToken();
        
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/aiservices/supportUserids`,
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          }
        };

        const response = await axios.request(config);
        console.log("✅ Support Users Data:", response.data);
        setSupportUsers(response.data);
        setError(null);
      } catch (error) {
        console.error("❌ Error fetching support users:", error);
        setError(error.message || 'Failed to fetch support users');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportUsers();
  }, []);

  // Handle WebSocket messages for tickets
  useEffect(() => {
    if (!lastMessage) return;

    console.log("📩 Message received in Tickets:", lastMessage);
    try {
      const parsedData = JSON.parse(lastMessage);
      console.log("✅ Parsed Data:", parsedData);
      setTickets(parsedData);
    } catch (error) {
      console.error("❌ Error parsing WebSocket data:", error);
    }
  }, [lastMessage]);

  const formatFullName = (firstName, middleName, lastName) => {
    const nameParts = [firstName, middleName, lastName].filter(
      (part) => part && part.trim()
    );
    return nameParts.length > 0 ? nameParts.join(" ") : "N/A";
  };

  const formatAssignedUsers = (assignedUsers) => {
    if (!assignedUsers) return "Unassigned";
    return assignedUsers.split(",").join(", ");
  };

  // Check if current support user is already assigned to the ticket
  const isCurrentUserAssigned = (assignedUserIds, currentUserId) => {
    if (!assignedUserIds || !currentUserId) return false;
    const assignedIds = assignedUserIds.split(',').map(id => id.trim());
    return assignedIds.includes(currentUserId.toString());
  };

  // Handle accept ticket action
  const handleAcceptTicket = async (ticketId) => {
    try {
      const accessToken = getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Add ticket to accepting state
      setAcceptingTickets(prev => new Set([...prev, ticketId]));

      console.log("🎫 Accepting ticket:", ticketId);
      console.log("👤 Current support user:", supportUsers);
      
      // Prepare the data for API call
      const data = JSON.stringify({
        "support_meetings_id": ticketId
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/supportAssignment`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: data
      };

      const response = await axios.request(config);
      console.log("✅ Ticket accepted successfully:", JSON.stringify(response.data));
      
      // Update the tickets state to reflect the assignment
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.support_meetings_id === ticketId 
            ? {
                ...ticket,
                "group_concat(support_assignments.assigned_userid)": supportUsers.toString()
              }
            : ticket
        )
      );

      // Show success message (optional)
      alert('Ticket accepted successfully!');

    } catch (error) {
      console.error("❌ Error accepting ticket:", error);
      
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        console.error("Server Error:", error.response.data);
        alert(`Failed to accept ticket: ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        // Network error
        console.error("Network Error:", error.request);
        alert('Network error: Please check your connection');
      } else {
        // Other error
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      // Remove ticket from accepting state
      setAcceptingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Loading support data...</h3>
          <p className="text-xs text-slate-500">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Error loading data</h3>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            Support Tickets
          </h1>
         
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">No tickets available</h3>
            <p className="text-xs text-slate-500">New support tickets will appear here when submitted</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Table Header Stats */}
            <div className="bg-blue-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Active Tickets</h2>
                <div className="flex items-center space-x-3">
                  <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {tickets.length} Total
                  </span>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs">Live Updates</span>
                </div>
              </div>
            </div>

            {/* Table Container with proper overflow handling */}
            <div className="overflow-x-auto relative">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Ticket ID</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Student</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Contact</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">State</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Issue Type</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket, index) => {
                    const isAssigned = isCurrentUserAssigned(
                      ticket["group_concat(support_assignments.assigned_userid)"], 
                      supportUsers
                    );
                    const isAccepting = acceptingTickets.has(ticket.support_meetings_id);
                    
                    return (
                      <tr 
                        key={ticket.support_meetings_id} 
                        className={`group transition-all duration-300 ease-in-out ${
                          isAssigned 
                            ? 'bg-red-50 hover:bg-red-100' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <td className="px-4 py-3 relative">
                          <div className="flex items-center space-x-2">
                            {isAssigned ? (
                              <div className="flex items-center space-x-1">
                                {/* Status Flag with Simple Hover Tooltip */}
                                <div 
                                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer relative group/tooltip"
                                  title="You can't take this ticket because you already have it assigned and you didn't resolve that"
                                >
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                  </svg>
                                  
                                  {/* Custom Tooltip */}
                                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-2 bg-black text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none" style={{zIndex: 99999}}>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                    <div className="text-center">
                                      <div className="font-semibold mb-1">Ticket Already Assigned</div>
                                      <div className="text-xs text-gray-200 max-w-48">
                                        You can't take this ticket because you already have it assigned to yourself. 
                                        Please work on your existing tickets or wait for new ones.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-red-600">Already Assigned</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                {/* Status Flag with Simple Hover Tooltip */}
                                <div 
                                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer relative group/tooltip"
                                  title="This ticket is available for you to accept"
                                >
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  
                                  {/* Custom Tooltip */}
                                  <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-2 bg-black text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none" style={{zIndex: 99999}}>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                    <div className="text-center">
                                      <div className="font-semibold mb-1">Ticket Available</div>
                                      <div className="text-xs text-gray-200 max-w-48">
                                        This support ticket is currently unassigned and available for you to accept. 
                                        Click "Accept" to take ownership and help the customer.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-green-600">Available</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              isAssigned ? 'bg-red-500' : 'bg-blue-500'
                            }`}>
                              <span className="text-white text-xs font-bold">#{ticket.support_meetings_id}</span>
                            </div>
                            <div className={`w-1 h-6 bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                              isAssigned ? 'bg-red-200' : 'bg-blue-200'
                            }`}></div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {formatFullName(ticket.first_name, ticket.middle_name, ticket.last_name).charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className={`font-semibold text-xs transition-colors ${
                                isAssigned 
                                  ? 'text-slate-900 group-hover:text-red-700' 
                                  : 'text-slate-900 group-hover:text-blue-700'
                              }`}>
                                {formatFullName(ticket.first_name, ticket.middle_name, ticket.last_name)}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-slate-600 text-xs">{ticket.email}</span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-slate-600 text-xs truncate max-w-32" title={ticket.state_name || "N/A"}>
                              {ticket.state_name || "N/A"}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            isAssigned 
                              ? 'bg-red-100 text-red-800 border-red-200' 
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 animate-pulse ${
                              isAssigned ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            {ticket.name}
                          </span>
                        </td>
                        
                        <td className="px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2" title={ticket.reason || "No reason provided"}>
                              {ticket.reason || "No reason provided"}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-4 py-3 text-center">
                          {isAssigned ? (
                            <button 
                              disabled
                              className="relative inline-flex items-center px-3 py-1.5 bg-slate-400 text-slate-600 text-xs font-medium rounded-lg shadow cursor-not-allowed opacity-60"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              </svg>
                              Already Assigned
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleAcceptTicket(ticket.support_meetings_id)}
                              disabled={isAccepting}
                              className={`group relative inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg shadow-lg transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                isAccepting 
                                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                  : 'bg-blue-600 text-white hover:shadow-xl hover:scale-105'
                              }`}
                            >
                              {isAccepting ? (
                                <>
                                  <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-white border-t-transparent"></div>
                                  Accepting...
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3 mr-1 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  Accept
                                  <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-slate-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Showing <span className="font-semibold text-slate-900">{tickets.length}</span> tickets</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-600">Real-time updates active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tickets;
