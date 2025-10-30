import ticketImageSrc from "../../../assets/imgs/2300 x 1202 px_300 Res.png";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, User, Camera, Loader } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

const ConferenceTicketGenerator = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", institute_name: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const baseImageRef = useRef(null);
  const profileImageRef = useRef(null);

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `${BASE_URL}/internship/connect-info`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const { name, institute_name, image } = response.data;
        setUserInfo({ name, institute_name });

        if (image) {
          setProfileImage(image);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          `${BASE_URL}/internship/upload-connect-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // If upload successful, read the file locally for display
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        setIsUploading(false);
      }
    }
  }, []);

  const resizeImage = (img, maxWidth, maxHeight) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let { width, height } = img;

    // Calculate new dimensions maintaining aspect ratio
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  };

  const drawCircularImage = (ctx, img, x, y, radius) => {
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Calculate dimensions to cover the circle while maintaining aspect ratio
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight;

    if (imgAspect > 1) {
      // Image is wider than tall
      drawHeight = radius * 2;
      drawWidth = drawHeight * imgAspect;
    } else {
      // Image is taller than wide
      drawWidth = radius * 2;
      drawHeight = drawWidth / imgAspect;
    }

    // Center the image in the circle
    const drawX = x - drawWidth / 2;
    const drawY = y - drawHeight / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Draw border
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 12;
    ctx.stroke();
  };

  // Function to wrap text properly without changing font size
  const drawWrappedText = (ctx, text, centerX, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && currentLine !== "") {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine !== "") {
      lines.push(currentLine);
    }

    // Draw all lines
    let currentY = y;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], centerX, currentY);
      currentY += lineHeight;
    }

    return currentY - lineHeight; // Return the Y position of the last line
  };

  // Function specifically for name with 5-word break rule
  const drawNameText = (ctx, text, centerX, y, maxWidth, lineHeight) => {
    const words = text.split(" ");

    // If 5 words or less, draw as single line
    if (words.length <= 5) {
      ctx.fillText(text, centerX, y);
      return y;
    }

    // If more than 5 words, break after 5th word
    const firstLine = words.slice(0, 5).join(" ");
    const secondLine = words.slice(5).join(" ");

    ctx.fillText(firstLine, centerX, y);
    ctx.fillText(secondLine, centerX, y + lineHeight);

    return y + lineHeight;
  };

  // Function specifically for institute name with proper wrapping
  const drawInstituteText = (ctx, text, centerX, y, maxWidth, lineHeight) => {
    return drawWrappedText(ctx, text, centerX, y, maxWidth, lineHeight);
  };

  const generateTicket = useCallback(() => {
    const canvas = canvasRef.current;
    const baseImg = baseImageRef.current;

    if (!canvas || !baseImg || !baseImg.complete) return;

    const ctx = canvas.getContext("2d");

    // Set canvas to fixed dimensions for consistent output
    const targetWidth = 2300;
    const targetHeight = 1202;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw base ticket image
    ctx.drawImage(baseImg, 0, 0, targetWidth, targetHeight);

    // Profile image position and size
    const profileCenterX = targetWidth * 0.8; // Right side
    const profileCenterY = targetHeight * 0.38; // Upper area
    const profileRadius = targetWidth * 0.11; // Profile radius

    if (profileImage && profileImageRef.current) {
      drawCircularImage(
        ctx,
        profileImageRef.current,
        profileCenterX,
        profileCenterY,
        profileRadius
      );
    }

    // Calculate text area boundaries - increased max width for better text fitting
    const textCenterX = profileCenterX;
    const textY = profileCenterY + profileRadius + 30; // Moved up from 60 to 30
    const maxTextWidth = targetWidth * 0.35; // Increased to 35% for more room

    // Name - original font size with 5-word break rule
    ctx.font = `bold ${targetWidth * 0.022}px Poppins`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const nameLineHeight = targetWidth * 0.025;
    const nameY = drawNameText(
      ctx,
      userInfo.name || "Dr Ramarao Khaaliudin Shah",
      textCenterX,
      textY,
      maxTextWidth,
      nameLineHeight
    );

    // Institution - original font size with proper text wrapping
    ctx.font = `${targetWidth * 0.02}px Poppins`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const institution =
      userInfo.institute_name || "Nainantal Prathamavati Simerabti University";
    const institutionLineHeight = targetWidth * 0.024;

    drawInstituteText(
      ctx,
      institution,
      textCenterX,
      nameY + 80,
      maxTextWidth,
      institutionLineHeight
    );
  }, [profileImage, userInfo]);

  const downloadTicket = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    generateTicket();

    // Small delay to ensure canvas is updated
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = `conference_ticket_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  }, [generateTicket]);

  // Load profile image when it changes
  useEffect(() => {
    if (profileImage) {
      const img = new Image();
      img.onload = () => {
        profileImageRef.current = img;
        generateTicket();
      };
      img.onerror = () => {
        console.error("Failed to load profile image");
      };
      // Handle both local file URLs and remote URLs
      if (typeof profileImage === "string" && profileImage.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.src = profileImage;
    }
  }, [profileImage, generateTicket]);

  // Generate ticket when base image loads
  useEffect(() => {
    const baseImg = baseImageRef.current;
    if (baseImg && baseImg.complete && !isLoading) {
      generateTicket();
    }
  }, [generateTicket, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Ticket Preview */}
          <div className="relative">
            <div className="w-full overflow-hidden bg-gray-100">
              <canvas
                ref={canvasRef}
                className="w-full h-auto max-h-96 md:max-h-none object-contain"
                style={{ aspectRatio: "2300/1202" }}
              />
            </div>

            {/* Upload Overlay - adjusted for smaller image */}
            <div
              className="absolute cursor-pointer group"
              style={{
                right: "12%",
                top: "18%",
                width: "20%",
                height: "20%",
                aspectRatio: "1/1",
              }}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {!profileImage ? (
                <div className="w-full h-full rounded-full border-4 border-dashed border-white bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all duration-300">
                  <div className="text-white text-center">
                    {isUploading ? (
                      <Loader className="w-6 h-6 md:w-12 md:h-12 mx-auto mb-2 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 md:w-12 md:h-12 mx-auto mb-2" />
                    )}
                    <p className="text-xs md:text-sm font-medium">
                      {isUploading ? "Uploading..." : "Add Photo"}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isUploading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                {isUploading
                  ? "Uploading..."
                  : profileImage
                  ? "Change Photo"
                  : "Upload Photo"}
              </button>

              <button
                onClick={downloadTicket}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>

            {profileImage && !isUploading && (
              <div className="text-center">
                <button
                  onClick={() => setProfileImage(null)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">
            Upload your photo to generate a personalized conference ticket
          </p>
          <p className="text-sm">
            Recommended: Square images (1:1 ratio) for best results
          </p>
        </div>

        {/* Hidden Elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <img
          ref={baseImageRef}
          src={ticketImageSrc}
          alt="Base ticket"
          className="hidden"
          onLoad={generateTicket}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

export default ConferenceTicketGenerator;
