import { useState } from "react";

// QR Code Component (Simple SVG-based QR code)
const QRCode = ({ value, size = 200 }) => {
  const generateQRPattern = (text) => {
    const size = 21;
    const pattern = [];

    for (let i = 0; i < size; i++) {
      pattern[i] = [];
      for (let j = 0; j < size; j++) {
        const hash = (text.charCodeAt(i % text.length) * (i + j + 1)) % 256;
        pattern[i][j] = hash > 127;
      }
    }

    const addFinderPattern = (startX, startY) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (startX + i < size && startY + j < size) {
            pattern[startX + i][startY + j] =
              i === 0 ||
              i === 6 ||
              j === 0 ||
              j === 6 ||
              (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          }
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, size - 7);
    addFinderPattern(size - 7, 0);

    return pattern;
  };

  const pattern = generateQRPattern(value);
  const cellSize = size / pattern.length;

  return (
    <svg
      width={size}
      height={size}
      className="border border-gray-300 rounded-lg"
    >
      {pattern.map((row, i) =>
        row.map((cell, j) => (
          <rect
            key={`${i}-${j}`}
            x={j * cellSize}
            y={i * cellSize}
            width={cellSize}
            height={cellSize}
            fill={cell ? "#000" : "#fff"}
          />
        ))
      )}
    </svg>
  );
};

