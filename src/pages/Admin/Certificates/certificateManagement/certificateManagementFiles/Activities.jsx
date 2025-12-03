import React, { useState, useEffect } from "react";
import { FaAward, FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { BASE_URL } from "../../../../../services/configUrls";

const Activities = ({ onCreate, onViewCertificates, token }) => {
    const [activities, setActivities] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchActivities = async () => {
        try {
            const response = await fetch(`${BASE_URL}/admin/activities-details`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const totalPages = Math.ceil(activities.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage;
    const visibleCards = activities.slice(start, start + rowsPerPage);

    return (
        <div className="p-6">

            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold">Activities</h1>

                <button
                    onClick={onCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Create Activity
                </button>
            </div>

            {activities.length === 0 && (
                <div className="mt-20 flex flex-col items-center text-center">
                    <FaAward className="text-gray-300 text-7xl mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">
                        No Activities Found
                    </h2>
                    <p className="text-gray-500 mt-2 mb-4 max-w-md">
                        Start by creating your first activity.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {visibleCards.map((activity) => (
                    <div
                        key={activity.activity_id}
                        className="bg-white rounded shadow p-4 flex justify-between"
                    >
                        <div className="flex items-start gap-4">
                            <FaAward className="text-yellow-500 text-4xl" />

                            <div>
                                <p className="font-semibold">{activity.activity_name}</p>

                                <div className="flex gap-6 mt-1 text-gray-600">
                                    <span>{activity.certificates_count} Certificates</span>

                                    <span className="flex items-center gap-1">
                                        <MdCalendarToday /> {activity.created_date}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onViewCertificates(activity)}   // pass entire activity object
                                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"
                            >
                                View Certificates <FaArrowRight />
                            </button>

                            <button className="text-gray-500">
                                <FaEdit />
                            </button>

                            <button className="text-gray-500">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {activities.length > 0 && (
                <div className="bg-white p-4 rounded shadow mt-6 flex justify-between">
                    <div>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 ml-2"
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
                            <option value={3}>3</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>

                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activities;
