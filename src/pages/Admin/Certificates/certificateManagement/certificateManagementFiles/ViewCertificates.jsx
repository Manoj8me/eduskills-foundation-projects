import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { BASE_URL } from "../../../../../services/configUrls";

const ViewCertificates = ({ activity, onBack, onViewVersions, token }) => {
    const [certificates, setCertificates] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    // -----------------------------
    // FETCH CERTIFICATES
    // -----------------------------
    const fetchCertificates = async () => {
        try {
            const response = await fetch(
                `${BASE_URL}/admin/certificates/${activity.activity_id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            setCertificates(data);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    // -----------------------------
    // PAGINATION
    // -----------------------------
    const totalPages = Math.ceil(certificates.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = certificates.slice(startIndex, startIndex + rowsPerPage);

    // -----------------------------
    // FETCH VERSIONS + SEND TO PARENT
    // -----------------------------
    const handleViewVersions = async (cert) => {
    try {
        const response = await fetch(
            `${BASE_URL}/admin/certificate-versions/${cert.certificate_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        // Send ALL DATA to parent correctly
        onViewVersions(data);

    } catch (error) {
        console.error("Error fetching certificate versions:", error);
    }
};


    return (
        <div className="p-6">

            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
                ← Back
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Certificates in {activity.activity_name}
            </h2>

            <table className="w-full bg-white shadow-lg rounded overflow-hidden">
                <thead className="bg-indigo-600 text-white">
                    <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Versions</th>
                        <th className="p-3">Created</th>
                        <th className="p-3">View</th>
                    </tr>
                </thead>

                <tbody>
                    {currentRows.map((c) => (
                        <tr key={c.certificate_id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{c.certificate_name}</td>
                            <td className="p-3">{c.versions_count}</td>
                            <td className="p-3">{c.created_date}</td>

                            <td className="p-3">
                                <button
                                    onClick={() => handleViewVersions(c)}
                                    className="text-blue-600 hover:text-blue-800 transition"
                                >
                                    <Eye size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 bg-white p-4 rounded shadow">

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span>Rows per page:</span>

                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1"
                    >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                    </select>

                    <span>Page {currentPage} of {totalPages}</span>
                </div>

            </div>

        </div>
    );
};

export default ViewCertificates;
