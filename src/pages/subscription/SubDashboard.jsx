import React from "react";
import DynamicTabs from "./DynamicTabs"; // Import the tabs component

import MembershipDetails from "./MembershipDetails"; // Import MembershipDetails component
import MembershipTable from "./Subscription";

const SubDashboard = () => {
  // Define the tabs configuration
  const tabsConfig = [
    {
      label: "Services",
      icon: "🔧",
      content: <MembershipTable />,
      isNew: false,
      disabled: false,
    },
    {
      label: "Details",
      icon: "📋",
      content: <MembershipDetails />,
      isNew: false,
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Membership Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your memberships and view detailed information
          </p>
        </div>

        {/* Tabs Container */}
        <DynamicTabs
          tabs={tabsConfig}
          defaultActiveTab={0}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default SubDashboard;
