import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import axios from "axios";

// Import your PDF files
import eightBit from "../../assets/pdfs/8 bit microcontroller Lab manual.pdf";
import sixteenBit from "../../assets/pdfs/16bitmicrocontroller.pdf";
import thritytwoBitHarmony from "../../assets/pdfs/32 bit Harmony3_Simple_Applications_Lab_Manual.pdf";
import thritytwoBitLowPower1 from "../../assets/pdfs/32 bit Low_power_SAML10_Lab_1.pdf";
import thritytwoBitLowPower2 from "../../assets/pdfs/32 bit Low_power_SAML10_Lab_2.pdf";
import { BASE_URL } from "../../services/configUrls";
import api from "../../services/api";

const PDFViewer = () => {
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Define your PDFs with imported assets
  const pdfs = [
    {
      title: "8-bit Micro-controller",
      src: eightBit,
    },
    {
      title: "16-bit Micro-controller",
      src: sixteenBit,
    },
    {
      title: "32-bit Application(Low power-Lab1)",
      src: thritytwoBitHarmony,
    },
    {
      title: "32-bit Low Power SAML10 Lab 1",
      src: thritytwoBitLowPower1,
    },
    {
      title: "32-bit Application(Low power-Lab2)",
      src: thritytwoBitLowPower2,
    },
  ];

  useEffect(() => {
    const checkInstitute = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await api.post(
          `${BASE_URL}/internship/spoc/instituteId`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Institute ID:", response.data.instituteId);

        setIsAuthorized(
          response.data.instituteId === 441 || response.data.instituteId === 63
        );
      } catch (err) {
        setError(err.message);
        console.error("Error checking institute:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkInstitute();
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.msRequestFullscreen) {
          await containerRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error("Error attempting to enable fullscreen:", error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error("Error attempting to exit fullscreen:", error);
      }
    }
  };

  // Listen for fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 flex justify-center items-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 flex justify-center items-center">
        <div className="text-lg">No COEs available for your college</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-7xl mx-auto p-4 ${
        isFullscreen ? "bg-white" : ""
      }`}
    >
      {/* Header with buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {pdfs.map((pdf, index) => (
          <button
            key={index}
            onClick={() => setCurrentPdfIndex(index)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPdfIndex === index
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            <span className="text-sm font-medium">{pdf.title}</span>
          </button>
        ))}
      </div>

      {/* PDF Title and Fullscreen Button */}
      <div className="flex items-center justify-between mb-4">
        {/* <h2 className="text-xl font-semibold text-gray-800">
          {pdfs[currentPdfIndex].title}
        </h2> */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* PDF Display */}
      <div className="w-full bg-gray-50 rounded-lg shadow-md overflow-hidden">
        <iframe
          src={`${pdfs[currentPdfIndex].src}#toolbar=0`}
          className={`w-full ${isFullscreen ? "h-screen" : "h-screen"}`}
          title={pdfs[currentPdfIndex].title}
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
