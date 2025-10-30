import { FileText, Upload, X, File, Trash2, Eye, Download } from "lucide-react";
import { useState } from "react";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

const PlacementSupportingDocuments = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onRefreshFiles, // Add this prop to trigger file refresh from parent
}) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [deletingFiles, setDeletingFiles] = useState({});

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const currentValues = formData[name] || [];

    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value),
    }));

    // If unchecking, remove the associated file
    if (!checked) {
      const fileFieldMap = {
        hrRecommendation: "hrRecommendationFile",
        placementBrochure: "placementBrochureFile",
        testimonials: "testimonialsFile",
        photographs: "photographsFile",
        pressCoverage: "pressCoverageFile",
        certificates: "certificatesFile",
        mouPartnership: "mouPartnershipFile",
        other: "otherDocumentsFile",
      };

      const fileField = fileFieldMap[value];
      if (fileField) {
        setFormData((prev) => ({
          ...prev,
          [fileField]: null,
        }));
        // Clear the file input
        const fileInput = document.getElementById(fileField);
        if (fileInput) {
          fileInput.value = "";
        }
      }
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is PDF
    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files");
      e.target.value = "";
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      e.target.value = "";
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    try {
      const uploadFormData = new FormData();
      uploadFormData.append(fieldName, file);
      uploadFormData.append("category_id", formData.category_id);
      uploadFormData.append("leader_id", formData.leader_id);

      const response = await api.post(
        `${BASE_URL}/internship/nomination/tpo-nominations/files`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [fieldName]: percentCompleted,
            }));
          },
        }
      );

      if (response.status === 200 && response.data) {
        // Store the file info from API response
        setFormData((prev) => ({
          ...prev,
          [fieldName]: {
            filename: response.data.filename,
            link: response.data.link,
            originalFile: file, // Keep reference to original file for display
          },
        }));

        // Automatically add to supportingDocuments array if not already there
        const docType = documentTypes.find(
          (doc) => doc.fileField === fieldName
        );
        if (docType && !formData.supportingDocuments?.includes(docType.value)) {
          setFormData((prev) => ({
            ...prev,
            supportingDocuments: [
              ...(prev.supportingDocuments || []),
              docType.value,
            ],
          }));
        }

        console.log(
          `File uploaded successfully for ${fieldName}:`,
          response.data
        );

        // Refresh files from server after successful upload
        if (onRefreshFiles && typeof onRefreshFiles === "function") {
          await onRefreshFiles();
        }
      }
    } catch (error) {
      console.error(`Error uploading file for ${fieldName}:`, error);
      alert("Failed to upload file. Please try again.");
      e.target.value = "";
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));
    }
  };

  const handleFileDelete = async (fieldName) => {
    const fileData = formData[fieldName];
    if (!fileData || !fileData.filename) return;

    setDeletingFiles((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const deleteResponse = await api.delete(
        `${BASE_URL}/internship/nomination/tpo-nominations/files`,
        {
          data: {
            filename: fileData.filename,
            key: fieldName,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.status === 200) {
        // Remove file from form data
        setFormData((prev) => ({
          ...prev,
          [fieldName]: null,
        }));

        // Clear the file input
        const fileInput = document.getElementById(fieldName);
        if (fileInput) {
          fileInput.value = "";
        }

        // Remove from supportingDocuments array as well
        const docType = documentTypes.find(
          (doc) => doc.fileField === fieldName
        );
        if (docType) {
          setFormData((prev) => ({
            ...prev,
            supportingDocuments:
              prev.supportingDocuments?.filter(
                (doc) => doc !== docType.value
              ) || [],
          }));
        }

        console.log(`File deleted successfully for ${fieldName}`);

        // Refresh files from server after successful deletion
        if (onRefreshFiles && typeof onRefreshFiles === "function") {
          await onRefreshFiles();
        }
      }
    } catch (error) {
      console.error(`Error deleting file for ${fieldName}:`, error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setDeletingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const documentTypes = [
    {
      value: "hrRecommendation",
      label: "Letter of Recommendation by HR",
      fileField: "hrRecommendationFile",
    },
    {
      value: "placementBrochure",
      label: "Placement Brochure (PDF)",
      fileField: "placementBrochureFile",
    },
    {
      value: "testimonials",
      label: "Student Testimonials / Success Stories",
      fileField: "testimonialsFile",
    },
    {
      value: "photographs",
      label: "Photographs / Screenshots of Placement Drives, Fairs, Events",
      fileField: "photographsFile",
    },
    {
      value: "pressCoverage",
      label: "Press Coverage / Media Links (if any)",
      fileField: "pressCoverageFile",
    },
    {
      value: "certificates",
      label: "Certificate of Appreciation / Previous Awards (if applicable)",
      fileField: "certificatesFile",
    },
    {
      value: "mouPartnership",
      label: "Any Recognized MoU or Partnership Letter with Employers",
      fileField: "mouPartnershipFile",
    },
    {
      value: "other",
      label: "Other Documents (Additional supporting materials)",
      fileField: "otherDocumentsFile",
    },
  ];

  const isDocumentSelected = (docValue) => {
    return formData.supportingDocuments?.includes(docValue) || false;
  };

  const renderFileUploadArea = (doc) => {
    const fileData = formData[doc.fileField];
    const isUploading = uploadingFiles[doc.fileField];
    const progress = uploadProgress[doc.fileField] || 0;
    const isDeleting = deletingFiles[doc.fileField];

    // If file is already uploaded, show the file info
    if (fileData) {
      return (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="flex items-center flex-1 min-w-0">
            <File className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-green-900 truncate">
                {fileData.filename ||
                  (fileData.originalFile && fileData.originalFile.name) ||
                  "Uploaded file"}
              </p>
              {fileData.originalFile && (
                <p className="text-xs text-green-600">
                  {formatFileSize(fileData.originalFile.size)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              type="button"
              onClick={() => handleFileDelete(doc.fileField)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
              title="Delete file"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      );
    }

    // If not selected via checkbox, show selection prompt
    if (!isDocumentSelected(doc.value)) {
      return (
        <span className="text-sm text-gray-400 italic">
          Select document type first
        </span>
      );
    }

    // Show upload progress
    if (isUploading) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              Uploading...
            </span>
            <span className="text-sm text-blue-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    }

    // Show upload area
    return (
      <div className="relative">
        <input
          type="file"
          id={doc.fileField}
          accept=".pdf"
          onChange={(e) => handleFileUpload(e, doc.fileField)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors duration-200">
          <div className="text-center">
            <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500">PDF, max 2MB</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">
            Section D: Supporting Documents
          </h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Please select which supporting documents you want to upload, then
          upload the PDF files (all uploads are optional):
        </p>

        {/* File Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            File Requirements:
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Each section accepts only one attachment</li>
            <li>
              • If you have multiple files for a single category, please merge
              them into one file and upload it
            </li>
            <li>• The one PDF file size must not exceed 2MB</li>
          </ul>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Document Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b min-w-[300px]">
                  Upload File
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentTypes.map((doc) => (
                <tr key={doc.value} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {!formData[doc.fileField] ? (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="supportingDocuments"
                          value={doc.value}
                          checked={isDocumentSelected(doc.value)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                          Uploaded
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">
                      {doc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">{renderFileUploadArea(doc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlacementSupportingDocuments;
