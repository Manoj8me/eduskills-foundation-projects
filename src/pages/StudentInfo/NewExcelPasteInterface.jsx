import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux"; // Add this import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StaffService } from "../../services/dataService";
import FullScreenLoading from "./FullScreenLoading";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import DashboardCard from "./StatisticsCard";
import FilterComponent from "./FilterComponent";
import api from "../../services/api";
import FullScreenDatabaseLoading from "./FullScreenDatabaseLoading";
import SubmissionSuccessModal from "./SubmissionSuccessModal"; // Import the new modal

// Add custom scrollbar styles
const scrollbarStyles = `
  /* Custom scrollbar styles */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3b82f6;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2563eb;
  }

  /* Required field styles */
  .required-field::after {
    content: " *";
    color: #ef4444;
  }

  /* Pre-filled cell styles */
  .prefilled-cell {
    background-color: #e0f2fe;
    position: relative;
  }

  .prefilled-cell:before {
    content: "Auto-filled";
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 9px;
    color: #3b82f6;
    padding: 0 2px;
    pointer-events: none;
  }

  .prefilled-header {
    background-color: #0369a1 !important;
  }
`;

const NewMaterialExcelInterface = () => {
  // Get user role from Redux store
  const userRole = useSelector((state) => state.authorise.userRole);

  // UI headers (display headers) - Only Email column now
  const HEADERS = ["Email"];

  // API headers (for submission) - keeping all fields for API
  const API_HEADERS = ["mail_id", "name", "gender", "branch", "year"];

  // Define the absolute maximum rows that can be added at once
  const MAX_BATCH_ROWS = 500;

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Database limits state - Updated to include topup_limit and topup_used
  const [databaseLimits, setDatabaseLimits] = useState({
    student_intake_data: 0,
    registration_limit: null,
    deleted: 0,
    students_hold: 0, // TDS hold
    topup_limit: null, // Total topup limit
    topup_used: 0, // Amount of topup used
    topup_limit_available: null, // Remaining topup (calculated or provided)
    isLoading: true,
    error: null,
  });

  // Initial data with headers and empty rows - Updated for 1 column (Email only)
  const [rows, setRows] = useState([[""], [""], [""]]);

  // Calculate remaining slots based on database limits - Updated logic
  const getRemainingSlots = () => {
    const {
      student_intake_data,
      registration_limit,
      students_hold,
      topup_limit_available,
    } = databaseLimits;

    if (registration_limit === null) {
      return Infinity; // Unlimited
    }

    if (registration_limit === 0) {
      return 0; // Cannot add data
    }

    // First check if there's available topup limit
    if (topup_limit_available !== null && topup_limit_available > 0) {
      return topup_limit_available;
    }

    // If no topup limit, calculate based on regular limit
    // Calculate actual available slots considering both used and hold amounts
    const totalUsed = student_intake_data + students_hold;
    return Math.max(0, registration_limit - totalUsed);
  };

  // Define maximum allowed rows based on database limits and the batch limit
  const getMaxRows = () => {
    const remainingSlots = getRemainingSlots();

    if (remainingSlots === Infinity) {
      return MAX_BATCH_ROWS; // Default max if unlimited
    }

    // Return the smaller of the two limits
    return Math.min(remainingSlots, MAX_BATCH_ROWS);
  };

  // Add loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Course, Branch and Year filter states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchDisabled, setBranchDisabled] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [yearDisabled, setYearDisabled] = useState(true);
  const [filtersValid, setFiltersValid] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Check if filters are valid
  useEffect(() => {
    if (selectedCourse && selectedBranch && selectedYear) {
      setFiltersValid(true);
    } else {
      setFiltersValid(false);
    }
  }, [selectedCourse, selectedBranch, selectedYear]);

  // History for undo/redo functionality
  const [history, setHistory] = useState([
    Array(3)
      .fill()
      .map(() => Array(HEADERS.length).fill("")),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [activeCell, setActiveCell] = useState({ row: -1, col: -1 });
  const tableRef = useRef(null);

  // Create refs for each cell to improve selection handling
  const cellRefs = useRef([]);

  // Check if user is a leader (disable actions for leaders)
  const isLeader = userRole === "leaders";

  // Fetch database limits on component mount
  useEffect(() => {
    fetchDatabaseLimits();
  }, []);

  // Function to fetch database limits - Updated to include topup_limit and topup_used
  const fetchDatabaseLimits = async () => {
    try {
      setDatabaseLimits((prev) => ({ ...prev, isLoading: true }));

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Call the API with authorization header
      const response = await api.get(`${BASE_URL}/internship/databaseLimits`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Calculate topup_limit_available if not provided by API
      const topupLimit = response.data.topup_limit || null;
      const topupUsed = response.data.topup_used || 0;
      const topupAvailable =
        response.data.topup_limit_available !== undefined
          ? response.data.topup_limit_available
          : topupLimit !== null
          ? Math.max(0, topupLimit - topupUsed)
          : null;

      // Update state with the response data including all topup fields
      setDatabaseLimits({
        student_intake_data: response.data.student_intake_data || 0,
        registration_limit: response.data.registration_limit,
        deleted: response.data.deleted || 0,
        students_hold: response.data.students_hold || 0,
        topup_limit: topupLimit,
        topup_used: topupUsed,
        topups: response.data.topups || [],
        topup_limit_available: topupAvailable,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching database limits:", error);
      setDatabaseLimits((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to fetch database limits",
      }));
    }
  };

  // Initialize the refs array when rows change
  useEffect(() => {
    cellRefs.current = Array(rows.length)
      .fill()
      .map(() =>
        Array(HEADERS.length)
          .fill()
          .map(() => React.createRef())
      );
  }, [rows.length]);

  // Add to history
  const addToHistory = (newRows) => {
    // If we've done some undos and then make a new change, we should discard the "future" states
    const newHistory = history.slice(0, historyIndex + 1);

    // Add the new state to history
    newHistory.push(JSON.parse(JSON.stringify(newRows)));

    // Limit history to a reasonable size (e.g., 50 states)
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo function
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRows(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Redo function
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRows(JSON.parse(JSON.stringify(history[newIndex])));
    }
  };

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ignore if loading or if user is a leader
      if (isLoading || isSubmitting || isLeader) return;

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z or Cmd+Shift+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [historyIndex, history, isLoading, isSubmitting, isLeader]);

  // Calculate data stats
  const getDataStats = () => {
    // Count non-empty cells
    let nonEmptyCells = 0;
    let nonEmptyRows = 0;

    for (const row of rows) {
      const hasContent = row.some((cell) => cell && cell.trim() !== "");
      if (hasContent) {
        nonEmptyRows++;
        for (const cell of row) {
          if (cell && cell.trim() !== "") {
            nonEmptyCells++;
          }
        }
      }
    }

    return {
      totalRows: rows.length,
      nonEmptyRows,
      nonEmptyCells,
      columnsCount: HEADERS.length,
    };
  };

  // Handle pasting data into the table
  const handlePaste = (e) => {
    if (isLoading || isSubmitting || isLeader) return;
    if (activeCell.row === -1 || activeCell.col === -1) return;

    // Check if filters are valid
    if (!filtersValid) {
      e.preventDefault();
      toast.error(
        "Please select Course, Branch, and Passout Year before adding data."
      );
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      e.preventDefault();
      const { students_hold, topup_limit_available } = databaseLimits;
      if (topup_limit_available === 0) {
        toast.error(
          "Both registration and topup limits have been reached. Please contact your RM."
        );
      } else if (students_hold > 0) {
        toast.error(
          `Registration limit reached. ${students_hold} students are on hold due to TDS. Please contact your RM.`
        );
      } else {
        toast.error("Registration limit reached. Please contact your RM.");
      }
      return;
    }

    e.preventDefault();

    // Show loading state for large data pastes using the in-table loader
    setIsLoading(true);

    try {
      // Get clipboard data safely
      let pastedText = "";
      try {
        const clipboardData = e.clipboardData || window.clipboardData;
        if (clipboardData) {
          pastedText = clipboardData.getData("text") || "";
        }
      } catch (clipErr) {
        console.error("Clipboard access error:", clipErr);
        // Continue with empty text if we can't access clipboard
      }

      if (!pastedText.trim()) {
        toast.warning("No content found in clipboard.");
        setIsLoading(false);
        return;
      }

      // Detect if this is a large paste operation
      const pastedRows = pastedText
        .split(/\r\n|\n|\r/)
        .filter(
          (row) => row !== null && row !== undefined && row.trim() !== ""
        );

      const isLargePaste = pastedText.length > 10000 || pastedRows.length > 50;

      if (isLargePaste) {
        const estimatedCells = pastedRows.reduce((sum, row) => {
          const delimiter = row.includes("\t") ? "\t" : ",";
          return sum + row.split(delimiter).length;
        }, 0);

        toast.info(
          `Processing ${pastedRows.length} rows with approximately ${estimatedCells} cells, please wait...`
        );
        // For large pastes, update the loading message in the in-table loading indicator
        setLoadingMessage(`Processing ${pastedRows.length} rows...`);
      }

      // Process the pasted data safely with timeout
      setTimeout(() => {
        try {
          // Parse the pasted text into rows and columns
          const pastedRows = pastedText
            .split(/\r\n|\n|\r/)
            .filter(
              (row) => row !== null && row !== undefined && row.trim() !== ""
            );

          if (pastedRows.length === 0) {
            toast.warning("No valid data rows found.");
            setIsLoading(false);
            return;
          }

          // Count columns and rows before processing
          const totalRows = pastedRows.length;
          const columnsPerRow = pastedRows.map((row) => {
            const delimiter = row.includes("\t") ? "\t" : ",";
            return row.split(delimiter).length;
          });
          const totalColumns = columnsPerRow.reduce(
            (sum, count) => sum + count,
            0
          );
          const maxColumnsInRow = Math.max(...columnsPerRow);
          const minColumnsInRow = Math.min(...columnsPerRow);

          console.log(
            `Pasting data: ${totalRows} rows, ${totalColumns} total cells, ${minColumnsInRow}-${maxColumnsInRow} columns per row`
          );

          // Safely split rows into columns, handling potential empty strings
          const pastedData = pastedRows.map((row) => {
            // Handle both tab-delimited and comma-delimited data
            const delimiter = row.includes("\t") ? "\t" : ",";
            const cells = row.split(delimiter).map((cell) => cell || "");
            // Only take the first cell (email) since we only have one column now
            return [cells[0] || ""];
          });

          // Skip the header row if it exists in the pasted data
          let dataToInsert = pastedData;

          // Only try to detect headers if we have at least one row
          if (pastedData.length > 0 && pastedData[0].length > 0) {
            // Check if the first row contains headers (case insensitive comparison)
            // Safely handle potential undefined values
            const possibleHeaders = pastedData[0].map((h) =>
              (h || "").toString().toLowerCase()
            );
            const knownHeaders = HEADERS.map((h) => h.toLowerCase());

            // If the first row looks like headers, skip it
            if (possibleHeaders.some((h) => knownHeaders.includes(h))) {
              dataToInsert = pastedData.slice(1);
            }
          }

          // Create a copy of the current rows
          const newRows = [...rows];

          // Calculate remaining slots and adjust limit accordingly
          const maxRowsAllowed = getMaxRows();

          // Check if paste operation would exceed the maximum row limit
          const potentialRowCount = Math.max(
            newRows.length,
            activeCell.row + dataToInsert.length
          );

          if (potentialRowCount > maxRowsAllowed) {
            const rowsAvailable = maxRowsAllowed - activeCell.row;
            if (rowsAvailable <= 0) {
              toast.error(
                `Row limit of ${maxRowsAllowed} reached. Cannot paste at the current position.`
              );
              setIsLoading(false);
              return;
            }

            toast.warning(
              `Row limit of ${maxRowsAllowed} reached. Only pasting ${rowsAvailable} of ${dataToInsert.length} rows.`
            );
            dataToInsert = dataToInsert.slice(0, rowsAvailable);
          }

          // Update rows starting from the active cell
          let rowsAdded = 0;

          for (let i = 0; i < dataToInsert.length; i++) {
            const targetRowIndex = activeCell.row + i;

            // Add new rows if needed
            if (targetRowIndex >= newRows.length) {
              newRows.push(Array(HEADERS.length).fill(""));
              rowsAdded++;
            }

            // Make sure we don't exceed the column bounds
            for (
              let j = 0;
              j < dataToInsert[i].length && j + activeCell.col < HEADERS.length;
              j++
            ) {
              // Safely assign the cell value, ensuring it's a string
              const cellValue = dataToInsert[i][j];
              newRows[targetRowIndex][activeCell.col + j] =
                cellValue !== null && cellValue !== undefined
                  ? cellValue.toString()
                  : "";
            }
          }

          // Only update state if we actually processed some data
          if (dataToInsert.length > 0) {
            setRows(newRows);
            addToHistory(newRows);

            // Calculate total cells pasted
            const totalCellsPasted = dataToInsert.reduce(
              (sum, row) =>
                sum + Math.min(row.length, HEADERS.length - activeCell.col),
              0
            );

            toast.success(
              `Pasted ${
                dataToInsert.length
              } rows and ${totalCellsPasted} cells${
                rowsAdded > 0 ? ` (added ${rowsAdded} new rows)` : ""
              }`
            );
          } else {
            toast.warning(
              "No data was pasted. Please check your clipboard content."
            );
          }
        } catch (err) {
          console.error("Paste processing error:", err);
          toast.error(
            `Error processing pasted data: ${err.message || "Unknown error"}`
          );
        } finally {
          setIsLoading(false);
        }
      }, 100); // Small delay to ensure loading state is visible
    } catch (err) {
      console.error("Initial paste error:", err);
      toast.error(`Clipboard error: ${err.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  // Handle cell click to set active cell
  const handleCellClick = (rowIndex, colIndex) => {
    // Disable cell interaction for leaders
    if (isLeader) {
      toast.warning("You do not have permission to edit this data.");
      return;
    }

    // Check if filters are valid
    if (!filtersValid) {
      toast.error(
        "Please select Course, Branch, and Passout Year before adding data."
      );
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      const { students_hold, topup_limit_available } = databaseLimits;
      if (topup_limit_available === 0) {
        toast.error(
          "Both registration and topup limits have been reached. Please contact your RM."
        );
      } else if (students_hold > 0) {
        toast.error(
          `Registration limit reached. ${students_hold} students are on hold due to TDS. Please contact your RM.`
        );
      } else {
        toast.error("Registration limit reached. Please contact your RM.");
      }
      return;
    }

    setActiveCell({ row: rowIndex, col: colIndex });
  };

  // Handle cell content change
  // Handle cell content change (continued from previous part)
  const handleCellChange = (rowIndex, colIndex, value) => {
    // Disable cell editing for leaders
    if (isLeader) return;

    // Check if filters are valid
    if (!filtersValid) {
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      return;
    }

    const newRows = [...rows];
    if (newRows[rowIndex][colIndex] !== value) {
      newRows[rowIndex][colIndex] = value;
      setRows(newRows);
      addToHistory(newRows);
    }
  };

  // Add a new empty row
  const addRow = () => {
    // Disable for leaders
    if (isLeader) {
      toast.warning("You do not have permission to add rows.");
      return;
    }

    // Check if filters are valid
    if (!filtersValid) {
      toast.error(
        "Please select Course, Branch, and Passout Year before adding data."
      );
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      const { students_hold, topup_limit_available } = databaseLimits;
      if (topup_limit_available === 0 && students_hold > 0) {
        toast.error(
          `Registration limit reached. ${students_hold} students are on hold due to TDS. Please contact your RM.`
        );
      } else {
        toast.error("Registration limit reached. Please contact your RM.");
      }
      return;
    }

    // Check if adding a row would exceed the maximum limit
    const maxRowsAllowed = getMaxRows();
    if (rows.length >= maxRowsAllowed) {
      toast.error(`Maximum row limit of ${maxRowsAllowed} reached.`);
      return;
    }

    const newRows = [...rows, Array(HEADERS.length).fill("")];
    setRows(newRows);
    addToHistory(newRows);
  };

  // Delete the selected row
  const deleteRow = () => {
    if (isLeader || activeCell.row === -1 || rows.length <= 1) return;

    const newRows = [...rows];
    newRows.splice(activeCell.row, 1);
    setRows(newRows);
    addToHistory(newRows);
    setActiveCell({ row: -1, col: -1 });
  };

  // Clear all data
  const clearData = () => {
    // Disable for leaders
    if (isLeader) {
      toast.warning("You do not have permission to clear data.");
      return;
    }

    const newRows = Array(3)
      .fill()
      .map(() => Array(HEADERS.length).fill(""));

    setRows(newRows);
    addToHistory(newRows);
    setActiveCell({ row: -1, col: -1 });
  };

  // Convert data to CSV with API headers - Modified to send empty string for name
  const convertToCSV = (dataRows) => {
    // Filter out empty rows
    const nonEmptyRows = dataRows.filter((row) =>
      row.some((cell) => cell.trim() !== "")
    );

    // Map each row to include empty name, gender (blank), branch, year, and program_id from filters
    const rowsWithFilters = nonEmptyRows.map((row) => {
      // Create a new array with all columns (email, empty name, gender, branch, year, program_id)
      return [
        row[0], // mail_id (email)
        "", // name - sending empty string as requested
        "", // gender - sending blank as requested
        selectedBranch, // branch - keeping branch name as it is
        selectedYear, // year - from filter
        selectedCourseId, // program_id - new field with course ID
      ];
    });

    // Updated API headers to include program_id
    const API_HEADERS = [
      "mail_id",
      "name",
      "gender",
      "branch",
      "year",
      "program_id",
    ];

    // Create CSV content with updated API headers
    return [
      API_HEADERS.join(","),
      ...rowsWithFilters.map((row) =>
        row
          .map((cell) => {
            // Escape commas and quotes in cell content
            if (
              cell &&
              (cell.toString().includes(",") || cell.toString().includes('"'))
            ) {
              return `"${cell.toString().replace(/"/g, '""')}"`;
            }
            return cell || "";
          })
          .join(",")
      ),
    ].join("\n");
  };

  // Submit data - Updated to handle success modal
  const handleSubmit = async () => {
    // Disable submit for leaders
    if (isLeader) {
      toast.warning("You do not have permission to submit data.");
      return;
    }

    // Check if filters are valid
    if (!filtersValid) {
      toast.error(
        "Please select Course, Branch, and Passout Year before submitting."
      );
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      const { students_hold, topup_limit_available } = databaseLimits;
      if (topup_limit_available === 0 && students_hold > 0) {
        toast.error(
          `Registration limit reached. ${students_hold} students are on hold due to TDS. Please contact your RM.`
        );
      } else {
        toast.error("Registration limit reached. Please contact your RM.");
      }
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setLoadingMessage("Submitting your data...");

    try {
      const filteredRows = rows.filter((row) =>
        row.some((cell) => cell.trim() !== "")
      );

      if (filteredRows.length === 0) {
        toast.warning("No data to submit. Please add some data first.");
        setIsSubmitting(false);
        return;
      }

      // Check if filtered data exceeds remaining slots
      if (filteredRows.length > getRemainingSlots()) {
        toast.error(
          `You can only submit up to ${getRemainingSlots()} rows of data.`
        );
        setIsSubmitting(false);
        return;
      }

      const csvData = convertToCSV(filteredRows);

      // Log the CSV data for debugging
      console.log("Submitting CSV data:", csvData);

      // Create a file object from the CSV data
      const csvBlob = new Blob([csvData], { type: "text/csv" });
      const csvFile = new File([csvBlob], "intake_data.csv", {
        type: "text/csv",
      });

      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", csvFile);

      // Submit the CSV data using StaffService
      const response = await StaffService.uploadIntakeData(formData);

      console.log("Success:", response);

      // Store the submission result and show modal instead of toast
      setSubmissionResult(response?.data);
      setShowSuccessModal(true);

      // Refresh data after successful submission
      await refreshDataAfterSubmission();
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error?.response?.data?.detail ||
          "Error submitting data. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // New function to refresh data after successful submission
  const refreshDataAfterSubmission = async () => {
    try {
      // Set a brief loading message
      setLoadingMessage("Refreshing data...");

      // 1. Refresh database limits
      await fetchDatabaseLimits();

      // 2. Reset the form to initial state
      const initialRows = Array(3)
        .fill()
        .map(() => Array(HEADERS.length).fill(""));

      setRows(initialRows);

      // 3. Reset history
      setHistory([initialRows]);
      setHistoryIndex(0);

      // 4. Clear active cell
      setActiveCell({ row: -1, col: -1 });

      // 5. Reset filters (optional - remove these lines if you want to keep filters selected)
      setSelectedCourse("");
      setSelectedBranch("");
      setSelectedYear("");
      setBranchDisabled(true);
      setYearDisabled(true);
      setFiltersValid(false);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.warning(
        "Data submitted successfully, but failed to refresh. Please refresh the page manually."
      );
    } finally {
      // Always stop the loading state
      setIsSubmitting(false);
      setLoadingMessage("");
    }
  };

  // Handle copy (Ctrl+C)
  const handleCopy = () => {
    if (isLeader || activeCell.row === -1 || activeCell.col === -1) return;

    try {
      // Get the cell text using the DOM element
      const cell = cellRefs.current[activeCell.row][activeCell.col].current;
      if (!cell) return;

      const cellText = cell.textContent || "";

      // Use the Clipboard API safely
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cellText).catch((err) => {
          console.error("Clipboard write failed:", err);
          // Fallback: create a textarea element to copy text
          fallbackCopy(cellText);
        });
      } else {
        // Fallback for browsers without Clipboard API
        fallbackCopy(cellText);
      }
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  // Fallback copy method using a temporary textarea
  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("execCommand copy failed:", err);
      }

      document.body.removeChild(textArea);
    } catch (err) {
      console.error("Fallback copy error:", err);
    }
  };

  // Handle cut (Ctrl+X) - continued
  const handleCut = () => {
    if (
      isLeader ||
      isLoading ||
      isSubmitting ||
      activeCell.row === -1 ||
      activeCell.col === -1
    )
      return;

    try {
      // Get the cell text
      const cell = cellRefs.current[activeCell.row][activeCell.col].current;
      if (!cell) return;

      const cellText = cell.textContent || "";

      // Copy to clipboard safely
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(cellText)
          .then(() => {
            // Clear the cell
            const newRows = [...rows];
            newRows[activeCell.row][activeCell.col] = "";
            setRows(newRows);
            addToHistory(newRows);
            cell.textContent = "";
          })
          .catch((err) => {
            console.error("Clipboard write failed during cut:", err);
            // Use fallback and still clear the cell
            fallbackCopy(cellText);
            const newRows = [...rows];
            newRows[activeCell.row][activeCell.col] = "";
            setRows(newRows);
            addToHistory(newRows);
            cell.textContent = "";
          });
      } else {
        // Fallback and still clear the cell
        fallbackCopy(cellText);
        const newRows = [...rows];
        newRows[activeCell.row][activeCell.col] = "";
        setRows(newRows);
        addToHistory(newRows);
        cell.textContent = "";
      }
    } catch (err) {
      console.error("Cut error:", err);
    }
  };

  // Key handler for navigation using arrow keys and keyboard shortcuts
  const handleKeyDown = (e, rowIndex, colIndex) => {
    // Disable keyboard interactions for leaders
    if (isLeader && !["Escape", "Tab"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Check if filters are valid
    if (!filtersValid && !["Escape", "Tab"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Check if user can add data
    if (getRemainingSlots() === 0 && !["Escape", "Tab"].includes(e.key)) {
      e.preventDefault();
      return;
    }

    if (
      (isLoading || isSubmitting) &&
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(
        e.key
      )
    )
      return;

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "c": // Copy
          e.preventDefault();
          handleCopy();
          return;
        case "x": // Cut
          e.preventDefault();
          handleCut();
          return;
        case "v": // Paste is handled by onPaste event
          return;
        default:
          break;
      }
    }

    // Handle navigation keys
    const maxRowsAllowed = getMaxRows();

    switch (e.key) {
      case "ArrowUp":
        if (rowIndex > 0) {
          e.preventDefault();
          setActiveCell({ row: rowIndex - 1, col: colIndex });
          cellRefs.current[rowIndex - 1][colIndex].current?.focus();
        }
        break;
      case "ArrowDown":
        if (rowIndex < rows.length - 1) {
          e.preventDefault();
          setActiveCell({ row: rowIndex + 1, col: colIndex });
          cellRefs.current[rowIndex + 1][colIndex].current?.focus();
        } else if (
          rowIndex === rows.length - 1 &&
          rows.length < maxRowsAllowed &&
          !isLeader
        ) {
          // Add new row when pressing down from the last row, if under the limit and not a leader
          e.preventDefault();
          addRow();
          // Set timeout to allow the DOM to update before focusing
          setTimeout(() => {
            setActiveCell({ row: rows.length, col: colIndex });
            cellRefs.current[rows.length]?.[colIndex]?.current?.focus();
          }, 0);
        } else if (
          rowIndex === rows.length - 1 &&
          rows.length >= maxRowsAllowed
        ) {
          // Show a toast if we've hit the limit
          toast.warning(`Row limit of ${maxRowsAllowed} reached.`);
        }
        break;
      case "ArrowLeft":
        if (colIndex > 0) {
          e.preventDefault();
          setActiveCell({ row: rowIndex, col: colIndex - 1 });
          cellRefs.current[rowIndex][colIndex - 1].current?.focus();
        }
        break;
      case "ArrowRight":
        if (colIndex < HEADERS.length - 1) {
          e.preventDefault();
          setActiveCell({ row: rowIndex, col: colIndex + 1 });
          cellRefs.current[rowIndex][colIndex + 1].current?.focus();
        }
        break;
      case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
          // Move backward - only within the single column now
          if (rowIndex > 0) {
            setActiveCell({ row: rowIndex - 1, col: colIndex });
            cellRefs.current[rowIndex - 1][colIndex].current?.focus();
          }
        } else {
          // Move forward - to next row or add new row
          if (rowIndex < rows.length - 1) {
            setActiveCell({ row: rowIndex + 1, col: colIndex });
            cellRefs.current[rowIndex + 1][colIndex].current?.focus();
          } else if (rows.length < maxRowsAllowed && !isLeader) {
            // Add new row when tabbing from the last cell if under the limit and not a leader
            addRow();
            // Set timeout to allow the DOM to update before focusing
            setTimeout(() => {
              setActiveCell({ row: rows.length, col: colIndex });
              cellRefs.current[rows.length]?.[colIndex]?.current?.focus();
            }, 0);
          } else {
            // Show a toast if we've hit the limit
            toast.warning(`Row limit of ${maxRowsAllowed} reached.`);
          }
        }
        break;
      case "Enter":
        if (!e.shiftKey) {
          e.preventDefault();
          if (rowIndex < rows.length - 1) {
            setActiveCell({ row: rowIndex + 1, col: colIndex });
            cellRefs.current[rowIndex + 1][colIndex].current?.focus();
          } else if (rows.length < maxRowsAllowed && !isLeader) {
            // Add new row when pressing Enter from the last row if under the limit and not a leader
            addRow();
            // Set timeout to allow the DOM to update before focusing
            setTimeout(() => {
              setActiveCell({ row: rows.length, col: colIndex });
              cellRefs.current[rows.length]?.[colIndex]?.current?.focus();
            }, 0);
          } else if (
            rowIndex === rows.length - 1 &&
            rows.length >= maxRowsAllowed
          ) {
            // Show a toast if we've hit the limit
            toast.warning(`Row limit of ${maxRowsAllowed} reached.`);
          }
        }
        break;
      default:
        break;
    }
  };

  // Determine button styles based on disabled state and variant
  const getButtonClass = (variant = "default", disabled = false) => {
    const baseClasses =
      "px-2 py-1 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 text-xs";

    if (disabled) {
      return `${baseClasses} bg-gray-200 text-gray-500 cursor-not-allowed`;
    }

    switch (variant) {
      case "contained":
        return `${baseClasses} bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500`;
      case "outlined":
        return `${baseClasses} border border-blue-500 hover:bg-blue-50 text-blue-700 focus:ring-blue-500`;
      case "text":
        return `${baseClasses} text-blue-700 hover:bg-blue-50 focus:ring-blue-500`;
      case "error":
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      case "warning":
        return `${baseClasses} bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400`;
      default:
        return `${baseClasses} bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500`;
    }
  };

  // Check if user is allowed to add data
  const canAddData = () => {
    // Don't show limit reached during loading
    if (databaseLimits.isLoading) {
      return true; // Allow UI to show normally while loading
    }
    return getRemainingSlots() > 0 && !isLeader; // Also check if user is not a leader
  };

  return (
    <div className="w-full mx-auto p-4 relative">
      {/* Add style tag for custom scrollbar */}
      <style>{scrollbarStyles}</style>

      <FullScreenDatabaseLoading
        isVisible={databaseLimits.isLoading}
        message="Loading Student Limits"
      />

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        submissionData={submissionResult}
      />

      {/* Registration Limits Dashboard - Responsive grid with proper sizing */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 text-left">
          Student Limits
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* Only show Approved Limit Card if registration_limit is not null */}
          {databaseLimits.registration_limit !== null && (
            <DashboardCard
              title="Approved"
              value={databaseLimits.registration_limit}
              showInfinitySymbol={databaseLimits.registration_limit === null}
              icon="approved"
              theme="green"
              isLoading={databaseLimits.isLoading}
              error={databaseLimits.error}
            />
          )}

          {/* Used Limit Card - Always show */}
          <DashboardCard
            title="Used"
            value={databaseLimits.student_intake_data}
            icon="students"
            theme="purple"
            isLoading={databaseLimits.isLoading}
            error={databaseLimits.error}
          />

          {/* Available Limit Card - Show normal calculation, not topup-based */}
          {databaseLimits.registration_limit !== null && (
            <DashboardCard
              title={
                databaseLimits.topup_limit_available !== null &&
                databaseLimits.topup_limit_available > 0
                  ? "Available"
                  : getRemainingSlots() === 0
                  ? "Limit Reached"
                  : "Available"
              }
              value={
                // Always calculate based on regular limit, not topup
                databaseLimits.registration_limit === null
                  ? null
                  : Math.max(
                      0,
                      databaseLimits.registration_limit -
                        (databaseLimits.student_intake_data +
                          databaseLimits.students_hold)
                    )
              }
              showInfinitySymbol={databaseLimits.registration_limit === null}
              additionalInfo={
                databaseLimits.students_hold > 0 &&
                Math.max(
                  0,
                  databaseLimits.registration_limit -
                    (databaseLimits.student_intake_data +
                      databaseLimits.students_hold)
                ) === 0
                  ? `${databaseLimits.students_hold} on TDS hold`
                  : null
              }
              icon={
                Math.max(
                  0,
                  databaseLimits.registration_limit -
                    (databaseLimits.student_intake_data +
                      databaseLimits.students_hold)
                ) === 0
                  ? "warning"
                  : "task"
              }
              theme="indigo"
              usedValue={
                databaseLimits.student_intake_data +
                databaseLimits.students_hold
              }
              totalValue={databaseLimits.registration_limit}
              percentage={
                databaseLimits.registration_limit === null
                  ? null
                  : Math.min(
                      100,
                      Math.round(
                        ((databaseLimits.student_intake_data +
                          databaseLimits.students_hold) /
                          databaseLimits.registration_limit) *
                          100
                      )
                    )
              }
              isLoading={databaseLimits.isLoading}
              error={databaseLimits.error}
            />
          )}

          {/* Deleted Count Card - Always show */}
          <DashboardCard
            title="Deleted"
            value={databaseLimits.deleted}
            icon="deleted"
            theme="rose"
            isLoading={databaseLimits.isLoading}
            error={databaseLimits.error}
          />

          {/* Topup Used Card - Only show if topup_limit is not null */}
          {databaseLimits.topup_limit !== null && (
            <DashboardCard
              title="Student Topup"
              value={databaseLimits.topup_used}
              icon="zap"
              theme="amber"
              usedValue={databaseLimits.topup_used}
              totalValue={databaseLimits.topup_limit}
              percentage={
                databaseLimits.topup_limit > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (databaseLimits.topup_used /
                          databaseLimits.topup_limit) *
                          100
                      )
                    )
                  : null
              }
              topupData={databaseLimits.topups || []}
              isLoading={databaseLimits.isLoading}
              error={databaseLimits.error}
            />
          )}

          {/* TDS Hold Card - Only show if students_hold > 0 */}
          {databaseLimits.students_hold > 0 && (
            <DashboardCard
              title="TDS Hold"
              value={databaseLimits.students_hold}
              icon="warning"
              theme="amber"
              isLoading={databaseLimits.isLoading}
              error={databaseLimits.error}
            />
          )}
        </div>
      </div>

      {/* Full-Screen Loading Animation - only for submission */}
      <FullScreenLoading isVisible={isSubmitting} message={loadingMessage} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0288d1] border-b border-blue-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-white">Add Students</h2>
              <p className="text-sm text-blue-100 mt-1">
                Select filters and enter email data or paste directly from
                Excel.
              </p>
            </div>
            <div className="flex space-x-2"></div>
          </div>

          {/* Show different messages based on user role and conditions */}
          {isLeader ? (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-300 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-amber-800">
                    View Only Access
                  </h3>
                  <p className="text-amber-700 mt-1">
                    You have read-only access to this section. Data modification
                    is restricted for your role.
                  </p>
                </div>
              </div>
            </div>
          ) : !canAddData() && databaseLimits.registration_limit !== 0 ? (
            <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-red-800">
                    Registration Limit Reached
                  </h3>
                  <p className="text-red-700 mt-1">
                    {databaseLimits.students_hold > 0
                      ? `You have reached your student registration limit. ${databaseLimits.students_hold} students are on hold due to TDS. Please contact your Relationship Manager for assistance.`
                      : "You have reached your student registration limit. Please contact your Relationship Manager for assistance."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <FilterComponent
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedCourseId={selectedCourseId}
              setSelectedCourseId={setSelectedCourseId}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              branchDisabled={branchDisabled}
              setBranchDisabled={setBranchDisabled}
              yearDisabled={yearDisabled}
              setYearDisabled={setYearDisabled}
              filtersValid={filtersValid}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              canAddData={canAddData()}
              isLeader={isLeader}
            />
          )}

          {/* Data Stats Bar - Only show if user can add data and is not a leader */}
          {canAddData() && !isLeader && (
            <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
              <div className="text-sm flex space-x-4">
                {filtersValid && !databaseLimits.isLoading && (
                  <span className="font-semibold text-blue-800">
                    Current Rows: {getDataStats().totalRows}
                  </span>
                )}
                <span className="font-medium text-gray-600">
                  (Max {MAX_BATCH_ROWS} rows are allowed)
                </span>
                {/* Show topup info if available */}
                {databaseLimits.topup_limit_available !== null &&
                  databaseLimits.topup_limit_available > 0 && (
                    <span className="font-medium text-green-600">
                      ({databaseLimits.topup_limit_available} topup slots
                      available)
                    </span>
                  )}
                {/* Show topup exhausted message if topup is 0 */}
                {databaseLimits.topup_limit_available === 0 && (
                  <span className="font-medium text-amber-600">
                    (Topup limit exhausted)
                  </span>
                )}
                {/* Show TDS hold info only if there are students on hold */}
                {databaseLimits.students_hold > 0 && (
                  <span className="font-medium text-amber-600">
                    ({databaseLimits.students_hold} students on TDS hold)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content with Custom Scrollbar - Only show if user can add data and is not a leader */}
        {canAddData() && !isLeader ? (
          <div
            className="px-6 py-4 h-96 overflow-y-auto custom-scrollbar relative"
            onPaste={handlePaste}
          >
            {/* Filter not set message */}
            {!filtersValid &&
              !databaseLimits.isLoading &&
              canAddData() &&
              !isLeader && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-35">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-md text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-amber-500 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-amber-800 mb-2">
                      Set Required Filters
                    </h3>
                    <p className="text-amber-700 mb-4">
                      Please select Course, Branch, and Passout Year to
                      continue.
                    </p>
                  </div>
                </div>
              )}

            {/* In-table loading overlay for paste operations */}
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-30">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-blue-700 font-medium">
                    {loadingMessage || "Processing..."}
                  </p>
                </div>
              </div>
            )}

            {/* Table with sticky header and horizontal scrollbar */}
            <div className="overflow-x-auto custom-scrollbar border border-gray-300 rounded-md shadow-sm">
              <table className="w-full border-collapse" ref={tableRef}>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#0288d1] text-white border-b border-blue-700">
                    {HEADERS.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left font-medium border-r border-blue-500 last:border-r-0"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-blue-50"
                      } hover:bg-blue-100 ${
                        activeCell.row === rowIndex ? "bg-blue-100" : ""
                      }`}
                    >
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-4 py-2 border-r border-b border-gray-300 last:border-r-0 ${
                            activeCell.row === rowIndex &&
                            activeCell.col === colIndex
                              ? "bg-blue-200"
                              : ""
                          }`}
                          style={{ outline: "none" }}
                        >
                          <div
                            ref={cellRefs.current[rowIndex]?.[colIndex] ?? null}
                            contentEditable={
                              canAddData() &&
                              filtersValid &&
                              !isLoading &&
                              !isSubmitting &&
                              !isLeader
                            }
                            suppressContentEditableWarning={true}
                            className={`outline-none min-h-8 focus:outline-none ${
                              !canAddData() || !filtersValid || isLeader
                                ? "opacity-70"
                                : ""
                            }`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onFocus={() => handleCellClick(rowIndex, colIndex)}
                            onBlur={(e) =>
                              handleCellChange(
                                rowIndex,
                                colIndex,
                                e.target.textContent
                              )
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, rowIndex, colIndex)
                            }
                            tabIndex={
                              !canAddData() || !filtersValid || isLeader
                                ? -1
                                : 0
                            }
                            data-row={rowIndex}
                            data-col={colIndex}
                          >
                            {cell}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tips */}
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium">Tips:</p>
              <ul className="mt-2 space-y-1 text-gray-600 ml-5 list-disc">
                <li>
                  First select required filters: Course → Branch → Passout Year
                </li>
                <li>Click on any cell to edit or select it</li>
                <li>Press Tab or Enter to move between rows</li>
                <li>
                  Select a cell and paste (Ctrl+V/Cmd+V) to import email
                  addresses
                </li>
                <li>Use Ctrl+Z/Cmd+Z to undo and Ctrl+Y/Cmd+Y to redo</li>
                <li>
                  Use Ctrl+C/Cmd+C to copy and Ctrl+X/Cmd+X to cut cell content
                </li>
                <li>Headers are fixed and won't be overwritten when pasting</li>
                <li>Use arrow keys to navigate between cells</li>
                <li className="text-blue-700 font-medium">
                  Branch and Passout Year will be automatically applied to all
                  students
                </li>
                <li className="text-blue-700 font-medium">
                  Only email addresses are required - names will be set
                  automatically
                </li>
                {databaseLimits.topup_limit_available !== null &&
                  databaseLimits.topup_limit_available > 0 && (
                    <li className="text-green-600 font-medium">
                      You have {databaseLimits.topup_limit_available} additional
                      topup slots available
                    </li>
                  )}
                {databaseLimits.topup_limit_available === 0 && (
                  <li className="text-amber-600 font-medium">
                    Topup limit has been exhausted
                  </li>
                )}
                {!canAddData() && databaseLimits.registration_limit !== 0 && (
                  <li className="text-red-600 font-medium">
                    {databaseLimits.students_hold > 0
                      ? `You have reached your registration limit. ${databaseLimits.students_hold} students are on hold due to TDS.`
                      : "You have reached your registration limit and cannot add more students"}
                  </li>
                )}
                {databaseLimits.registration_limit === 0 && (
                  <li className="text-red-600 font-medium">
                    Registration is currently closed. Please contact your RM.
                  </li>
                )}
                {isLeader && (
                  <li className="text-amber-600 font-medium">
                    You have view-only access. Data modification is restricted
                    for your role.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : null}

        {/* Fixed Submit Button Footer - Only show if user can add data and is not a leader */}
        {canAddData() && !isLeader && (
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex justify-between space-x-2 sticky bottom-0 left-0 right-0 shadow-md z-10">
            <div>
              {filtersValid && canAddData() && !isLeader && (
                <span className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-md border border-blue-200">
                  Adding students with: {selectedCourse} / {selectedBranch} /{" "}
                  {selectedYear}
                  {databaseLimits.topup_limit_available > 0 && (
                    <span className="ml-2 text-green-700 bg-green-100 px-1 py-0.5 rounded">
                      Topup: {databaseLimits.topup_limit_available} slots
                    </span>
                  )}
                </span>
              )}
              {!canAddData() && databaseLimits.registration_limit !== 0 && (
                <span className="text-xs text-red-800 bg-red-100 px-2 py-1 rounded-md border border-red-200">
                  {databaseLimits.students_hold > 0
                    ? `Registration limit reached. ${databaseLimits.students_hold} students on TDS hold. Contact your RM.`
                    : "Registration limit reached. Contact your RM for assistance."}
                </span>
              )}
              {isLeader && (
                <span className="text-xs text-amber-800 bg-amber-100 px-2 py-1 rounded-md border border-amber-200">
                  View-only access - Data modification is restricted for your
                  role.
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <motion.button
                className={getButtonClass(
                  "outlined",
                  isLoading ||
                    isSubmitting ||
                    !canAddData() ||
                    !filtersValid ||
                    isLeader
                )}
                onClick={clearData}
                disabled={
                  isLoading ||
                  isSubmitting ||
                  !canAddData() ||
                  !filtersValid ||
                  isLeader
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Reset Data
              </motion.button>
              <motion.button
                className={getButtonClass(
                  "contained",
                  isLoading ||
                    isSubmitting ||
                    !canAddData() ||
                    !filtersValid ||
                    isLeader
                )}
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  isSubmitting ||
                  !canAddData() ||
                  !filtersValid ||
                  isLeader
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Submit Data
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default NewMaterialExcelInterface;
