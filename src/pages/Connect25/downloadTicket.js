// downloadTicket.js - Utility function for downloading tickets

export const downloadTicket = async (registrationInfo) => {
  try {
    // Create a new window with the ticket content
    const printWindow = window.open("", "_blank");

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Conference Ticket - ${registrationInfo.name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
          }
          .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 2px solid #e5e7eb;
          }
          .ticket-header {
            background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
            color: white;
            padding: 40px;
            position: relative;
          }
          .ticket-header::before {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
          }
          .ticket-header::after {
            content: '';
            position: absolute;
            bottom: -32px;
            left: -32px;
            width: 64px;
            height: 64px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
          }
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ticket-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .ticket-subtitle {
            color: #bfdbfe;
            font-size: 16px;
          }
          .ticket-icon {
            font-size: 48px;
          }
          .perforated-line {
            height: 32px;
            background: #f9fafb;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .perforated-line::before {
            content: '';
            position: absolute;
            left: -8px;
            width: 16px;
            height: 32px;
            background: #f3f4f6;
            border-radius: 0 16px 16px 0;
          }
          .perforated-line::after {
            content: '';
            position: absolute;
            right: -8px;
            width: 16px;
            height: 32px;
            background: #f3f4f6;
            border-radius: 16px 0 0 16px;
          }
          .dots {
            display: flex;
            gap: 8px;
          }
          .dot {
            width: 8px;
            height: 8px;
            background: #d1d5db;
            border-radius: 50%;
          }
          .ticket-body {
            padding: 40px;
            background: linear-gradient(135deg, #f9fafb 0%, white 100%);
          }
          .ticket-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 40px;
          }
          .ticket-details {
            flex: 1;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px 24px;
          }
          .detail-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .detail-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .detail-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 500;
          }
          .registration-id {
            font-weight: bold;
            font-size: 18px;
            color: #2563eb;
          }
          .status-badges {
            display: flex;
            gap: 12px;
            margin-top: 24px;
          }
          .status-badge {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .status-registered {
            background: #dcfce7;
            color: #166534;
          }
          .status-paid {
            background: #dbeafe;
            color: #1e40af;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
          .status-dot.green { background: #10b981; }
          .status-dot.blue { background: #3b82f6; }
          .qr-section {
            text-align: center;
          }
          .qr-container {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 16px;
            margin-bottom: 8px;
          }
          .qr-code {
            width: 120px;
            height: 120px;
          }
          .qr-text {
            font-size: 12px;
            color: #6b7280;
          }
          .ticket-footer {
            background: #f3f4f6;
            padding: 20px 40px;
            text-align: center;
            border-top: 2px dashed #d1d5db;
          }
          .footer-text {
            font-size: 14px;
            color: #6b7280;
          }
          @media print {
            body { background: white; padding: 0; }
            .ticket-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="ticket-header">
            <div class="header-content">
              <div>
               
              </div>
              <div class="ticket-icon">🎫</div>
            </div>
          </div>
          
          <div class="perforated-line">
            <div class="dots">
              ${Array(20).fill('<div class="dot"></div>').join("")}
            </div>
          </div>
          
          <div class="ticket-body">
            <div class="ticket-content">
              <div class="ticket-details">
                <div class="details-grid">
                  <div class="detail-field">
                    <span class="detail-label">Registration ID</span>
                    <span class="detail-value registration-id">${
                      registrationInfo.registration_id || "N/A"
                    }</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-label">Attendee Name</span>
                    <span class="detail-value">${
                      registrationInfo.name || "N/A"
                    }</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-label">Email Address</span>
                    <span class="detail-value">${
                      registrationInfo.email || "N/A"
                    }</span>
                  </div>
                  <div class="detail-field">
                    <span class="detail-label">Venue</span>
                    <span class="detail-value">${
                      registrationInfo.venue || "To be announced"
                    }</span>
                  </div>
                  ${
                    registrationInfo.mobile_number
                      ? `
                  <div class="detail-field">
                    <span class="detail-label">Contact Number</span>
                    <span class="detail-value">${registrationInfo.mobile_number}</span>
                  </div>
                  `
                      : ""
                  }
                </div>
                
                <div class="status-badges">
                  <div class="status-badge status-registered">
                    <span class="status-dot green"></span>
                    Registered
                  </div>
                  
                </div>
              </div>
              
              <div class="qr-section">
                <div class="qr-container">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                    `Registration ID: ${
                      registrationInfo.registration_id || "N/A"
                    }\nName: ${registrationInfo.name || "N/A"}\nEmail: ${
                      registrationInfo.email || "N/A"
                    }`
                  )}" alt="QR Code" class="qr-code">
                </div>
                <div class="qr-text">Scan for verification</div>
              </div>
            </div>
          </div>
          
         
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(ticketHTML);
    printWindow.document.close();

    // Wait for images to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  } catch (error) {
    console.error("Error downloading ticket:", error);
    alert("Unable to download ticket. Please try again.");
  }
};
