import { useEffect, useState } from "react";
import { BASE_URL } from "../../services/configUrls";

export default function MaintenancePage() {
  const [maintenanceData, setMaintenanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState("");

  // Fetch maintenance data
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/staff/page`);

        if (response.ok) {
          const data = await response.json();
          setMaintenanceData(data);
        } else {
          setMaintenanceData(null);
        }
      } catch (error) {
        console.error("Error fetching maintenance status:", error);
        setMaintenanceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceStatus();

    // Poll every 5 minutes to check if maintenance is over
    const interval = setInterval(fetchMaintenanceStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate countdown timer
  useEffect(() => {
    if (!maintenanceData?.end_time || !maintenanceData?.show_countdown) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(maintenanceData.end_time);
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeRemaining("Maintenance ending soon...");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${hours}h ${minutes}m remaining`);
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [maintenanceData]);

  // If maintenance data is not active or loading, don't show maintenance page
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If no active maintenance, return null or redirect
  if (!maintenanceData || !maintenanceData.is_active) {
    return null; // Or redirect to home page
  }

  // Get maintenance type color
  const getMaintenanceColor = (type) => {
    switch (type) {
      case "Emergency":
        return "bg-red-500";
      case "Upgrade":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex  justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 mt-28 ">
          {/* Icon */}
          <div
            className={`w-16 h-16 mx-auto mb-4 ${getMaintenanceColor(
              maintenanceData.maintenance_type
            )} rounded-full flex items-center justify-center`}
          >
            <svg
              className="w-8 h-8 text-gray-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Maintenance Type Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getMaintenanceColor(
                maintenanceData.maintenance_type
              )} text-gray-900`}
            >
              {maintenanceData.title}
            </span>
          </div>

          {/* Message */}
          <p className="text-xl text-gray-300 mb-6">
            {maintenanceData.message}
          </p>

          {/* Countdown Timer */}
          {maintenanceData.show_countdown && timeRemaining && (
            <div className="mb-6">
              <div className="inline-block bg-gray-800 px-6 py-3 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Estimated time</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {timeRemaining}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-8">
          Thank you for your patience
        </p>
      </div>
    </div>
  );
}
