import React, { useState } from 'react';
import { FiActivity } from 'react-icons/fi';
import { FaCertificate, FaCodeBranch, FaAward, FaArrowRight } from 'react-icons/fa';
import { MdOutlineChecklist } from 'react-icons/md';
import { GiCheckMark } from 'react-icons/gi';

const DashBoard = () => {

    const cardData = [
        { name: 'Tech Camp', certificates: 30, versions: 5, issued: 2 },
        { name: 'FDP', certificates: 25, versions: 3, issued: 1 },
        { name: 'Final Certificate', certificates: 30, versions: 4, issued: 0 },
        { name: 'Orientation Program', certificates: 10, versions: 1, issued: 0 },
        { name: 'Internship', certificates: 12, versions: 2, issued: 1 }
    ];

    /* Pagination */
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(cardData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentCards = cardData.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    const handleRowsChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* TOP CARDS */}
            <div className="grid grid-cols-4 gap-6 mb-8">

                <div className="bg-white shadow rounded p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-semibold">Activities</p>
                        <p className="text-2xl font-bold mt-2">120</p>
                    </div>
                    <FiActivity className="text-blue-500 text-4xl" />
                </div>

                <div className="bg-white shadow rounded p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-semibold">Certificates</p>
                        <p className="text-2xl font-bold mt-2">85</p>
                    </div>
                    <FaCertificate className="text-green-500 text-4xl" />
                </div>

                <div className="bg-white shadow rounded p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-semibold">Total Issued</p>
                        <p className="text-2xl font-bold mt-2">15</p>
                    </div>
                    <GiCheckMark className="text-purple-500 text-4xl" />
                </div>

                <div className="bg-white shadow rounded p-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-semibold">Active Versions</p>
                        <p className="text-2xl font-bold mt-2">42</p>
                    </div>
                    <FaCodeBranch className="text-yellow-500 text-4xl" />
                </div>
            </div>

            {/* MAIN CARD LIST */}
            <div className="bg-white shadow rounded p-6">

                <h2 className="text-xl font-bold mb-6">
                    Activity-wise Certificate Issue Count
                </h2>

                <div className="flex flex-col gap-4 mb-4">
                    {currentCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 shadow rounded p-4 flex items-center justify-between w-full hover:shadow-lg transition"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                <FaAward className="text-yellow-500 text-4xl" />

                                <div>
                                    <p className="text-gray-700 font-semibold">{card.name}</p>

                                    <div className="flex items-center gap-6 mt-2">
                                        <div className="flex items-center gap-2">
                                            <FaCertificate className="text-green-500" />
                                            <span className="text-gray-600 font-medium">
                                                Certificates: {card.certificates}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MdOutlineChecklist className="text-blue-500" />
                                            <span className="text-gray-600 font-medium">
                                                Versions: {card.versions}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-1 text-purple-600 font-semibold cursor-pointer hover:text-purple-800">
                                <span>Issued: {card.issued}</span>
                                <FaArrowRight />
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAGINATION (same as Activities screen) */}
                <div className="flex justify-between items-center mt-6 bg-white p-4 rounded shadow">

                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
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
                            onChange={handleRowsChange}
                            className="border rounded px-2 py-1"
                        >
                            <option value="2">2</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>

                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DashBoard;
