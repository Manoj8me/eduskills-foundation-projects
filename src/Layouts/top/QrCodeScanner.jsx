import React, { useState, useEffect } from "react";
import {
  Camera,
  Square,
  CheckCircle,
  XCircle,
  RotateCw,
  ExternalLink,
  Copy,
  Smartphone,
} from "lucide-react";

const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [QrReader, setQrReader] = useState(null);

  // Load react-qr-reader library dynamically
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        // Create script element for react-qr-reader
        const script = document.createElement("script");
        script.src = "https://unpkg.com/react-qr-reader@2.2.1/lib/index.js";
        script.type = "text/javascript";

        script.onload = () => {
          // The library should be available as window.QrReader or similar
          // Since it's a React component, we'll create a wrapper
          setIsLibraryLoaded(true);
        };

        script.onerror = () => {
          setError("Failed to load QR Reader library");
        };

        document.head.appendChild(script);
      } catch (err) {
        setError("Error loading QR Reader library");
      }
    };

    loadLibrary();
  }, []);

  // QR Reader Component using modern approach
  const QRReaderComponent = ({ onResult, onError, constraints }) => {
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const [stream, setStream] = useState(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
      let animationFrame;
      let jsQRWorker;

      const startCamera = async () => {
        try {
          console.log("Starting camera for mobile...");

          // Try different constraint configurations for mobile compatibility
          const constraintOptions = [
            // Option 1: Basic mobile constraints
            {
              video: {
                facingMode: constraints.video.facingMode || "environment",
                width: { ideal: 640 },
                height: { ideal: 480 },
              },
              audio: false,
            },
            // Option 2: Very basic constraints
            {
              video: {
                facingMode: constraints.video.facingMode || "environment",
              },
              audio: false,
            },
            // Option 3: Minimal constraints
            {
              video: true,
              audio: false,
            },
          ];

          let mediaStream = null;
          let lastError = null;

          // Try each constraint option until one works
          for (let i = 0; i < constraintOptions.length; i++) {
            try {
              console.log(
                `Trying constraint option ${i + 1}:`,
                constraintOptions[i]
              );
              mediaStream = await navigator.mediaDevices.getUserMedia(
                constraintOptions[i]
              );
              console.log("Camera access successful with option", i + 1);
              break;
            } catch (err) {
              console.log(`Option ${i + 1} failed:`, err);
              lastError = err;
              continue;
            }
          }

          if (!mediaStream) {
            throw (
              lastError ||
              new Error("Failed to access camera with any configuration")
            );
          }

          setStream(mediaStream);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;

            // Enhanced mobile video handling
            const playVideo = () => {
              return new Promise((resolve, reject) => {
                const video = videoRef.current;

                const onCanPlay = () => {
                  video.removeEventListener("canplay", onCanPlay);
                  video.removeEventListener("error", onError);
                  console.log("Video can play, starting...");

                  video
                    .play()
                    .then(() => {
                      console.log("Video playing successfully");
                      setIsVideoReady(true);
                      resolve();
                    })
                    .catch(reject);
                };

                const onError = (err) => {
                  video.removeEventListener("canplay", onCanPlay);
                  video.removeEventListener("error", onError);
                  reject(err);
                };

                video.addEventListener("canplay", onCanPlay);
                video.addEventListener("error", onError);

                // Set a timeout to avoid hanging
                setTimeout(() => {
                  video.removeEventListener("canplay", onCanPlay);
                  video.removeEventListener("error", onError);
                  reject(new Error("Video loading timeout"));
                }, 10000);
              });
            };

            try {
              await playVideo();
            } catch (playErr) {
              console.error("Video play error:", playErr);
              // Try direct play as fallback
              try {
                await videoRef.current.play();
                setIsVideoReady(true);
              } catch (directPlayErr) {
                throw directPlayErr;
              }
            }
          }

          // Load jsQR library
          await loadJsQR();
        } catch (err) {
          console.error("Camera start error:", err);
          onError(err);
        }
      };

      // Separate function to load jsQR
      const loadJsQR = () => {
        return new Promise((resolve, reject) => {
          if (window.jsQR) {
            resolve();
            return;
          }

          const jsQRScript = document.createElement("script");
          jsQRScript.src =
            "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
          jsQRScript.onload = () => {
            console.log("jsQR loaded successfully");
            resolve();
          };
          jsQRScript.onerror = () => {
            console.error("Failed to load jsQR");
            reject(new Error("Failed to load QR detection library"));
          };
          document.head.appendChild(jsQRScript);
        });
      };

      // Enhanced scanning with better mobile support
      const startScanning = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video || !window.jsQR) {
          console.log("Missing dependencies for scanning:", {
            canvas: !!canvas,
            video: !!video,
            jsQR: !!window.jsQR,
          });
          setTimeout(() => startScanning(), 500); // Retry after delay
          return;
        }

        const context = canvas.getContext("2d");
        let scanCount = 0;

        const scan = () => {
          try {
            if (
              video.readyState === video.HAVE_ENOUGH_DATA &&
              video.videoWidth > 0 &&
              video.videoHeight > 0
            ) {
              // Set canvas size to match video
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;

              canvas.width = videoWidth;
              canvas.height = videoHeight;

              // Draw video frame to canvas
              context.drawImage(video, 0, 0, videoWidth, videoHeight);

              // Get image data for QR detection
              const imageData = context.getImageData(
                0,
                0,
                videoWidth,
                videoHeight
              );

              // Attempt QR code detection
              const code = window.jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                {
                  inversionAttempts: "dontInvert",
                }
              );

              if (code && code.data) {
                console.log("QR Code detected:", code.data);
                onResult(code.data, null);
                return; // Stop scanning after successful detection
              }

              scanCount++;
              if (scanCount % 30 === 0) {
                // Log every 30 frames
                console.log(
                  `Scanning frame ${scanCount}, video dimensions: ${videoWidth}x${videoHeight}`
                );
              }
            } else {
              console.log("Video not ready:", {
                readyState: video.readyState,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
              });
            }
          } catch (scanError) {
            console.error("Scan error:", scanError);
          }

          // Continue scanning
          animationFrame = requestAnimationFrame(scan);
        };

        console.log("Starting scan loop");
        animationFrame = requestAnimationFrame(scan);
      };

      // Start camera and handle video ready state
      const initializeCamera = async () => {
        await startCamera();

        // Wait for video to be ready before starting scan
        const checkVideoReady = () => {
          if (isVideoReady && window.jsQR) {
            console.log("Video ready and jsQR loaded, starting scanning");
            startScanning();
          } else {
            setTimeout(checkVideoReady, 100);
          }
        };

        checkVideoReady();
      };

      initializeCamera();

      // Cleanup function
      return () => {
        console.log("Cleaning up camera and resources");
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        if (stream) {
          stream.getTracks().forEach((track) => {
            console.log("Stopping track:", track.label, track.kind);
            track.stop();
          });
        }
        setIsVideoReady(false);
      };
    }, [constraints, onResult, onError]); // Removed isVideoReady dependency to prevent loops

    return (
      <div className="relative w-full h-80 bg-black rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
          webkit-playsinline="true"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Scanning Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="border-2 border-blue-400 rounded-2xl w-56 h-56 relative">
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-2xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-2xl"></div>

              {/* Scanning Line Animation */}
              <div className="absolute inset-4 overflow-hidden rounded-2xl">
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse opacity-75"></div>
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-50"
                  style={{
                    top: "30%",
                    animationDelay: "0.3s",
                    animationDuration: "1.5s",
                  }}
                ></div>
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse opacity-60"
                  style={{
                    top: "60%",
                    animationDelay: "0.6s",
                    animationDuration: "2s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle QR scan result
  const handleScan = (data) => {
    if (data) {
      setScannedData(data);
      setIsScanning(false);
    }
  };

  // Handle scan error with comprehensive mobile error handling
  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    console.error("Error details:", {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    });

    let errorMessage = "Camera access failed. ";

    if (
      err?.name === "NotAllowedError" ||
      err?.message?.includes("Permission denied") ||
      err?.message?.includes("permission")
    ) {
      errorMessage +=
        "Please allow camera access when prompted by your browser.";
    } else if (
      err?.name === "NotFoundError" ||
      err?.message?.includes("not found")
    ) {
      errorMessage += "No camera found on this device.";
    } else if (
      err?.name === "NotSupportedError" ||
      err?.message?.includes("not supported")
    ) {
      errorMessage +=
        "Camera not supported. Please use Chrome or Safari browser.";
    } else if (
      err?.name === "NotReadableError" ||
      err?.message?.includes("not readable")
    ) {
      errorMessage +=
        "Camera is being used by another app. Please close other camera apps and try again.";
    } else if (
      err?.name === "OverconstrainedError" ||
      err?.message?.includes("constraint")
    ) {
      errorMessage +=
        "Camera settings not supported. Trying again with basic settings...";
      // Automatically retry with basic constraints
      setTimeout(() => {
        setError("");
        setIsScanning(true);
      }, 2000);
      return;
    } else if (
      err?.message?.includes("secure") ||
      err?.message?.includes("https")
    ) {
      errorMessage += "Camera requires secure connection (HTTPS).";
    } else if (err?.message?.includes("timeout")) {
      errorMessage += "Camera loading timed out. Please try again.";
    } else {
      errorMessage +=
        "Please make sure you have a working camera and try again.";
    }

    setError(errorMessage);
    setIsScanning(false);
  };

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Check camera permissions with mobile handling
  const checkCameraPermissions = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // On mobile, we often can't check permissions without requesting
      if (isMobile()) {
        console.log("Mobile device detected");
        return "mobile";
      }

      // Check if permissions API is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "camera",
        });
        return permission.state;
      }

      return "unknown";
    } catch (err) {
      console.error("Permission check failed:", err);
      return "unknown";
    }
  };

  // Start scanning with mobile-optimized permission handling
  const startScanning = async () => {
    setError("");
    setScannedData("");

    console.log("Starting camera...");

    // For mobile, just try to start directly
    if (isMobile()) {
      console.log("Mobile - requesting camera directly");
      setIsScanning(true);
      return;
    }

    // Check permissions first on desktop
    const permissionState = await checkCameraPermissions();

    if (permissionState === "denied") {
      setError(
        "Camera access is blocked. Please enable camera permissions in your browser settings and refresh the page."
      );
      return;
    }

    console.log("Permission state:", permissionState);
    setIsScanning(true);
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
  };

  // Toggle camera (front/back)
  const toggleCamera = () => {
    const newFacingMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacingMode);

    if (isScanning) {
      setIsScanning(false);
      setTimeout(() => {
        setIsScanning(true);
      }, 500);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedData);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setScannedData("");
    setError("");
    setCopySuccess(false);
    setIsScanning(false);
  };

  // Check if string is URL
  const isUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return str.startsWith("http://") || str.startsWith("https://");
    }
  };

  // Demo function
  const runDemo = () => {
    setScannedData("https://github.com/react-qr-reader-demo");
    setTimeout(() => {
      setScannedData(
        "Demo QR Code: Welcome to React QR Reader! This is a sample text from a QR code."
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Square className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            QR Scanner
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Advanced QR code scanner powered by React QR Reader
          </p>
        </div>

        {/* Main Interface */}
        <div className="max-w-lg mx-auto">
          {/* Welcome Screen */}
          {!isScanning && !scannedData && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/20 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <Camera className="w-16 h-16 text-blue-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Scan
              </h2>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                Position your camera over any QR code for instant detection and
                decoding
              </p>

              <div className="space-y-4">
                <button
                  onClick={startScanning}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 w-full shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <Camera className="w-6 h-6 inline mr-3" />
                  Allow Camera Access
                </button>

                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 text-center backdrop-blur-sm">
                  <p className="text-blue-200 text-sm mb-2">
                    <strong>Need Help?</strong>
                  </p>
                  <p className="text-blue-300 text-xs leading-relaxed">
                    Your browser will ask for camera permission. Click "Allow"
                    to start scanning QR codes.
                  </p>
                </div>

                <button
                  onClick={runDemo}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 w-full backdrop-blur-sm"
                >
                  <Smartphone className="w-5 h-5 inline mr-2" />
                  Try Demo Mode
                </button>
              </div>
            </div>
          )}

          {/* Scanner Interface */}
          {isScanning && (
            <div className="space-y-6">
              <div className="relative">
                <QRReaderComponent
                  onResult={handleScan}
                  onError={handleError}
                  constraints={{
                    video: {
                      facingMode: facingMode,
                      width: { ideal: 1280, max: 1920, min: 640 },
                      height: { ideal: 720, max: 1080, min: 480 },
                      aspectRatio: { ideal: 16 / 9 },
                    },
                    audio: false,
                  }}
                />

                {/* Control Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <button
                    onClick={toggleCamera}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-4 rounded-full transition-all duration-200 border border-white/30 shadow-lg"
                    title={`Switch to ${
                      facingMode === "environment" ? "front" : "back"
                    } camera`}
                  >
                    <RotateCw className="w-6 h-6 text-white" />
                  </button>

                  <div className="text-center bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                    <div className="text-white text-sm font-bold mb-1">
                      Scanning Active
                    </div>
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={stopScanning}
                    className="bg-red-500/80 backdrop-blur-md hover:bg-red-600/90 px-6 py-4 rounded-full font-bold text-white transition-all duration-200 border border-red-400/50 shadow-lg"
                  >
                    Stop
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-300 text-lg">
                  Position the QR code within the scanning area
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Using {facingMode === "environment" ? "back" : "front"} camera
                </p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {scannedData && (
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-10 border border-green-400/30 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-500 rounded-full p-3 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Success!</h2>
                  <p className="text-green-200">QR code detected and decoded</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 mb-8 border border-white/20 backdrop-blur-sm">
                <p className="text-sm text-gray-300 mb-3 font-semibold uppercase tracking-wide">
                  Scanned Content
                </p>
                <div className="bg-black/30 rounded-xl p-4 max-h-40 overflow-y-auto border border-white/10">
                  <p className="text-white break-all font-mono text-base leading-relaxed">
                    {scannedData}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {isUrl(scannedData) && (
                  <a
                    href={scannedData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 w-full shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <ExternalLink className="w-6 h-6" />
                    Open Link
                  </a>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                      copySuccess
                        ? "bg-green-600 text-white border-green-500"
                        : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-sm"
                    }`}
                  >
                    <Copy className="w-5 h-5" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={resetScanner}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-10 border border-red-400/30 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-500 rounded-full p-3 shadow-lg">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Camera Access Required
                  </h2>
                  <p className="text-red-200">
                    Permission needed to scan QR codes
                  </p>
                </div>
              </div>
              <div className="bg-red-900/20 rounded-xl p-4 mb-8 border border-red-400/20">
                <p className="text-red-200 leading-relaxed mb-4">{error}</p>

                {error.includes("Permission denied") ||
                error.includes("blocked") ? (
                  <div className="space-y-3 text-sm">
                    <p className="text-red-100 font-semibold">
                      To enable camera access:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-red-200 ml-4">
                      <li>
                        Look for the camera icon in your browser's address bar
                      </li>
                      <li>Click it and select "Allow" for camera access</li>
                      <li>If no icon appears, check your browser settings</li>
                      <li>Refresh this page after granting permission</li>
                    </ol>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <button
                  onClick={resetScanner}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 w-full shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Try Again
                </button>

                <button
                  onClick={runDemo}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full backdrop-blur-sm"
                >
                  Use Demo Mode Instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        {!isScanning && !scannedData && !error && (
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Camera className="w-10 h-10 text-blue-400" />,
                title: "Lightning Fast",
                description:
                  "Instant QR code detection with optimized scanning algorithms",
              },
              {
                icon: <RotateCw className="w-10 h-10 text-green-400" />,
                title: "Dual Camera",
                description: "Seamlessly switch between front and back cameras",
              },
              {
                icon: <ExternalLink className="w-10 h-10 text-purple-400" />,
                title: "Smart Actions",
                description:
                  "Automatically handles URLs, text, and various QR formats",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-lg hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="font-bold text-white mb-3 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
