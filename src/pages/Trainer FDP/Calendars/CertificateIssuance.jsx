import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";


const CertificateIssuance = ({
  bookslotId,
  eligibleStudents,
  onSuccess,
  onError,
}) => {
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [issuingCertificates, setIssuingCertificates] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Create axios instance with default config
  const api = axios.create({
    baseURL: "",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle student selection
  const handleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
    setSelectAll(
      newSelected.size === eligibleStudents.length &&
        eligibleStudents.length > 0
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents(new Set());
      setSelectAll(false);
    } else {
      const eligibleIds = new Set(
        eligibleStudents.map((student) => student.student_id)
      );
      setSelectedStudents(eligibleIds);
      setSelectAll(true);
    }
  };

  // Open confirmation modal
  const handleOpenConfirmModal = () => {
    if (selectedStudents.size === 0) {
      alert("Please select at least one student to issue certificates");
      return;
    }
    setShowConfirmModal(true);
  };

  // Issue certificates
  const handleIssueCertificates = async () => {
    try {
      setIssuingCertificates(true);
      const payload = {
        bookslot_id: bookslotId,
        student_ids: Array.from(selectedStudents),
      };

      await api.post(`${BASE_URL}/event/update-eligibility`, payload);

      setShowConfirmModal(false);
      setSelectedStudents(new Set());
      setSelectAll(false);

      if (onSuccess) {
        onSuccess(selectedStudents.size);
      }
    } catch (error) {
      console.error("Error issuing certificates:", error);
      const errorMessage =
        error.response?.data?.detail || "Failed to issue certificates";

      setShowConfirmModal(false);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIssuingCertificates(false);
    }
  };

  return (
    <>
      {/* Certificate Issuance Section */}
      <div className="bg-green-50 border border-green-200 rounded p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-green-800">
                Certificate Issuance
              </div>
              <div className="text-xs text-green-700">
                {selectedStudents.size} of {eligibleStudents.length} eligible
                students selected
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="bg-white border border-green-300 text-green-700 px-3 py-1.5 rounded font-medium transition-all duration-200 hover:bg-green-50 text-xs"
            >
              {selectAll ? "Deselect All" : "Select All"}
            </button>
            <button
              onClick={handleOpenConfirmModal}
              disabled={selectedStudents.size === 0 || issuingCertificates}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Issue Certificates ({selectedStudents.size})
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
                Confirm Certificate Issuance
              </h3>

              <p className="text-sm text-slate-600 text-center mb-6">
                You are about to issue certificates to{" "}
                <span className="font-semibold text-green-600">
                  {selectedStudents.size}
                </span>{" "}
                {selectedStudents.size === 1 ? "student" : "students"}. This
                action will mark them as eligible for certificate generation.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-xs font-semibold text-amber-800">
                      Please Confirm
                    </h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Make sure you have verified that these students have
                      successfully completed the event and meet all requirements
                      for certification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={issuingCertificates}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIssueCertificates}
                  disabled={issuingCertificates}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none font-medium flex items-center justify-center gap-2"
                >
                  {issuingCertificates ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Issuing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Confirm & Issue
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateIssuance;
