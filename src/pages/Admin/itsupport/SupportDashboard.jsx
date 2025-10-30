import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Activity, Users, TrendingUp, AlertCircle, Search, Filter, Download, Calendar } from 'lucide-react';
import { BASE_URL } from '../../../services/configUrls';

const SupportDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('counting');
  
  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Function to format date for display (keeping YYYY-MM-DD format)
  const formatDateForDisplay = (date) => {
    return date; // Already in YYYY-MM-DD format
  };

  // Initialize dates to current day by default
  useEffect(() => {
    const currentDate = getCurrentDate();
    setStartDate(currentDate);
    setEndDate(currentDate);
  }, []);

  // Fetch data when dates change
  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData();
    }
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
      // Prepare date range data in YYYY-MM-DD format
      const dateData = {
        started: startDate,
        ended: endDate
      };

      const config = {
        method: 'post',
        url: `${BASE_URL}/aiservices/allSupportDashboard`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessToken}`
        },
        data: dateData
      };

      const response = await axios.request(config);
      console.log('Dashboard Data:', response);
      
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Process data - group by email and sum counting values
  const processedData = () => {
    const emailGroups = dashboardData.reduce((acc, item) => {
      if (acc[item.email]) {
        acc[item.email] += item.counting;
      } else {
        acc[item.email] = item.counting;
      }
      return acc;
    }, {});

    return Object.entries(emailGroups).map(([email, counting]) => ({
      email: email.length > 25 ? `${email.substring(0, 25)}...` : email,
      fullEmail: email,
      counting
    }));
  };

  // Calculate statistics
  const getStatistics = () => {
    const processedEmails = processedData();
    const totalEmails = processedEmails.length;
    const totalActivities = processedEmails.reduce((sum, item) => sum + item.counting, 0);
    const avgPerEmail = totalEmails > 0 ? (totalActivities / totalEmails) : 0;
    const maxActivity = Math.max(...processedEmails.map(item => item.counting), 0);
    
    return { totalEmails, totalActivities, avgPerEmail, maxActivity };
  };

  // Filter and sort data
  const getFilteredData = () => {
    let filtered = processedData();
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.fullEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'counting') return b.counting - a.counting;
      if (sortBy === 'email') return a.fullEmail.localeCompare(b.fullEmail);
      return 0;
    });
  };

  // Prepare pie chart data
  const getPieChartData = () => {
    const data = getFilteredData();
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    return data.slice(0, 6).map((item, index) => ({
      ...item,
      color: colors[index % colors.length]
    }));
  };

  // Quick date preset functions
  const setToday = () => {
    const currentDate = getCurrentDate();
    setStartDate(currentDate);
    setEndDate(currentDate);
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setStartDate(yesterdayStr);
    setEndDate(yesterdayStr);
  };

  const setLast7Days = () => {
    const end = getCurrentDate();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    const startStr = start.toISOString().split('T')[0];
    setStartDate(startStr);
    setEndDate(end);
  };

  const setLast30Days = () => {
    const end = getCurrentDate();
    const start = new Date();
    start.setDate(start.getDate() - 29);
    const startStr = start.toISOString().split('T')[0];
    setStartDate(startStr);
    setEndDate(end);
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = getCurrentDate();
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end);
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1).toISOString().split('T')[0];
    const end = new Date(year, month + 1, 0).toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
  };

  const statistics = getStatistics();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-sm font-medium text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Support Dashboard</h1>
            <p className="text-xs text-gray-600 mt-1">Monitor email activity and support metrics</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download className="w-3 h-3 mr-2" />
              Export
            </button>
            <button 
              onClick={fetchDashboardData}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              <Activity className="w-3 h-3 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Date Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900">Date Range Filter</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-1">
                <button 
                  onClick={setToday}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                >
                  Today
                </button>
                <button 
                  onClick={setYesterday}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                >
                  Yesterday
                </button>
                <button 
                  onClick={setLast7Days}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors"
                >
                  Last 7 Days
                </button>
                <button 
                  onClick={setLast30Days}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs hover:bg-orange-200 transition-colors"
                >
                  Last 30 Days
                </button>
                <button 
                  onClick={setCurrentMonth}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors"
                >
                  This Month
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-600">
            Showing data from <span className="font-semibold">{formatDateForDisplay(startDate)}</span> to <span className="font-semibold">{formatDateForDisplay(endDate)}</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Emails</p>
                <p className="text-sm font-bold text-gray-900">{statistics.totalEmails}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Activities</p>
                <p className="text-sm font-bold text-gray-900">{statistics.totalActivities}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Average per Email</p>
                <p className="text-sm font-bold text-gray-900">{statistics.avgPerEmail.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Highest Activity</p>
                <p className="text-sm font-bold text-gray-900">{statistics.maxActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 pr-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-3 h-3 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                >
                  <option value="counting">Sort by Activity</option>
                  <option value="email">Sort by Email</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vertical Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Email Activity Distribution</h3>
              <div className="text-xs text-gray-500">
                {getFilteredData().length} emails shown
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={getFilteredData()}
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="email" 
                  stroke="#64748b" 
                  fontSize={8}
                  angle={-45}
                  textAnchor="end"
                  height={40}
                  interval={0}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={9}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '11px'
                  }}
                  formatter={(value, name, props) => [
                    value,
                    'Activity Count'
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullEmail;
                    }
                    return label;
                  }}
                />
                <Bar 
                  dataKey="counting" 
                  fill="#3B82F6" 
                  name="Activity Count"
                  radius={[2, 2, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Distribution</h3>
            
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="counting"
                  label={({counting, percent}) => `${counting} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  fontSize={8}
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '11px'
                  }}
                  formatter={(value, name, props) => [
                    value,
                    'Activity Count'
                  ]}
                  labelFormatter={(label, payload) => {
                    return payload[0].payload.fullEmail;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Email Activity Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Count
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredData().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 text-gray-400 mr-2" />
                        <div className="text-xs font-medium text-gray-900">
                          {item.fullEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-xs text-gray-900 font-semibold">
                          {item.counting}
                        </div>
                        <div className="ml-2 w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ 
                              width: `${(item.counting / statistics.maxActivity) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {statistics.totalActivities > 0 
                        ? ((item.counting / statistics.totalActivities) * 100).toFixed(1)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
