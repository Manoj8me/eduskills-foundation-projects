import React, { useState } from "react";

// Dynamic Tabs Component (similar to Zoho style)
const DynamicTabs = ({ tabs, defaultActiveTab = 0, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const tabStyles = `
    /* Custom tab styles */
    .tab-container {
      border-bottom: 2px solid #e5e7eb;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .tab-container.sticky {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .tab-button {
      position: relative;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
    }
    
    .tab-button:hover {
      background-color: #f9fafb;
      border-bottom-color: #d1d5db;
    }
    
    .tab-button.active {
      color: #2563eb;
      border-bottom-color: #2563eb;
      background-color: #eff6ff;
    }
    
    .tab-button.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #2563eb;
    }
    
    .tab-content {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .tab-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .tab-button:disabled:hover {
      background-color: transparent;
      border-bottom-color: transparent;
    }
    
    .tab-badge {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }
  `;

  return (
    <div className={`w-full ${className}`}>
      <style>{tabStyles}</style>

      {/* Tab Navigation - Fixed on scroll */}
      <div className="tab-container sticky top-0 z-50 bg-white">
        <nav className="flex space-x-0 bg-white rounded-t-lg shadow-sm">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`tab-button px-6 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative ${
                activeTab === index
                  ? "active"
                  : "text-gray-600 hover:text-gray-800"
              } ${index === 0 ? "rounded-tl-lg" : ""} ${
                index === tabs.length - 1 ? "rounded-tr-lg" : ""
              }`}
              disabled={tab.disabled}
            >
              <div className="flex items-center space-x-2">
                {/* Tab Icon */}
                {tab.icon && <span className="text-lg">{tab.icon}</span>}

                {/* Tab Label */}
                <span>{tab.label}</span>

                {/* Badge/Counter */}
                {tab.badge && (
                  <span className="tab-badge text-white text-xs px-2 py-1 rounded-full ml-2">
                    {tab.badge}
                  </span>
                )}

                {/* New indicator */}
                {tab.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full ml-2 animate-pulse">
                    New
                  </span>
                )}

                {/* Disabled indicator */}
                {tab.disabled && (
                  <span className="text-gray-400 text-xs ml-2">
                    (Coming Soon)
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content bg-white rounded-b-lg shadow-sm min-h-[400px]">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default DynamicTabs;
