import React, { useState, useEffect, useRef } from "react";
import {
    MoreVertical,
    FileSearch,
    FileEdit,
    Trash,
    Layers,
    FileText,
    Hash,
    Cog
} from "lucide-react";
import CreateVersionModal from "./CreateVersionModal";
import { useNavigate } from "react-router-dom";

const ViewCertificateVersions = ({ certificate, activityName, token, onBack, onVersionCreated }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(null);
    const [versionData, setVersionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateVersion, setShowCreateVersion] = useState(false);
    const [message, setMessage] = useState("");   // ✅ SUCCESS / ERROR MESSAGES
    const menuRef = useRef(null);

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/admin/certificate-versions/${certificate.certificate_id}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    }
                );
                const data = await res.json();

                setVersionData({
                    certificate_id: data.certificate_id,
                    certificate_name: data.certificate_name,
                    activity_name: data.activity_name,
                    versions: Array.isArray(data.versions) ? data.versions : [],
                });

            } catch (err) {
                console.error("Error fetching versions", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVersions();
    }, [certificate, token]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!versionData) return <div className="p-6">No version data found.</div>;

    const addTwoMonths = (dateStr) => {
        const date = new Date(dateStr);
        date.setMonth(date.getMonth() + 2);
        return date.toISOString().split("T")[0];
    };

    // ---------------------------------------------------------
    // 🔥 DELETE VERSION
    // ---------------------------------------------------------
    const deleteVersion = async (versionId) => {
        if (!window.confirm("Are you sure you want to delete this version?")) return;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/admin/certificate-templates/${versionId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) throw new Error("Failed to delete version.");

            setMessage("Version deleted successfully!");
            setVersionData((prev) => ({
                ...prev,
                versions: prev.versions.filter(v => v.version_id !== versionId)
            }));

            setMenuOpen(null);
            setTimeout(() => setMessage(""), 2000);
        } catch (error) {
            setMessage("Error deleting version!");
            setTimeout(() => setMessage(""), 2000);
        }
    };

    // ---------------------------------------------------------
    // ⭐ Preview Certificate
    // ---------------------------------------------------------
    const handlePreview = (version) => {
        window.open(`/admin/cert-preview/${version.version_id}`, "_blank");
    };

    // ---------------------------------------------------------
    // ⭐ Edit Template
    // ---------------------------------------------------------
    const handleEditTemplate = (certificate, version) => {
        const certificateId = certificate.certificate_id;
        const versionId = version.version_id;

        navigate(`/admin/cert-editor/${certificateId}/${versionId}`);
    };

    return (
        <div className="p-6">
            {message && (
                <div className="mb-4 p-3 text-white bg-green-600 rounded-lg shadow">
                    {message}
                </div>
            )}

            <button
                onClick={onBack}
                className="mb-4 bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300 transition"
            >
                ← Back
            </button>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowCreateVersion(true)}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
                >
                    + Create Version
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500 flex items-center gap-4">
                    <Layers size={28} className="text-blue-600" />
                    <div>
                        <p className="text-gray-500 text-sm">Activity</p>
                        <p className="text-xl font-semibold">{activityName}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-purple-500 flex items-center gap-4">
                    <FileText size={28} className="text-purple-600" />
                    <div>
                        <p className="text-gray-500 text-sm">Certificate Name</p>
                        <p className="text-xl font-semibold">{versionData.certificate_name}</p>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-xl p-5 border-l-4 border-green-500 flex items-center gap-4">
                    <Hash size={28} className="text-green-600" />
                    <div>
                        <p className="text-gray-500 text-sm">Total Versions</p>
                        <p className="text-xl font-semibold">
                            {versionData.versions.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Versions Table */}
            <table className="w-full bg-white shadow-md rounded-lg overflow-visible">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="p-3 text-left">Orientation</th>
                        <th className="p-3 text-left">Issue Date</th>
                        <th className="p-3 text-left">Validity Date</th>
                        <th className="p-3 text-left">Variables</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {versionData.versions.map((v, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition">
                            <td className="p-3">{v.orientation === "horizontal" ? "Landscape" : "Portrait"}</td>
                            <td className="p-3">{v.issue_date}</td>
                            <td className="p-3">{v.validity_date || addTwoMonths(v.issue_date)}</td>
                            <td className="p-3">{v.variables.join(", ")}</td>
                            <td className="p-3">
                                <span className={`px-3 py-1 text-white rounded text-sm ${v.is_active ? "bg-green-600" : "bg-gray-500"}`}>
                                    {v.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="p-3 relative">
                                <button onClick={() => setMenuOpen(menuOpen === index ? null : index)} className="hover:text-blue-600">
                                    <MoreVertical size={20} />
                                </button>

                                {menuOpen === index && (
                                    <div ref={menuRef} className="absolute right-10 bg-white shadow-xl rounded-md p-2 w-48 z-[99999] border">
                                        <button onClick={() => handlePreview(v)} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <FileSearch size={16} /> Preview Certificate
                                        </button>

                                        <button onClick={() => handleEditTemplate(certificate, v)} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <FileEdit size={16} /> Edit Template
                                        </button>

                                        <button className="flex items-center gap-2 p-2 hover:bg-gray-100">
                                            <Cog size={16} /> Edit Template Details
                                        </button>

                                        <button onClick={() => deleteVersion(v.version_id)} className="flex items-center gap-2 p-2 hover:bg-gray-100 text-red-600">
                                            <Trash size={16} /> Delete Certificate
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Create Version Modal */}
            {showCreateVersion && (
                <CreateVersionModal
                    certificateId={certificate.certificate_id}
                    certificateName={certificate.certificate_name}
                    token={token}
                    onClose={() => setShowCreateVersion(false)}
                    onCreated={(versionId) => {
                        onVersionCreated(versionId, certificate.certificate_name);
                    }}
                />
            )}
        </div>
    );
};

export default ViewCertificateVersions;
