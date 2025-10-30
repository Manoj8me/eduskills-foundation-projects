// ImageUpload.js - Complete Updated Component
import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

// Portal Component for rendering modals at document.body level
const Portal = ({ children }) => {
  return createPortal(children, document.body);
};

// Compact Image Cropper Component using HTML5 Canvas
const ImageCropper = ({ src, onCrop, onCancel }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    const img = imageRef.current;
    const container = canvasRef.current;

    if (img && container) {
      // Get the actual displayed dimensions of the image
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Calculate the image's actual display size within the container
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Calculate the crop size based on the smaller dimension (smaller for compact view)
      const minDimension = Math.min(containerWidth, containerHeight);
      const cropSize = Math.min(150, minDimension * 0.45); // Smaller crop area

      // Center the crop area
      setCropData({
        x: (containerWidth - cropSize) / 2,
        y: (containerHeight - cropSize) / 2,
        width: cropSize,
        height: cropSize,
      });
    }
  };

  const getMousePos = (e, container) => {
    const rect = container.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const container = canvasRef.current;
    if (!container) return;

    const mousePos = getMousePos(e, container);
    const { x, y, width, height } = cropData;

    // Check if clicking on resize handle (bottom-right corner)
    const handleSize = 8;
    if (
      mousePos.x >= x + width - handleSize &&
      mousePos.x <= x + width + handleSize &&
      mousePos.y >= y + height - handleSize &&
      mousePos.y <= y + height + handleSize
    ) {
      setIsResizing(true);
      setDragStart({ x: mousePos.x, y: mousePos.y });
      return;
    }

    // Check if clicking inside crop area for dragging
    if (
      mousePos.x >= x &&
      mousePos.x <= x + width &&
      mousePos.y >= y &&
      mousePos.y <= y + height
    ) {
      setIsDragging(true);
      setDragStart({
        x: mousePos.x - x,
        y: mousePos.y - y,
      });
    }
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    const container = canvasRef.current;
    if (!container || (!isDragging && !isResizing)) return;

    const mousePos = getMousePos(e, container);
    const containerRect = container.getBoundingClientRect();

    if (isResizing) {
      const newWidth = Math.max(50, mousePos.x - cropData.x);
      const newHeight = newWidth; // Keep it square

      // Ensure resize doesn't go outside container bounds
      const maxWidth = containerRect.width - cropData.x;
      const maxHeight = containerRect.height - cropData.y;
      const finalSize = Math.min(newWidth, maxWidth, maxHeight);

      setCropData((prev) => ({
        ...prev,
        width: finalSize,
        height: finalSize,
      }));
    } else if (isDragging) {
      const newX = mousePos.x - dragStart.x;
      const newY = mousePos.y - dragStart.y;

      // Constrain to container bounds
      const maxX = containerRect.width - cropData.width;
      const maxY = containerRect.height - cropData.height;

      setCropData((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(maxX, newX)),
        y: Math.max(0, Math.min(maxY, newY)),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleCrop = useCallback(() => {
    const img = imageRef.current;
    const container = canvasRef.current;

    if (!img || !container) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set output size
    const outputSize = 300;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Get the actual image dimensions and container dimensions
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Calculate the scale factors based on the actual displayed image size
    const displayWidth = imgRect.width;
    const displayHeight = imgRect.height;
    const scaleX = img.naturalWidth / displayWidth;
    const scaleY = img.naturalHeight / displayHeight;

    // Calculate the offset of the image within the container
    const offsetX = (containerRect.width - displayWidth) / 2;
    const offsetY = (containerRect.height - displayHeight) / 2;

    // Adjust crop coordinates relative to the actual image position
    const adjustedX = (cropData.x - offsetX) * scaleX;
    const adjustedY = (cropData.y - offsetY) * scaleY;
    const adjustedWidth = cropData.width * scaleX;
    const adjustedHeight = cropData.height * scaleY;

    // Ensure crop coordinates are within image bounds
    const finalX = Math.max(
      0,
      Math.min(adjustedX, img.naturalWidth - adjustedWidth)
    );
    const finalY = Math.max(
      0,
      Math.min(adjustedY, img.naturalHeight - adjustedHeight)
    );
    const finalWidth = Math.min(adjustedWidth, img.naturalWidth - finalX);
    const finalHeight = Math.min(adjustedHeight, img.naturalHeight - finalY);

    // Draw cropped image
    ctx.drawImage(
      img,
      finalX,
      finalY,
      finalWidth,
      finalHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  }, [cropData, onCrop]);

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
        style={{ zIndex: 99999999 }}
      >
        <div
          className="bg-white rounded-xl p-4 max-w-md w-full max-h-[85vh] overflow-auto relative"
          style={{ zIndex: 99999999 }}
        >
          <h3 className="text-lg font-bold mb-2 text-center">Crop Image</h3>

          <div className="mb-3 text-xs text-gray-600 text-center">
            Drag to position • Drag corner to resize
          </div>

          <div
            ref={canvasRef}
            className="relative mx-auto bg-gray-50 rounded-lg overflow-hidden cursor-crosshair select-none flex items-center justify-center"
            style={{ width: "350px", height: "280px" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={src}
              alt="Crop preview"
              className="w-full h-full object-cover"
              style={{
                objectFit: "contain",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
              }}
              onLoad={handleImageLoad}
              draggable={false}
            />

            {imageLoaded && (
              <>
                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 
                      0% 100%, 
                      ${cropData.x}px 100%, 
                      ${cropData.x}px ${cropData.y}px, 
                      ${cropData.x + cropData.width}px ${cropData.y}px, 
                      ${cropData.x + cropData.width}px ${
                      cropData.y + cropData.height
                    }px, 
                      ${cropData.x}px ${cropData.y + cropData.height}px, 
                      ${cropData.x}px 100%, 
                      100% 100%, 
                      100% 0%
                    )`,
                  }}
                />

                {/* Crop selection box */}
                <div
                  className="absolute border-3 border-blue-500 shadow-lg rounded-full"
                  style={{
                    left: `${cropData.x}px`,
                    top: `${cropData.y}px`,
                    width: `${cropData.width}px`,
                    height: `${cropData.height}px`,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                >
                  {/* Grid lines - circular guides */}
                  <div className="absolute inset-0 pointer-events-none rounded-full">
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-300 opacity-60"></div>
                    <div className="absolute right-1/3 top-0 bottom-0 w-px bg-blue-300 opacity-60"></div>
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-300 opacity-60"></div>
                    <div className="absolute bottom-1/3 left-0 right-0 h-px bg-blue-300 opacity-60"></div>
                  </div>

                  {/* Resize handle - smaller for compact view */}
                  <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nw-resize shadow-md"
                    style={{ cursor: "nw-resize" }}
                  ></div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={!imageLoaded}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

// Image Upload Component
const ImageUploadComponent = ({ onImageSelect, currentImage, hasError }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImageSrc(event.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedBlob) => {
    onImageSelect(croppedBlob);
    setShowCropper(false);
    setSelectedImageSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setShowCropper(false);
    setSelectedImageSrc("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div
            className={`w-32 h-32 bg-gray-100 rounded-full border-2 border-dashed ${
              hasError ? "border-red-300" : "border-gray-300"
            } flex items-center justify-center overflow-hidden`}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="text-4xl text-gray-400">📷</span>
                <p className="text-xs text-gray-400 mt-2">No Image</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture <span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload an image (JPG, PNG, etc. - Max 5MB). You can crop it to fit
            perfectly.
          </p>
          {hasError && (
            <p className="text-red-500 text-xs mt-1">
              Profile picture is required
            </p>
          )}
        </div>
      </div>

      {showCropper && (
        <ImageCropper
          src={selectedImageSrc}
          onCrop={handleCrop}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ImageUploadComponent;
