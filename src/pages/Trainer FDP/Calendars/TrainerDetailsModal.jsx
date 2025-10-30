import React from "react";

const TrainerDetailsModal = ({
  isOpen,
  onClose,
  trainersForDate,
  selectedDate,
}) => {
  if (!isOpen) return null;

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "Invalid Date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  // Check if slot has ended
  const isSlotEnded = (toDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const toDate = new Date(toDateStr);
    toDate.setHours(0, 0, 0, 0);
    return toDate < today;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Available Trainers
            </h2>
            <p className="text-green-50 text-sm mt-1">
              {selectedDate ? formatDateDisplay(selectedDate) : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {trainersForDate && trainersForDate.length > 0 ? (
            <div className="space-y-4">
              {trainersForDate.map((trainer, index) => {
                const slotEnded = isSlotEnded(trainer.to_date);

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-5 transition-all duration-200 ${
                      slotEnded
                        ? "border-gray-300 bg-gradient-to-br from-gray-50 to-white opacity-75"
                        : "border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                              slotEnded
                                ? "bg-gradient-to-br from-gray-400 to-gray-500"
                                : "bg-gradient-to-br from-green-500 to-green-600"
                            }`}
                          >
                            {trainer.fullname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">
                              {trainer.fullname}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  slotEnded
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                Slot #{trainer.slot_id}
                              </span>
                              {slotEnded && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Slot Ended
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 ${
                            slotEnded ? "text-gray-600" : "text-green-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Email
                          </div>
                          <div className="text-sm text-slate-800">
                            {trainer.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 ${
                            slotEnded ? "text-gray-600" : "text-green-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <div className="text-xs text-slate-500 font-medium">
                            Mobile
                          </div>
                          <div className="text-sm text-slate-800">
                            {trainer.mobile_number}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`rounded-lg p-4 border ${
                        slotEnded
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-green-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <svg
                          className={`w-5 h-5 ${
                            slotEnded ? "text-gray-600" : "text-green-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-slate-700">
                          Available Period
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-800">
                        <span className="font-medium">
                          {formatDateDisplay(trainer.from_date)}
                        </span>
                        <svg
                          className="w-4 h-4 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <span className="font-medium">
                          {formatDateDisplay(trainer.to_date)}
                        </span>
                      </div>
                    </div>

                    {/* Booking status */}
                    {slotEnded ? (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 text-sm">
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
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">
                            This slot has ended and is not available for booking
                          </span>
                        </div>
                      </div>
                    ) : trainer.booked_details &&
                      trainer.booked_details.length > 0 ? (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-800 text-sm">
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">
                            Has {trainer.booked_details.length} booking(s) in
                            this period
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 text-sm">
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
                          <span className="font-medium">
                            Fully available for booking
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-slate-500 text-lg">
                No trainers available for this date
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-br from-slate-600 to-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-500/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsModal;