// Enhanced Completion Component with PDF Download
const CompletionComponent = ({ registrationData }) => {
  const [showTicket, setShowTicket] = useState(false);

  // Handle case where registrationData might be undefined
  if (!registrationData || !registrationData.userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Registration Data Missing
          </h1>
          <p className="text-gray-600 mb-6">
            Unable to load registration information.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const generateTicketId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `CONF-${timestamp}-${randomPart}`.toUpperCase();
  };

  const ticketId = generateTicketId();

  // Get available days from registration info
  const availableDays = [];
  if (registrationData.registrationInfo?.day1) availableDays.push("2024-09-17");
  if (registrationData.registrationInfo?.day2) availableDays.push("2024-09-18");
  if (registrationData.registrationInfo?.day3) availableDays.push("2024-09-19");

  const qrData = JSON.stringify({
    ticketId,
    name: registrationData.userDetails.name,
    email: registrationData.userDetails.email,
    status: registrationData.userStatus,
    eventDates: availableDays,
    preferences: registrationData.preferences,
  });

  const statusConfig = {
    "member-complimentary-no-stay": {
      title: "Member Institution - Complimentary Pass",
      subtitle: "Without Stay",
      color: "green",
      gradient: "from-green-400 to-green-500",
    },
    "member-complimentary-with-stay": {
      title: "Member Institution - Complimentary Pass",
      subtitle: "With Accommodation",
      color: "blue",
      gradient: "from-blue-400 to-blue-500",
    },
    "non-member-with-stay": {
      title: "Non-Member Institution",
      subtitle: "With Stay",
      color: "red",
      gradient: "from-red-400 to-red-500",
    },
  };

  const config =
    statusConfig[registrationData.userStatus] ||
    statusConfig["member-complimentary-with-stay"];

  const generateQRCodeSVG = (text, size = 100) => {
    const pattern = generateQRPattern(text);
    const cellSize = size / pattern.length;

    let svgContent = "";
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        if (pattern[i][j]) {
          svgContent += `<rect x="${j * cellSize}" y="${
            i * cellSize
          }" width="${cellSize}" height="${cellSize}" fill="#000"/>`;
        }
      }
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="border: 1px solid #ccc; border-radius: 4px; display: block;">${svgContent}</svg>`;
  };

  const generateQRPattern = (text) => {
    const size = 21;
    const pattern = [];

    for (let i = 0; i < size; i++) {
      pattern[i] = [];
      for (let j = 0; j < size; j++) {
        const hash = (text.charCodeAt(i % text.length) * (i + j + 1)) % 256;
        pattern[i][j] = hash > 127;
      }
    }

    const addFinderPattern = (startX, startY) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (startX + i < size && startY + j < size) {
            pattern[startX + i][startY + j] =
              i === 0 ||
              i === 6 ||
              j === 0 ||
              j === 6 ||
              (i >= 2 && i <= 4 && j >= 2 && j <= 4);
          }
        }
      }
    };

    addFinderPattern(0, 0);
    addFinderPattern(0, size - 7);
    addFinderPattern(size - 7, 0);

    return pattern;
  };

  const downloadTicketPDF = () => {
    const qrCodeSVG = generateQRCodeSVG(qrData, 100);

    const printWindow = window.open("", "_blank");
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Conference Ticket - ${ticketId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.3; 
              color: #333; 
              background: white;
              padding: 15px;
              font-size: 12px;
            }
            .ticket-container {
              max-width: 700px;
              margin: 0 auto;
              background: white;
              border: 2px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              page-break-inside: avoid;
            }
            .ticket-header {
              background: linear-gradient(135deg, ${
                config.color === "blue"
                  ? "#3B82F6, #1D4ED8"
                  : config.color === "green"
                  ? "#10B981, #059669"
                  : "#EF4444, #DC2626"
              });
              color: white;
              padding: 20px;
              text-align: center;
            }
            .ticket-header h1 { font-size: 24px; margin-bottom: 8px; }
            .ticket-header p { font-size: 14px; opacity: 0.9; }
            .ticket-body { padding: 20px; }
            .ticket-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; align-items: start; }
            .ticket-details h3 { font-size: 14px; margin-bottom: 10px; color: #1F2937; font-weight: bold; }
            .detail-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 4px 0; 
              border-bottom: 1px solid #E5E7EB; 
              font-size: 11px;
            }
            .detail-item:last-child { border-bottom: none; }
            .ticket-id { 
              background: #F3F4F6; 
              padding: 10px; 
              border-radius: 6px; 
              margin-bottom: 15px; 
              text-align: center;
            }
            .ticket-id strong { font-size: 14px; font-family: monospace; }
            .qr-section { text-align: center; }
            .qr-container {
              margin: 10px auto;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              max-width: 120px;
            }
            .schedule-item {
              background: #F8FAFC;
              padding: 6px;
              border-radius: 4px;
              margin-bottom: 4px;
              border-left: 3px solid ${
                config.color === "blue"
                  ? "#3B82F6" // Continuation of the downloadTicketPDF function and rest of CompletionComponent
                  : config.color === "green"
                  ? "#10B981"
                  : "#EF4444"
              };
              font-size: 10px;
            }
            .instructions {
              background: #FEF3C7;
              border: 1px solid #F59E0B;
              border-radius: 6px;
              padding: 12px;
              margin-top: 15px;
            }
            .instructions h4 { color: #92400E; margin-bottom: 6px; font-size: 12px; }
            .instructions ul { margin-left: 15px; }
            .instructions li { margin-bottom: 2px; color: #92400E; font-size: 10px; }
            .ticket-footer {
              background: #F9FAFB;
              padding: 10px;
              text-align: center;
              border-top: 1px solid #E5E7EB;
              font-size: 9px;
              color: #6B7280;
            }
            .section-spacing { margin-bottom: 15px; }
            @media print {
              body { 
                background: white; 
                padding: 5px; 
                font-size: 11px;
              }
              .ticket-container { 
                box-shadow: none; 
                border: 1px solid #333;
                max-width: 100%;
                margin: 0;
                page-break-inside: avoid;
              }
              .ticket-header { padding: 15px; }
              .ticket-body { padding: 15px; }
              .ticket-grid { 
                grid-template-columns: 1.8fr 1fr; 
                gap: 15px; 
                align-items: start;
              }
              .qr-section { 
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                max-width: 140px;
                margin: 0 auto;
              }
              .qr-container { 
                width: 100px;
                height: 100px;
                max-width: 100px;
                max-height: 100px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 8px 0;
              }
              .qr-container svg { 
                width: 100px !important; 
                height: 100px !important;
                max-width: 100px !important;
                max-height: 100px !important;
                border: 1px solid #ccc;
              }
              .instructions { margin-top: 10px; padding: 8px; }
              .instructions h4 { font-size: 11px; }
              .instructions li { font-size: 9px; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-header">
              <h1>🎓 Digital Ticket</h1>
              <p>EduSkills Connect 2024 • September 17-19, 2024</p>
            </div>
            
            <div class="ticket-body">
              <div class="ticket-id">
                <strong>Ticket ID: ${ticketId}</strong>
              </div>
              
              <div class="ticket-grid">
                <div class="ticket-details">
                  <div class="section-spacing">
                    <h3>🎫 Ticket Information</h3>
                    <div class="detail-item">
                      <span>Type:</span>
                      <strong>${config.title}</strong>
                    </div>
                    <div class="detail-item">
                      <span>Package:</span>
                      <strong>${config.subtitle}</strong>
                    </div>
                    <div class="detail-item">
                      <span>Status:</span>
                      <strong style="color: #059669;">✅ Confirmed</strong>
                    </div>
                  </div>
                  
                  <div class="section-spacing">
                    <h3>👤 Attendee Details</h3>
                    <div class="detail-item">
                      <span>Name:</span>
                      <strong>${registrationData.userDetails.name}</strong>
                    </div>
                    <div class="detail-item">
                      <span>Email:</span>
                      <strong>${registrationData.userDetails.email}</strong>
                    </div>
                    <div class="detail-item">
                      <span>Mobile:</span>
                      <strong>+91 ${
                        registrationData.userDetails.mobile
                      }</strong>
                    </div>
                  </div>
                  
                  <div>
                    <h3>📅 Event Schedule</h3>
                    ${
                      registrationData.registrationInfo?.day1
                        ? '<div class="schedule-item"><strong>Day 1:</strong> Sep 17 - EduSkills Connect</div>'
                        : ""
                    }
                    ${
                      registrationData.registrationInfo?.day2
                        ? '<div class="schedule-item"><strong>Day 2:</strong> Sep 18 - EduSkills Connect</div>'
                        : ""
                    }
                    ${
                      registrationData.registrationInfo?.day3
                        ? '<div class="schedule-item"><strong>Day 3:</strong> Sep 19 - HR Summit</div>'
                        : ""
                    }
                  </div>
                </div>
                
                <div class="qr-section">
                  <h3>📱 Entry QR Code</h3>
                  <p style="font-size: 10px; margin-bottom: 8px;">Present at venue</p>
                  <div class="qr-container">
                    ${qrCodeSVG}
                  </div>
                  <p style="font-size: 9px; color: #6B7280; margin-top: 8px;">
                    Keep ticket safe
                  </p>
                </div>
              </div>
              
              <div class="instructions">
                <h4>⚠️ Important Instructions</h4>
                <ul>
                  <li>Present this QR code at registration desk</li>
                  <li>Carry valid government-issued photo ID</li>
                  <li>Venue details shared via WhatsApp</li>
                  <li>Support: +91 98765 43210</li>
                </ul>
              </div>
            </div>
            
            <div class="ticket-footer">
              Generated: ${new Date().toLocaleString()} • ID: ${ticketId}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(ticketHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  if (showTicket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setShowTicket(false)}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Confirmation
          </button>

          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div
              className={`bg-gradient-to-r ${config.gradient} p-6 text-white relative`}
            >
              <div className="text-center relative z-10">
                <h1 className="text-3xl font-bold mb-2">🎓 Digital Ticket</h1>
                <p className="text-lg opacity-90">EduSkills Connect 2024</p>
                <p className="text-sm opacity-75 mt-1">September 17-19, 2024</p>
              </div>
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white opacity-30 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white opacity-30 rounded-full"></div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      🎫 Ticket Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Ticket ID:
                          </span>
                          <span className="font-mono font-bold text-lg">
                            {ticketId}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold">{config.title}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-semibold">{config.subtitle}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Status:</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✅ Confirmed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      👤 Attendee Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">
                          {registrationData.userDetails.name}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold">
                          {registrationData.userDetails.email}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-semibold">
                          +91 {registrationData.userDetails.mobile}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      📅 Event Schedule
                    </h3>
                    <div className="space-y-2">
                      {registrationData.registrationInfo?.day1 && (
                        <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-blue-600 font-semibold mr-3">
                            Day 1
                          </span>
                          <span className="text-sm">
                            Sep 17 - EduSkills Connect
                          </span>
                        </div>
                      )}
                      {registrationData.registrationInfo?.day2 && (
                        <div className="flex items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-green-600 font-semibold mr-3">
                            Day 2
                          </span>
                          <span className="text-sm">
                            Sep 18 - EduSkills Connect
                          </span>
                        </div>
                      )}
                      {registrationData.registrationInfo?.day3 && (
                        <div className="flex items-center p-2 bg-purple-50 rounded-lg">
                          <span className="text-purple-600 font-semibold mr-3">
                            Day 3
                          </span>
                          <span className="text-sm">Sep 19 - HR Summit</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      📱 Scan for Entry
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Present this QR code at the venue
                    </p>
                  </div>

                  <div className="p-4 bg-white border-2 border-gray-300 rounded-xl shadow-lg">
                    <QRCode value={qrData} size={200} />
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-3">
                      Keep this ticket safe and bring it to the event
                    </p>
                    <button
                      onClick={downloadTicketPDF}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Download PDF Ticket
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  ⚠️ Important Instructions
                </h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Present this QR code at the registration desk</li>
                  <li>• Carry a valid government-issued photo ID</li>
                  <li>• Venue address will be shared via WhatsApp</li>
                  <li>• For support, contact: +91 98765 43210</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Generated on {new Date().toLocaleString()} • Ticket ID:{" "}
                {ticketId}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main completion screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              🎉 Registration Complete!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for completing your conference registration. All your
              preferences have been saved.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              What's Next?
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-center text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>
                  Confirmation sent to WhatsApp +91{" "}
                  {registrationData.userDetails.whatsapp}
                </span>
              </div>
              <div className="flex items-center text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Event kit and materials will be prepared</span>
              </div>
              <div className="flex items-center text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Venue details and schedule shared via WhatsApp</span>
              </div>
              <div className="flex items-center text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Digital ticket generated with QR code</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowTicket(true)}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              View Digital Ticket
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              New Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionComponent;
