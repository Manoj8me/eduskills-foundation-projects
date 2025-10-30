import React, { useState, useRef, useEffect } from "react";
import {
  Move,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  Palette,
  Layers,
  Grid,
  Minus,
  Plus,
  RotateCcw,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  PenTool,
  Settings,
  Hexagon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Hash,
} from "lucide-react";

// Main Figma-style Editor Component
const FigmaStyleEditor = () => {
  const [activeTab, setActiveTab] = useState("design");
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(100);
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasObjects, setCanvasObjects] = useState([
    {
      id: 1,
      type: "rect",
      x: 100,
      y: 100,
      width: 200,
      height: 120,
      fill: "#E9F3FF",
      stroke: "#AECBFA",
      rotation: 0,
    },
    {
      id: 2,
      type: "circle",
      x: 400,
      y: 150,
      radius: 60,
      fill: "#FFEBEE",
      stroke: "#FFCDD2",
      rotation: 0,
    },
    {
      id: 3,
      type: "text",
      x: 150,
      y: 280,
      text: "Figma-style Editor",
      fill: "#333333",
      fontSize: 18,
      rotation: 0,
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
    },
  ]);

  const canvasRef = useRef(null);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isLayersPanelOpen, setIsLayersPanelOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [copiedElement, setCopiedElement] = useState(null);

  // Add to history when canvas objects change
  useEffect(() => {
    if (canvasObjects.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...canvasObjects]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, []);

  // Handle undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasObjects([...history[historyIndex - 1]]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasObjects([...history[historyIndex + 1]]);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z for Undo
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl+Shift+Z or Ctrl+Y for Redo
      else if (
        (e.ctrlKey && e.shiftKey && e.key === "z") ||
        (e.ctrlKey && e.key === "y")
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete selected element
      else if (e.key === "Delete" && selectedElement) {
        e.preventDefault();
        handleDeleteElement();
      }
      // Copy selected element (Ctrl+C)
      else if (e.ctrlKey && e.key === "c" && selectedElement) {
        e.preventDefault();
        setCopiedElement({ ...selectedElement });
      }
      // Paste copied element (Ctrl+V)
      else if (e.ctrlKey && e.key === "v" && copiedElement) {
        e.preventDefault();
        const newId = Math.max(...canvasObjects.map((obj) => obj.id)) + 1;
        const newElement = {
          ...copiedElement,
          id: newId,
          x: copiedElement.x + 20,
          y: copiedElement.y + 20,
        };
        setCanvasObjects([...canvasObjects, newElement]);
        setSelectedElement(newElement);
      }
      // Tool shortcuts
      else if (e.key === "v" || e.key === "V") {
        setActiveTool("select");
      } else if (e.key === "h" || e.key === "H") {
        setActiveTool("move");
      } else if (e.key === "r" || e.key === "R") {
        setActiveTool("rect");
      } else if (e.key === "o" || e.key === "O") {
        setActiveTool("circle");
      } else if (e.key === "t" || e.key === "T") {
        setActiveTool("text");
      } else if (e.key === "p" || e.key === "P") {
        setActiveTool("pen");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement, copiedElement, historyIndex, history, canvasObjects]);

  // Handle tool selection
  const handleToolSelect = (tool) => {
    setActiveTool(tool);
  };

  // Handle zoom in/out
  const handleZoom = (action) => {
    if (action === "in" && zoom < 200) {
      setZoom(zoom + 10);
    } else if (action === "out" && zoom > 20) {
      setZoom(zoom - 10);
    } else if (action === "reset") {
      setZoom(100);
    }
  };

  // Check if a point is inside an element
  const isPointInElement = (x, y, element) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaleFactorX = 1920 / canvasRect.width;
    const scaleFactorY = 1080 / canvasRect.height;

    // Adjust for zoom
    const zoomFactor = zoom / 100;
    const adjustedX = (x * scaleFactorX) / zoomFactor;
    const adjustedY = (y * scaleFactorY) / zoomFactor;

    switch (element.type) {
      case "rect":
        return (
          adjustedX >= element.x &&
          adjustedX <= element.x + element.width &&
          adjustedY >= element.y &&
          adjustedY <= element.y + element.height
        );
      case "circle":
        const dx = adjustedX - element.x;
        const dy = adjustedY - element.y;
        return Math.sqrt(dx * dx + dy * dy) <= element.radius;
      case "text":
        // A simple bounding box for text (can be improved)
        const textWidth = element.text.length * (element.fontSize * 0.6);
        const textHeight = element.fontSize * 1.2;
        return (
          adjustedX >= element.x &&
          adjustedX <= element.x + textWidth &&
          adjustedY >= element.y - element.fontSize &&
          adjustedY <= element.y + textHeight - element.fontSize
        );
      default:
        return false;
    }
  };

  // Handle mouse down on canvas - start dragging or select element
  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    // First check if we clicked on an element
    for (let i = canvasObjects.length - 1; i >= 0; i--) {
      const obj = canvasObjects[i];
      if (isPointInElement(x, y, obj)) {
        setSelectedElement(obj);

        if (activeTool === "select" || activeTool === "move") {
          setIsDragging(true);
          setDragOffset({
            x: x - ((obj.x * canvasRect.width) / 1920) * (zoom / 100),
            y: y - ((obj.y * canvasRect.height) / 1080) * (zoom / 100),
          });
        }
        return;
      }
    }

    // If we didn't click on any element
    setSelectedElement(null);

    // Handle clicking on empty canvas to add new element
    if (activeTool !== "select" && activeTool !== "move") {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scaleFactorX = 1920 / canvasRect.width;
      const scaleFactorY = 1080 / canvasRect.height;

      // Adjust for zoom
      const zoomFactor = zoom / 100;
      const canvasX = (x * scaleFactorX) / zoomFactor;
      const canvasY = (y * scaleFactorY) / zoomFactor;

      createNewElement(activeTool, canvasX, canvasY);
    }
  };

  // Handle mouse move on canvas - update position if dragging
  const handleMouseMove = (e) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const scaleFactorX = 1920 / canvasRect.width;
    const scaleFactorY = 1080 / canvasRect.height;

    // Adjust for zoom
    const zoomFactor = zoom / 100;
    const newX = ((x - dragOffset.x) * scaleFactorX) / zoomFactor;
    const newY = ((y - dragOffset.y) * scaleFactorY) / zoomFactor;

    // Apply snapping if enabled
    let snappedX = newX;
    let snappedY = newY;

    if (snapToGrid) {
      snappedX = Math.round(newX / gridSize) * gridSize;
      snappedY = Math.round(newY / gridSize) * gridSize;
    }

    // Update the element's position
    const updatedObjects = canvasObjects.map((obj) => {
      if (obj.id === selectedElement.id) {
        return { ...obj, x: snappedX, y: snappedY };
      }
      return obj;
    });

    setCanvasObjects(updatedObjects);
    setSelectedElement({ ...selectedElement, x: snappedX, y: snappedY });
  };

  // Handle mouse up on canvas - stop dragging
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...canvasObjects]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // Create a new element at the specified position
  const createNewElement = (type, x, y) => {
    const newId =
      canvasObjects.length > 0
        ? Math.max(...canvasObjects.map((obj) => obj.id)) + 1
        : 1;

    let newElement;

    switch (type) {
      case "rect":
        newElement = {
          id: newId,
          type: "rect",
          x: x,
          y: y,
          width: 150,
          height: 100,
          fill: "#EEEEEE",
          stroke: "#CCCCCC",
          rotation: 0,
        };
        break;
      case "circle":
        newElement = {
          id: newId,
          type: "circle",
          x: x,
          y: y,
          radius: 50,
          fill: "#E8F5E9",
          stroke: "#C8E6C9",
          rotation: 0,
        };
        break;
      case "text":
        newElement = {
          id: newId,
          type: "text",
          x: x,
          y: y,
          text: "New Text",
          fill: "#333333",
          fontSize: 16,
          rotation: 0,
          fontWeight: "normal",
          fontStyle: "normal",
          textDecoration: "none",
          textAlign: "left",
        };
        break;
      default:
        return;
    }

    // Add the new element to canvas objects and update history
    const updatedObjects = [...canvasObjects, newElement];
    setCanvasObjects(updatedObjects);
    setSelectedElement(newElement);

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedObjects);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Add new element to canvas
  const addNewElement = (type) => {
    // Place the element in the center of the visible canvas
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const centerX = 1920 / 2;
      const centerY = 1080 / 2;

      createNewElement(type, centerX, centerY);
    }
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (selectedElement) {
      const updatedObjects = canvasObjects.filter(
        (obj) => obj.id !== selectedElement.id
      );

      setCanvasObjects(updatedObjects);
      setSelectedElement(null);

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(updatedObjects);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // Update properties of selected element
  const updateElementProperty = (property, value) => {
    if (selectedElement) {
      const updatedObjects = canvasObjects.map((obj) => {
        if (obj.id === selectedElement.id) {
          return { ...obj, [property]: value };
        }
        return obj;
      });

      setCanvasObjects(updatedObjects);
      setSelectedElement({ ...selectedElement, [property]: value });
    }
  };

  // Handle text formatting
  const handleTextFormat = (property, value) => {
    if (selectedElement && selectedElement.type === "text") {
      updateElementProperty(property, value);
    }
  };

  // Toggle text formatting
  const toggleTextFormat = (property) => {
    if (selectedElement && selectedElement.type === "text") {
      let newValue;

      switch (property) {
        case "fontWeight":
          newValue = selectedElement.fontWeight === "bold" ? "normal" : "bold";
          break;
        case "fontStyle":
          newValue =
            selectedElement.fontStyle === "italic" ? "normal" : "italic";
          break;
        case "textDecoration":
          newValue =
            selectedElement.textDecoration === "underline"
              ? "none"
              : "underline";
          break;
        default:
          return;
      }

      updateElementProperty(property, newValue);
    }
  };

  // Set text alignment
  const setTextAlignment = (alignment) => {
    if (selectedElement && selectedElement.type === "text") {
      updateElementProperty("textAlign", alignment);
    }
  };

  // Handle rotation
  const handleRotation = (degrees) => {
    if (selectedElement) {
      const newRotation = selectedElement.rotation + degrees;
      updateElementProperty("rotation", newRotation);
    }
  };

  // Render canvas content
  const renderCanvasContent = () => {
    return canvasObjects.map((obj) => {
      const isSelected = selectedElement && selectedElement.id === obj.id;
      const selectionStyle = isSelected
        ? {
            outlineColor: "#1A73E8",
            outlineWidth: "2px",
            outlineStyle: "solid",
            outlineOffset: "1px",
          }
        : {};

      // Base style with rotation
      const baseStyle = {
        position: "absolute",
        transform: `rotate(${obj.rotation}deg)`,
        transformOrigin: "center center",
        ...selectionStyle,
      };

      switch (obj.type) {
        case "rect":
          return (
            <div
              key={obj.id}
              style={{
                ...baseStyle,
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                backgroundColor: obj.fill,
                border: `1px solid ${obj.stroke}`,
              }}
            >
              {isSelected && (
                <div className="absolute w-full h-full">
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-1/2"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-full"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-full"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-1/2"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-full"></div>
                </div>
              )}
            </div>
          );
        case "circle":
          return (
            <div
              key={obj.id}
              style={{
                ...baseStyle,
                left: `${obj.x - obj.radius}px`,
                top: `${obj.y - obj.radius}px`,
                width: `${obj.radius * 2}px`,
                height: `${obj.radius * 2}px`,
                backgroundColor: obj.fill,
                border: `1px solid ${obj.stroke}`,
                borderRadius: "50%",
              }}
            >
              {isSelected && (
                <div className="absolute w-full h-full">
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-1/2"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-1/2 left-full"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-1/2"></div>
                </div>
              )}
            </div>
          );
        case "text":
          return (
            <div
              key={obj.id}
              style={{
                ...baseStyle,
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                color: obj.fill,
                fontSize: `${obj.fontSize}px`,
                fontWeight: obj.fontWeight,
                fontStyle: obj.fontStyle,
                textDecoration: obj.textDecoration,
                textAlign: obj.textAlign,
                minWidth: "20px",
                padding: "2px",
              }}
            >
              {obj.text}
              {isSelected && (
                <div className="absolute w-full h-full">
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-0 left-full"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-0"></div>
                  <div className="absolute w-2 h-2 bg-blue-500 border border-white -translate-x-1/2 -translate-y-1/2 top-full left-full"></div>
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  // Render rulers
  const renderRulers = () => {
    if (!showRulers) return null;

    const horizontalMarks = [];
    const verticalMarks = [];

    for (let i = 0; i < 1920; i += gridSize) {
      horizontalMarks.push(
        <div
          key={`h-${i}`}
          className="absolute top-0 h-2 border-l border-gray-400"
          style={{ left: `${i}px` }}
        >
          {i % 100 === 0 && (
            <div className="absolute left-1 text-gray-600 text-xs">{i}</div>
          )}
        </div>
      );
    }

    for (let i = 0; i < 1080; i += gridSize) {
      verticalMarks.push(
        <div
          key={`v-${i}`}
          className="absolute left-0 w-2 border-t border-gray-400"
          style={{ top: `${i}px` }}
        >
          {i % 100 === 0 && (
            <div className="absolute top-0 -ml-6 text-gray-600 text-xs">
              {i}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="absolute top-0 left-0 h-4 w-full bg-gray-100 border-b border-gray-300 z-10">
          {horizontalMarks}
        </div>
        <div className="absolute top-0 left-0 w-4 h-full bg-gray-100 border-r border-gray-300 z-10">
          {verticalMarks}
        </div>
        <div className="absolute top-0 left-0 w-4 h-4 bg-gray-200 border-r border-b border-gray-300 z-20"></div>
      </>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-3 justify-between">
        <div className="flex items-center">
          <div className="font-medium text-gray-800 mr-6">
            Figma-Style Editor
          </div>
          <div className="flex space-x-4 text-sm text-gray-600">
            <button
              className={`px-2 py-1 ${
                activeTab === "file" ? "text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("file")}
            >
              File
            </button>
            <button
              className={`px-2 py-1 ${
                activeTab === "edit" ? "text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("edit")}
            >
              Edit
            </button>
            <button
              className={`px-2 py-1 ${
                activeTab === "design" ? "text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("design")}
            >
              Design
            </button>
            <button
              className={`px-2 py-1 ${
                activeTab === "view" ? "text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("view")}
            >
              View
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="text-gray-600 hover:bg-gray-100 p-2 rounded"
            title="Undo (Ctrl+Z)"
            onClick={handleUndo}
          >
            <RotateCcw size={16} />
          </button>
          <button
            className="text-gray-600 hover:bg-gray-100 p-2 rounded"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
            UI
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-3 space-x-2">
        <button
          className={`p-2 rounded ${
            activeTool === "select"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => handleToolSelect("select")}
          title="Select (V)"
        >
          <Settings size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            activeTool === "move"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => handleToolSelect("move")}
          title="Move (H)"
        >
          <Move size={16} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <button
          className={`p-2 rounded ${
            activeTool === "rect"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => {
            handleToolSelect("rect");
          }}
          title="Rectangle (R)"
        >
          <Square size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            activeTool === "circle"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => {
            handleToolSelect("circle");
          }}
          title="Circle (O)"
        >
          <Circle size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            activeTool === "poly"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => handleToolSelect("poly")}
          title="Polygon"
        >
          <Hexagon size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            activeTool === "pen"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => handleToolSelect("pen")}
          title="Pen (P)"
        >
          <PenTool size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            activeTool === "text"
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => {
            handleToolSelect("text");
          }}
          title="Text (T)"
        >
          <Type size={16} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <button
          className={`p-2 rounded ${
            showGrid
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          <Grid size={16} />
        </button>
        <button
          className={`p-2 rounded ${
            snapToGrid
              ? "bg-blue-100 text-blue-600"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setSnapToGrid(!snapToGrid)}
          title="Toggle Snap to Grid"
        >
          <Hash size={16} />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 space-x-2 text-gray-700 text-sm">
          <button
            onClick={() => handleZoom("out")}
            className="p-1 rounded hover:bg-gray-200"
            title="Zoom Out"
          >
            <Minus size={14} />
          </button>
          <button
            onClick={() => handleZoom("reset")}
            className="hover:text-blue-600"
            title="Reset Zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={() => handleZoom("in")}
            className="p-1 rounded hover:bg-gray-200"
            title="Zoom In"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Layers */}
        <div
          className={`w-64 bg-white border-r border-gray-200 flex flex-col ${
            isLayersPanelOpen ? "" : "hidden"
          }`}
        >
          <div className="p-3 border-b border-gray-200 font-medium flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Layers size={16} />
              <span>Layers</span>
            </div>
            <button
              className="text-gray-500 hover:bg-gray-100 p-1 rounded-sm"
              onClick={() => setIsLayersPanelOpen(false)}
              title="Close Layers Panel"
            >
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {canvasObjects.map((obj, index) => (
              <div
                key={obj.id}
                className={`px-3 py-2 flex items-center text-sm border-l-2 cursor-pointer hover:bg-gray-100 ${
                  selectedElement && selectedElement.id === obj.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedElement(obj)}
              >
                {obj.type === "rect" && (
                  <Square size={14} className="mr-2 text-gray-500" />
                )}
                {obj.type === "circle" && (
                  <Circle size={14} className="mr-2 text-gray-500" />
                )}
                {obj.type === "text" && (
                  <Type size={14} className="mr-2 text-gray-500" />
                )}
                <span>
                  {obj.type} {obj.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative overflow-auto bg-gray-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div
              ref={canvasRef}
              className="bg-white shadow-sm relative"
              style={{
                width: "1920px",
                height: "1080px",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
              }}
            >
              {/* Grid background pattern */}
              {showGrid && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                  }}
                ></div>
              )}

              {/* Rulers */}
              {renderRulers()}

              {/* Canvas content */}
              {renderCanvasContent()}
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div
          className={`w-72 bg-white border-l border-gray-200 flex flex-col ${
            isPropertiesPanelOpen ? "" : "hidden"
          }`}
        >
          <div className="p-3 border-b border-gray-200 font-medium flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Design</span>
            </div>
            <button
              className="text-gray-500 hover:bg-gray-100 p-1 rounded-sm"
              onClick={() => setIsPropertiesPanelOpen(false)}
              title="Close Properties Panel"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedElement ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
                    Layout
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        X
                      </label>
                      <input
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) =>
                          updateElementProperty("x", parseInt(e.target.value))
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Y
                      </label>
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) =>
                          updateElementProperty("y", parseInt(e.target.value))
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    {selectedElement.type === "rect" && (
                      <>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Width
                          </label>
                          <input
                            type="number"
                            value={selectedElement.width}
                            onChange={(e) =>
                              updateElementProperty(
                                "width",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Height
                          </label>
                          <input
                            type="number"
                            value={selectedElement.height}
                            onChange={(e) =>
                              updateElementProperty(
                                "height",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </>
                    )}

                    {selectedElement.type === "circle" && (
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Radius
                        </label>
                        <input
                          type="number"
                          value={selectedElement.radius}
                          onChange={(e) =>
                            updateElementProperty(
                              "radius",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500 block mb-1">
                        Rotation
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={selectedElement.rotation}
                          onChange={(e) =>
                            updateElementProperty(
                              "rotation",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <div className="flex ml-1">
                          <button
                            onClick={() => handleRotation(-15)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            title="Rotate Left"
                          >
                            ⟲
                          </button>
                          <button
                            onClick={() => handleRotation(15)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            title="Rotate Right"
                          >
                            ⟳
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
                    Fill
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded border border-gray-300 overflow-hidden relative">
                      <input
                        type="color"
                        value={selectedElement.fill}
                        onChange={(e) =>
                          updateElementProperty("fill", e.target.value)
                        }
                        className="absolute inset-0 w-10 h-10 cursor-pointer opacity-0"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: selectedElement.fill }}
                      ></div>
                    </div>
                    <input
                      type="text"
                      value={selectedElement.fill}
                      onChange={(e) =>
                        updateElementProperty("fill", e.target.value)
                      }
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                {(selectedElement.type === "rect" ||
                  selectedElement.type === "circle") && (
                  <div>
                    <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
                      Stroke
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded border border-gray-300 overflow-hidden relative">
                        <input
                          type="color"
                          value={selectedElement.stroke}
                          onChange={(e) =>
                            updateElementProperty("stroke", e.target.value)
                          }
                          className="absolute inset-0 w-10 h-10 cursor-pointer opacity-0"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: selectedElement.stroke }}
                        ></div>
                      </div>
                      <input
                        type="text"
                        value={selectedElement.stroke}
                        onChange={(e) =>
                          updateElementProperty("stroke", e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                )}

                {selectedElement.type === "text" && (
                  <>
                    <div>
                      <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
                        Text
                      </h3>
                      <input
                        type="text"
                        value={selectedElement.text}
                        onChange={(e) =>
                          updateElementProperty("text", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
                        Typography
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Font Size
                          </label>
                          <input
                            type="number"
                            value={selectedElement.fontSize}
                            onChange={(e) =>
                              updateElementProperty(
                                "fontSize",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-1">
                            Font
                          </label>
                          <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>Sans Serif</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.fontWeight === "bold"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => toggleTextFormat("fontWeight")}
                          title="Bold"
                        >
                          <Bold size={14} />
                        </button>
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.fontStyle === "italic"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => toggleTextFormat("fontStyle")}
                          title="Italic"
                        >
                          <Italic size={14} />
                        </button>
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.textDecoration === "underline"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => toggleTextFormat("textDecoration")}
                          title="Underline"
                        >
                          <Underline size={14} />
                        </button>
                      </div>

                      <div className="flex border border-gray-300 rounded overflow-hidden mt-2">
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.textAlign === "left"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => setTextAlignment("left")}
                          title="Align Left"
                        >
                          <AlignLeft size={14} />
                        </button>
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.textAlign === "center"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => setTextAlignment("center")}
                          title="Align Center"
                        >
                          <AlignCenter size={14} />
                        </button>
                        <button
                          className={`flex-1 py-1 hover:bg-gray-100 flex justify-center items-center text-gray-600 ${
                            selectedElement.textAlign === "right"
                              ? "bg-blue-100 text-blue-600"
                              : ""
                          }`}
                          onClick={() => setTextAlignment("right")}
                          title="Align Right"
                        >
                          <AlignRight size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      if (selectedElement) {
                        setCopiedElement({ ...selectedElement });
                      }
                    }}
                    title="Copy Element (Ctrl+C)"
                  >
                    Copy
                  </button>
                  <button
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                    onClick={handleDeleteElement}
                    title="Delete Element (Delete)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm mt-8">
                Select an element to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Settings Panel (can be shown when needed) */}
      <div className="hidden absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded shadow-lg p-4 z-50">
        <h3 className="font-medium mb-3">Canvas Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={() => setShowGrid(!showGrid)}
                className="mr-2"
              />
              <span className="text-sm">Show Grid</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={() => setSnapToGrid(!snapToGrid)}
                className="mr-2"
              />
              <span className="text-sm">Snap to Grid</span>
            </label>
          </div>
          <div>
            <label className="text-sm block mb-1">Grid Size</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-right text-gray-500">{gridSize}px</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaStyleEditor;
