import React from "react";
import { downloadTicket } from "./downloadTicket";

// QR Code Generator Component
const QRCode = ({ value, size = 120 }) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    value
  )}`;

  return (
    <div className="bg-white p-2 rounded-lg shadow-inner">
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="w-full h-full"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

// Registration Details Banner Component with Ticket Design
const RegistrationBanner = ({ isFetchingDetails, registrationInfo }) => (
  <div className="w-full max-w-lg mx-auto mb-6">
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>

        <div className="flex items-center justify-between relative z-10">
          {/* <div>
            <h2 className="text-2xl font-bold mb-1">Conference Ticket</h2>
            <p className="text-blue-100">Your entry pass</p>
          </div> */}
          <div className="flex items-center space-x-4">
            {/* {registrationInfo && Object.keys(registrationInfo).length > 0 && (
              <button
                onClick={() => downloadTicket(registrationInfo)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                title="Download Ticket"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Download</span>
              </button>
            )} */}
          </div>
        </div>

        {isFetchingDetails && (
          <div className="absolute top-4 right-4 flex items-center text-white">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span className="text-sm">Updating...</span>
          </div>
        )}
      </div>

      {/* Perforated Line */}
      <div className="relative h-8 bg-gray-50">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-100 rounded-r-full -ml-2"></div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gray-100 rounded-l-full -mr-2"></div>
        <div className="flex justify-center items-center h-full">
          <div className="flex space-x-2">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
        {registrationInfo && Object.keys(registrationInfo).length > 0 ? (
          <div className="flex justify-between items-start">
            {/* Left Side - Details */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* <div className="space-y-2"> */}
                {/* <div className="ticket-field">
                    <span className="ticket-label">Registration ID</span>
                    <span className="ticket-value font-bold text-lg text-blue-600">
                      {registrationInfo.registration_id || "N/A"}
                    </span>
                  </div> */}
                <div className="ticket-field">
                  <span className="ticket-label">Attendee Name</span>
                  <span className="ticket-value">
                    {registrationInfo.name || "N/A"}
                  </span>
                  {/* </div> */}
                </div>

                <div className="space-y-4">
                  <div className="ticket-field">
                    <span className="ticket-label">Email Address</span>
                    <span className="ticket-value">
                      {registrationInfo.email || "N/A"}
                    </span>
                  </div>
                  <div className="ticket-field">
                    <span className="ticket-label">Venue</span>
                    <span className="ticket-value">
                      {registrationInfo.venue ||
                        "East Bourne-A Pine Forest Resort"}
                    </span>
                  </div>
                </div>
              </div>

              {registrationInfo.mobile_number && (
                <div className="ticket-field">
                  <span className="ticket-label">Contact Number</span>
                  <span className="ticket-value">
                    {registrationInfo.mobile_number}
                  </span>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Registered
                </div>
              </div>
            </div>

            {/* Right Side - QR Code */}
            {/* <div className="ml-8 text-center">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <QRCode
                  value={`Registration ID: ${
                    registrationInfo.registration_id || "N/A"
                  }\nName: ${registrationInfo.name || "N/A"}\nEmail: ${
                    registrationInfo.email || "N/A"
                  }`}
                  size={120}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Scan for verification
              </p>
            </div> */}
          </div>
        ) : (
          !isFetchingDetails && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-600">
                Registration details will be available soon
              </p>
            </div>
          )
        )}
      </div>

      {/* Ticket Footer */}
      {/* <div className="bg-gray-100 px-8 py-4 text-center border-t border-dashed border-gray-300">
        <p className="text-sm text-gray-600">
          Please present this ticket at the venue entrance
        </p>
      </div> */}
    </div>

    <style jsx>{`
      .ticket-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .ticket-label {
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .ticket-value {
        font-size: 16px;
        color: #1f2937;
        font-weight: 500;
      }
    `}</style>
  </div>
);

export default RegistrationBanner;
