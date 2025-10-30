import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StaffService } from "../../services/dataService";
import FullScreenLoading from "./FullScreenLoading";
import { motion } from "framer-motion";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";
import DashboardCard from "./StatisticsCard";
import api from "../../services/api";

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

const MaterialExcelInterface = () => {
  // UI headers (display headers)
  const HEADERS = ["Email", "Name", "Branch", "Gender", "Passout Year"];

  // API headers (for submission)
  const API_HEADERS = ["mail_id", "name", "branch", "gender", "year"];

  // Define the absolute maximum rows that can be added at once
  const MAX_BATCH_ROWS = 500;

  // Database limits state
  const [databaseLimits, setDatabaseLimits] = useState({
    student_intake_data: 0,
    registration_limit: null,
    isLoading: true,
    error: null,
  });

  // Initial data with headers and empty rows
  const [rows, setRows] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  // Calculate remaining slots based on database limits
  const getRemainingSlots = () => {
    const { student_intake_data, registration_limit } = databaseLimits;

    if (registration_limit === null) {
      return Infinity; // Unlimited
    }

    if (registration_limit === 0) {
      return 0; // Cannot add data
    }

    return Math.max(0, registration_limit - student_intake_data);
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

  // Branch dropdown options and state
  const branchOptions = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
  ];
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isBranchFilled, setIsBranchFilled] = useState(false);

  // Year dropdown options and state
  const yearOptions = ["2022", "2023", "2024", "2025", "2026", "2027", "2028"];
  const [selectedYear, setSelectedYear] = useState("");
  const [isYearFilled, setIsYearFilled] = useState(false);

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

  // Fetch database limits on component mount
  useEffect(() => {
    fetchDatabaseLimits();
  }, []);

  // Function to fetch database limits
  const fetchDatabaseLimits = async () => {
    try {
      setDatabaseLimits((prev) => ({ ...prev, isLoading: true }));

      // Get access token from localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      // Call the API with authorization header
      const response = await api.get(
        `${BASE_URL}/internship/databaseLimits`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update state with the response data
      setDatabaseLimits({
        student_intake_data: response.data.student_intake_data || 0,
        registration_limit: response.data.registration_limit,
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
      toast.error("Failed to fetch database limits. Please refresh the page.");
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
      // Ignore if loading
      if (isLoading || isSubmitting) return;

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
  }, [historyIndex, history, isLoading, isSubmitting]);

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
    if (isLoading || isSubmitting) return;
    if (activeCell.row === -1 || activeCell.col === -1) return;

    // Check if user can add data
    if (getRemainingSlots() === 0) {
      e.preventDefault();
      toast.error("You cannot add data. Please contact your RM.");
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
        toast.warning("No text content found in clipboard.");
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
            return row.split(delimiter).map((cell) => cell || "");
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
              // Skip pasting to branch column if branch is selected
              const targetColIndex = activeCell.col + j;
              if (
                (targetColIndex === 2 && isBranchFilled) ||
                (targetColIndex === 4 && isYearFilled)
              ) {
                continue;
              }

              // Safely assign the cell value, ensuring it's a string
              const cellValue = dataToInsert[i][j];
              newRows[targetRowIndex][targetColIndex] =
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
              } rows and ${totalCellsPasted} cells of data${
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
    // Check if user can add data
    if (getRemainingSlots() === 0) {
      toast.error("You cannot add data. Please contact your RM.");
      return;
    }

    // Prevent editing if the column is auto-filled
    if (
      (colIndex === 2 && isBranchFilled) ||
      (colIndex === 4 && isYearFilled)
    ) {
      toast.info(
        `The ${HEADERS[colIndex]} column is auto-filled and cannot be edited individually.`
      );
      return;
    }

    setActiveCell({ row: rowIndex, col: colIndex });
  };

  // Handle cell content change
  const handleCellChange = (rowIndex, colIndex, value) => {
    // Check if user can add data
    if (getRemainingSlots() === 0) {
      return;
    }

    // Prevent editing if the column is auto-filled
    if (
      (colIndex === 2 && isBranchFilled) ||
      (colIndex === 4 && isYearFilled)
    ) {
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
    // Check if user can add data
    if (getRemainingSlots() === 0) {
      toast.error("You cannot add data. Please contact your RM.");
      return;
    }

    // Check if adding a row would exceed the maximum limit
    const maxRowsAllowed = getMaxRows();
    if (rows.length >= maxRowsAllowed) {
      toast.error(`Maximum row limit of ${maxRowsAllowed} reached.`);
      return;
    }

    const newRows = [...rows, Array(HEADERS.length).fill("")];

    // Apply auto-fill values to new row if enabled
    const lastIndex = newRows.length - 1;
    if (isBranchFilled) {
      newRows[lastIndex][2] = selectedBranch;
    }
    if (isYearFilled) {
      newRows[lastIndex][4] = selectedYear;
    }

    setRows(newRows);
    addToHistory(newRows);
  };

  // Delete the selected row
  const deleteRow = () => {
    if (activeCell.row === -1 || rows.length <= 1) return;

    const newRows = [...rows];
    newRows.splice(activeCell.row, 1);
    setRows(newRows);
    addToHistory(newRows);
    setActiveCell({ row: -1, col: -1 });
  };

  // Clear all data
  const clearData = () => {
    // When resetting, maintain the auto-fill for branch and year if selected
    const newRows = Array(3)
      .fill()
      .map(() => {
        const row = Array(HEADERS.length).fill("");
        if (isBranchFilled) row[2] = selectedBranch;
        if (isYearFilled) row[4] = selectedYear;
        return row;
      });

    setRows(newRows);
    addToHistory(newRows);
    setActiveCell({ row: -1, col: -1 });
  };

  // Fill branch column
  const fillBranchColumn = () => {
    if (isLoading || isSubmitting) return;

    if (!selectedBranch.trim()) {
      toast.warning("Please select a branch");
      return;
    }

    // Set loading state for large datasets
    if (rows.length > 50) {
      setIsLoading(true);
    }

    try {
      // Use setTimeout to allow the UI to update with loading state for large datasets
      setTimeout(
        () => {
          try {
            // Create a copy of the current rows
            const newRows = [...rows];

            // Fill the branch column (index 2) for all rows
            for (let i = 0; i < newRows.length; i++) {
              newRows[i][2] = selectedBranch;
            }

            setRows(newRows);
            addToHistory(newRows);

            // Mark branch column as auto-filled
            setIsBranchFilled(true);

            toast.success(`Branch column filled with "${selectedBranch}"`);
          } catch (err) {
            console.error("Error filling branch column:", err);
            toast.error("Error filling branch column");
          } finally {
            if (rows.length > 50) {
              setIsLoading(false);
            }
          }
        },
        rows.length > 50 ? 100 : 0
      );
    } catch (err) {
      console.error("Error in fill branch column operation:", err);
      toast.error("Error filling branch column");
      setIsLoading(false);
    }
  };

  // Fill year column
  const fillYearColumn = () => {
    if (isLoading || isSubmitting) return;

    if (!selectedYear.trim()) {
      toast.warning("Please select a passout year");
      return;
    }

    // Set loading state for large datasets
    if (rows.length > 50) {
      setIsLoading(true);
    }

    try {
      // Use setTimeout to allow the UI to update with loading state for large datasets
      setTimeout(
        () => {
          try {
            // Create a copy of the current rows
            const newRows = [...rows];

            // Fill the year column (index 4) for all rows
            for (let i = 0; i < newRows.length; i++) {
              newRows[i][4] = selectedYear;
            }

            setRows(newRows);
            addToHistory(newRows);

            // Mark year column as auto-filled
            setIsYearFilled(true);

            toast.success(`Passout Year column filled with "${selectedYear}"`);
          } catch (err) {
            console.error("Error filling year column:", err);
            toast.error("Error filling year column");
          } finally {
            if (rows.length > 50) {
              setIsLoading(false);
            }
          }
        },
        rows.length > 50 ? 100 : 0
      );
    } catch (err) {
      console.error("Error in fill year column operation:", err);
      toast.error("Error filling year column");
      setIsLoading(false);
    }
  };

  // Reset branch auto-fill
  const resetBranchFill = () => {
    if (isLoading || isSubmitting) return;

    setIsBranchFilled(false);
    setSelectedBranch("");

    // Create a copy of the current rows
    const newRows = [...rows];

    // Clear the branch column (index 2) for all rows
    for (let i = 0; i < newRows.length; i++) {
      newRows[i][2] = "";
    }

    setRows(newRows);
    addToHistory(newRows);

    toast.info("Branch column reset. You can now edit it manually.");
  };

  // Reset year auto-fill
  const resetYearFill = () => {
    if (isLoading || isSubmitting) return;

    setIsYearFilled(false);
    setSelectedYear("");

    // Create a copy of the current rows
    const newRows = [...rows];

    // Clear the year column (index 4) for all rows
    for (let i = 0; i < newRows.length; i++) {
      newRows[i][4] = "";
    }

    setRows(newRows);
    addToHistory(newRows);

    toast.info("Passout Year column reset. You can now edit it manually.");
  };

  // Convert data to CSV with API headers
  const convertToCSV = (dataRows) => {
    // Create CSV content with API headers instead of UI headers
    return [
      API_HEADERS.join(","),
      ...dataRows
        .filter((row) => row.some((cell) => cell.trim() !== ""))
        .map((row) =>
          row
            .map((cell) => {
              // Escape commas and quotes in cell content
              if (cell.includes(",") || cell.includes('"')) {
                return `"${cell.replace(/"/g, '""')}"`;
              }
              return cell;
            })
            .join(",")
        ),
    ].join("\n");
  };

  // Submit data
  const handleSubmit = async () => {
    // Check if user can add data
    if (getRemainingSlots() === 0) {
      toast.error("You cannot add data. Please contact your RM.");
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
      toast.success("Data submitted successfully!");

      // Show success message and refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Handle copy (Ctrl+C)
  const handleCopy = () => {
    if (activeCell.row === -1 || activeCell.col === -1) return;

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

  // Handle cut (Ctrl+X)
  const handleCut = () => {
    if (
      isLoading ||
      isSubmitting ||
      activeCell.row === -1 ||
      activeCell.col === -1
    )
      return;

    // Prevent cutting if the column is auto-filled
    if (
      (activeCell.col === 2 && isBranchFilled) ||
      (activeCell.col === 4 && isYearFilled)
    ) {
      toast.info(
        `The ${
          HEADERS[activeCell.col]
        } column is auto-filled and cannot be edited.`
      );
      return;
    }

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

    // Prevent editing if the column is auto-filled and the key would modify content
    if (
      (colIndex === 2 && isBranchFilled) ||
      (colIndex === 4 && isYearFilled)
    ) {
      // Still allow navigation keys
      if (
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(
          e.key
        )
      ) {
        e.preventDefault();
        return;
      }
    }

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
          rows.length < maxRowsAllowed
        ) {
          // Add new row when pressing down from the last row, if under the limit
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
          // Move backward
          if (colIndex > 0) {
            setActiveCell({ row: rowIndex, col: colIndex - 1 });
            cellRefs.current[rowIndex][colIndex - 1].current?.focus();
          } else if (rowIndex > 0) {
            setActiveCell({ row: rowIndex - 1, col: HEADERS.length - 1 });
            cellRefs.current[rowIndex - 1][HEADERS.length - 1].current?.focus();
          }
        } else {
          // Move forward
          if (colIndex < HEADERS.length - 1) {
            setActiveCell({ row: rowIndex, col: colIndex + 1 });
            cellRefs.current[rowIndex][colIndex + 1].current?.focus();
          } else if (rowIndex < rows.length - 1) {
            setActiveCell({ row: rowIndex + 1, col: 0 });
            cellRefs.current[rowIndex + 1][0].current?.focus();
          } else if (rows.length < maxRowsAllowed) {
            // Add new row when tabbing from the last cell if under the limit
            addRow();
            // Set timeout to allow the DOM to update before focusing
            setTimeout(() => {
              setActiveCell({ row: rows.length, col: 0 });
              cellRefs.current[rows.length]?.[0]?.current?.focus();
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
          } else if (rows.length < maxRowsAllowed) {
            // Add new row when pressing Enter from the last row if under the limit
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
    return !databaseLimits.isLoading && getRemainingSlots() > 0;
  };

  return (
    <div className="w-full mx-auto p-4 relative">
      {/* Add style tag for custom scrollbar */}
      <style>{scrollbarStyles}</style>

      {/* Registration Limits Dashboard */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3 text-left">
          Student Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Only show Approved Limit Card if registration_limit is not null */}
          {databaseLimits.registration_limit !== null && (
            <DashboardCard
              title="Approved"
              value={databaseLimits.registration_limit}
              showInfinitySymbol={databaseLimits.registration_limit === null}
              icon="approved"
              theme="blue"
              isLoading={databaseLimits.isLoading}
              error={databaseLimits.error}
            />
          )}

          {/* Used Limit Card - Always show */}
          <DashboardCard
            title="Used"
            value={databaseLimits.student_intake_data}
            icon="students"
            theme="blue"
            isLoading={databaseLimits.isLoading}
            error={databaseLimits.error}
          />

          {/* Only show Available Limit Card if registration_limit is not null */}
          {databaseLimits.registration_limit !== null && (
            <DashboardCard
              title="Available"
              value={
                getRemainingSlots() === Infinity ? null : getRemainingSlots()
              }
              showInfinitySymbol={getRemainingSlots() === Infinity}
              additionalInfo={getRemainingSlots() === 0 ? "Contact RM" : null}
              icon={getRemainingSlots() === 0 ? "warning" : "task"}
              theme="blue"
              usedValue={databaseLimits.student_intake_data}
              totalValue={databaseLimits.registration_limit}
              percentage={
                databaseLimits.registration_limit === null
                  ? null
                  : Math.min(
                      100,
                      Math.round(
                        (databaseLimits.student_intake_data /
                          databaseLimits.registration_limit) *
                          100
                      )
                    )
              }
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
                Enter data or paste directly from Excel. Headers are fixed and
                won't be affected.
              </p>
            </div>
            <div className="flex space-x-2"></div>
          </div>

          {/* Data Stats Bar */}
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
            <div className="text-sm flex space-x-4">
              <span className="font-semibold text-blue-800">
                Current Rows: {getDataStats().totalRows}
              </span>
              <span className="font-medium text-gray-600">
                (Max {MAX_BATCH_ROWS} rows are allowed)
              </span>
            </div>
          </div>

          {/* Branch and Year Fill Section - More Compact Layout */}
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Dropdown */}
              <div className="flex items-center">
                <label
                  htmlFor="branchSelect"
                  className="text-xs font-medium text-blue-800 mr-2"
                >
                  Branch:
                </label>
                <select
                  id="branchSelect"
                  className={`px-2 py-1 border ${
                    isBranchFilled
                      ? "bg-blue-100 border-blue-400"
                      : "border-blue-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs`}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={isLoading || isSubmitting || !canAddData()}
                >
                  <option value="">Select</option>
                  {branchOptions.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {!isBranchFilled ? (
                  <motion.button
                    className={`ml-2 ${getButtonClass(
                      "contained",
                      isLoading ||
                        isSubmitting ||
                        !selectedBranch.trim() ||
                        !canAddData()
                    )}`}
                    onClick={fillBranchColumn}
                    disabled={
                      isLoading ||
                      isSubmitting ||
                      !selectedBranch.trim() ||
                      !canAddData()
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Fill Column
                  </motion.button>
                ) : (
                  <motion.button
                    className={`ml-2 ${getButtonClass(
                      "warning",
                      isLoading || isSubmitting || !canAddData()
                    )}`}
                    onClick={resetBranchFill}
                    disabled={isLoading || isSubmitting || !canAddData()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Reset
                  </motion.button>
                )}
                {isBranchFilled && (
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                    Auto-filled
                  </span>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="flex items-center ml-4">
                <label
                  htmlFor="yearSelect"
                  className="text-xs font-medium text-blue-800 mr-2"
                >
                  Passout Year:
                </label>
                <select
                  id="yearSelect"
                  className={`px-2 py-1 border ${
                    isYearFilled
                      ? "bg-blue-100 border-blue-400"
                      : "border-blue-300"
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs`}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={isLoading || isSubmitting || !canAddData()}
                >
                  <option value="">Select</option>
                  {yearOptions.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {!isYearFilled ? (
                  <motion.button
                    className={`ml-2 ${getButtonClass(
                      "contained",
                      isLoading ||
                        isSubmitting ||
                        !selectedYear.trim() ||
                        !canAddData()
                    )}`}
                    onClick={fillYearColumn}
                    disabled={
                      isLoading ||
                      isSubmitting ||
                      !selectedYear.trim() ||
                      !canAddData()
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Fill Column
                  </motion.button>
                ) : (
                  <motion.button
                    className={`ml-2 ${getButtonClass(
                      "warning",
                      isLoading || isSubmitting || !canAddData()
                    )}`}
                    onClick={resetYearFill}
                    disabled={isLoading || isSubmitting || !canAddData()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Reset
                  </motion.button>
                )}
                {isYearFilled && (
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                    Auto-filled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content with Custom Scrollbar */}
        <div
          className="px-6 py-4 h-96 overflow-y-auto custom-scrollbar relative"
          onPaste={handlePaste}
        >
          {/* Zero limit message */}
          {databaseLimits.registration_limit === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-40">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-red-500 mx-auto mb-4"
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
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Registration Limit Reached
                </h3>
                <p className="text-red-600 mb-4">
                  You cannot add any more students. Please contact your
                  Relationship Manager for assistance.
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
                      className={`px-4 py-3 text-left font-medium border-r border-blue-500 last:border-r-0 ${
                        (index === 2 && isBranchFilled) ||
                        (index === 4 && isYearFilled)
                          ? "prefilled-header"
                          : ""
                      }`}
                    >
                      {header}
                      {(index === 2 && isBranchFilled) ||
                      (index === 4 && isYearFilled) ? (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                          Auto-filled
                        </span>
                      ) : null}
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
                        } ${
                          (colIndex === 2 && isBranchFilled) ||
                          (colIndex === 4 && isYearFilled)
                            ? "prefilled-cell"
                            : ""
                        }`}
                        style={{ outline: "none" }}
                      >
                        <div
                          ref={cellRefs.current[rowIndex]?.[colIndex] ?? null}
                          contentEditable={
                            canAddData() &&
                            !isLoading &&
                            !isSubmitting &&
                            !(colIndex === 2 && isBranchFilled) &&
                            !(colIndex === 4 && isYearFilled)
                          }
                          suppressContentEditableWarning={true}
                          className={`outline-none min-h-8 focus:outline-none ${
                            (colIndex === 2 && isBranchFilled) ||
                            (colIndex === 4 && isYearFilled)
                              ? "text-blue-700"
                              : ""
                          } ${!canAddData() ? "opacity-70" : ""}`}
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
                            !canAddData() ||
                            (colIndex === 2 && isBranchFilled) ||
                            (colIndex === 4 && isYearFilled)
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
              <li>Click on any cell to edit or select it</li>
              <li>Press Tab to move between cells</li>
              <li>Select a cell and paste (Ctrl+V/Cmd+V) to import data</li>
              <li>Use Ctrl+Z/Cmd+Z to undo and Ctrl+Y/Cmd+Y to redo</li>
              <li>
                Use Ctrl+C/Cmd+C to copy and Ctrl+X/Cmd+X to cut cell content
              </li>
              <li>Headers are fixed and won't be overwritten when pasting</li>
              <li>Use arrow keys to navigate between cells</li>
              <li>Press Enter to move to the next row</li>
              <li className="text-blue-700 font-medium">
                Auto-filled columns cannot be edited manually
              </li>
              <li className="text-blue-700 font-medium">
                Use the Reset button to clear auto-filled columns
              </li>
              {!canAddData() && databaseLimits.registration_limit !== 0 && (
                <li className="text-red-600 font-medium">
                  You have reached your registration limit and cannot add more
                  students
                </li>
              )}
              {databaseLimits.registration_limit === 0 && (
                <li className="text-red-600 font-medium">
                  Registration is currently closed. Please contact your RM.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Fixed Submit Button Footer */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex justify-end space-x-2 sticky bottom-0 left-0 right-0 shadow-md z-10">
          <motion.button
            className={getButtonClass(
              "outlined",
              isLoading || isSubmitting || !canAddData()
            )}
            onClick={clearData}
            disabled={isLoading || isSubmitting || !canAddData()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Reset
          </motion.button>
          <motion.button
            className={getButtonClass(
              "contained",
              isLoading || isSubmitting || !canAddData()
            )}
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting || !canAddData()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Submit Data
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MaterialExcelInterface;
