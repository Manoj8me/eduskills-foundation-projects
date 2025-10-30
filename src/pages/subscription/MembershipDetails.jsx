import React from "react";
import {
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

const MembershipDetails = () => {
  const memberData = {
    membershipId: "MB-2024-001",
    signupDate: "2024-01-15",
    renewalDate: "2025-01-15",
    validTill: "2026-01-14",
    fee: "25,00000 INR",
    invoiceNo: "INV-2024-001",
  };

  const tableRows = [
    {
      label: "Membership ID",
      value: memberData.membershipId,
      icon: <User className="w-5 h-5" />,
      color: "text-purple-600",
    },
    {
      label: "Signup Date",
      value: memberData.signupDate,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      label: "Renewal Date",
      value: memberData.renewalDate,
      icon: <Clock className="w-5 h-5" />,
      color: "text-indigo-600",
    },
    {
      label: "Valid Till",
      value: memberData.validTill,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      label: "Fee",
      value: memberData.fee,
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-emerald-600",
    },
    {
      label: "Invoice No.",
      value: memberData.invoiceNo,
      icon: <FileText className="w-5 h-5" />,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-[7xl] mx-auto">
        {/* Main Card */}
        {/* <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"> */}
        {/* Card Header */}
        <div className=" p-8">
          {/* <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Member Profile
                </h2>
                <p className="text-purple-100 text-lg">
                  Active Premium Membership
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <User className="w-10 h-10 text-white" />
              </div>
            </div> */}
        </div>

        {/* Table Content */}
        <div className="p-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Information
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableRows.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`${row.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          {row.icon}
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                          {row.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`text-lg font-bold ${row.color} group-hover:text-purple-700 transition-colors duration-300`}
                      >
                        {row.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Badge */}
          {/* <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Active Membership</span>
              </div>
            </div>
          </div> */}
        </div>
        {/* </div> */}

        {/* Footer */}
        {/* <div className="text-center mt-8">
          <p className="text-gray-600">
            Last Updated: <span className="font-semibold">June 13, 2025</span>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default MembershipDetails;
