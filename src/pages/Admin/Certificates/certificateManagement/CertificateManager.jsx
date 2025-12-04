import React, { useState } from "react";

import DashBoard from "./certificateManagementFiles/DashBoard";
import Activities from "./certificateManagementFiles/Activities";
import ViewCertificates from "./certificateManagementFiles/ViewCertificates";
import ViewCertificateVersions from "./certificateManagementFiles/ViewCertificateVersions";
import CertificateForm from "./certificateManagementFiles/CertificateForm";
import { useNavigate } from "react-router-dom";

const CertificateManager = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const token = localStorage.getItem("accessToken");

  const [activityScreen, setActivityScreen] = useState("list"); // list | certificates | versions | form
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
const [selectedVersionData, setSelectedVersionData] = useState(null);
  // Dashboard cards
  const [cards, setCards] = useState([]);

  const handleCreateCertificate = (newCard) => {
    setCards((prev) => [newCard, ...prev]);
    setActivityScreen("list");
  };
const handleViewVersions = (data) => {
    setSelectedVersionData(data);
};
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ------------------ PAGE TABS ------------------ */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => {
            setActiveTab("dashboard");
            setActivityScreen("list");
          }}
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-700"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            setActiveTab("activities");
            setActivityScreen("list");
          }}
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "activities"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-700"
          }`}
        >
          Activities
        </button>
      </div>

      {/* ------------------ DASHBOARD ------------------ */}
      {activeTab === "dashboard" && <DashBoard cards={cards} />}

      {/* ------------------ ACTIVITIES TAB ------------------ */}
      {activeTab === "activities" && activityScreen === "list" && (
        <Activities
          onCreate={() => setActivityScreen("form")}
          onViewCertificates={(activity) => {
            setSelectedActivity(activity);
            setActivityScreen("certificates");
          }}
          token={token}
        />
      )}

      {/* ------------------ CREATE CERTIFICATE FORM ------------------ */}
      {activeTab === "activities" && activityScreen === "form" && (
        <CertificateForm
          onCancel={() => setActivityScreen("list")}
          onCreateDone={handleCreateCertificate}
          token={token}
        />
      )}

      {/* ------------------ CERTIFICATES SCREEN ------------------ */}
      {activityScreen === "certificates" && (
    <ViewCertificates
        activity={selectedActivity}
        onBack={() => setActivityScreen("list")}
        onViewVersions={(certificate) => {
            setSelectedCertificate(certificate);
            setActivityScreen("versions");
        }}
        token={token}
    />
)}


      {/* ------------------ VERSION SCREEN ------------------ */}
      {activeTab === "activities" && activityScreen === "versions" && (
        <ViewCertificateVersions
  activityName={selectedActivity?.activity_name}
  certificate={selectedCertificate}
  onBack={() => setActivityScreen("certificates")}
          token={token}
          versionData={selectedVersionData}
  onVersionCreated={(versionId, certificateName) => {
    navigate(
      `/certificate-canvas?version_id=${versionId}&certificateName=${certificateName}`
    );
  }}
/>

      )}
    </div>
  );
};

export default CertificateManager;
