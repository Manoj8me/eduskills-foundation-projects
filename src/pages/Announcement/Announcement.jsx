import React, { useState } from "react";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import CampaignIcon from "@mui/icons-material/Campaign";

// Sample announcement data
const announcements = [
  {
    id: 1,
    title: "Welcome to the Era of Zero!",
    content:
      "Dear Phemex Traders, The day has finally come! Today, we have officially launched our Membership Spot Trading services. Phemex is...",
    date: "Today",
    time: "03:00",
    category: "news",
  },
  {
    id: 2,
    title: "The Era of Zero is Coming!",
    content:
      "Dear Phemex Traders, The day has finally come! Today, we have officially launched our Membership Spot Trading services. Phemex is...",
    date: "Jun 03",
    year: "2020",
    category: "news",
  },
  {
    id: 3,
    title: "Trading Ethereum Derivatives",
    content:
      "Dear Phemex Traders, The day has finally come! Today, we have officially launched our Membership Spot Trading services. Phemex is...",
    date: "Jun 02",
    year: "2020",
    category: "activities",
  },
  {
    id: 4,
    title: "How do I Add Margin to a Position?",
    content:
      "Dear Phemex Traders, The day has finally come! Today, we have officially launched our Membership Spot Trading services. Phemex is...",
    date: "Jun 01",
    year: "2020",
    category: "news",
  },
  {
    id: 5,
    title: "What are Conditional Orders?",
    content:
      "Dear Phemex Traders, The day has finally come! Today, we have officially launched our Membership Spot Trading services. Phemex is...",
    date: "May 29",
    year: "2020",
    category: "activities",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
    },
  },
};

const CompactAnnouncementWidget = () => {
  const [tabValue, setTabValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter announcements based on selected tab and search term
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesTab =
      tabValue === "all" ||
      (tabValue === "news" && announcement.category === "news") ||
      (tabValue === "activities" && announcement.category === "activities");

    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-3xl">
      {/* Header with blue accent */}
      <div className="relative bg-blue-50 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -20, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-500 p-1 rounded text-white"
            >
              <CampaignIcon fontSize="small" />
            </motion.div>
            <motion.h2
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base font-semibold text-gray-800"
            >
              Announcements
            </motion.h2>
          </div>

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search articles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm py-1 pl-8 pr-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 w-48"
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon style={{ fontSize: "1rem" }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Breadcrumbs and tabs */}
      <div className="px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-gray-500 mb-2 sm:mb-0"
        >
          Help center {" > "} Announcements
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex space-x-1"
        >
          <button
            onClick={() => setTabValue("all")}
            className={`px-3 py-1 text-xs font-medium rounded transition duration-150 ${
              tabValue === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTabValue("news")}
            className={`px-3 py-1 text-xs font-medium rounded transition duration-150 ${
              tabValue === "news"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            News
          </button>
          <button
            onClick={() => setTabValue("activities")}
            className={`px-3 py-1 text-xs font-medium rounded transition duration-150 ${
              tabValue === "activities"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Activities
          </button>
        </motion.div>
      </div>

      {/* Announcements List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-gray-100 max-h-80 overflow-y-auto"
      >
        {filteredAnnouncements.map((announcement) => (
          <motion.div
            key={announcement.id}
            variants={itemVariants}
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition duration-150"
          >
            <div className="flex">
              {/* Date column */}
              <div className="w-14 flex-shrink-0 mr-3">
                <div className="text-xs font-medium text-gray-500">
                  {announcement.date}
                </div>
                {announcement.time && (
                  <div className="text-xs text-gray-400">
                    {announcement.time}
                  </div>
                )}
                {announcement.year && (
                  <div className="text-xs text-gray-400">
                    {announcement.year}
                  </div>
                )}
              </div>

              {/* Content column */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                  {announcement.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {announcement.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-between items-center"
        >
          <span className="text-xs text-gray-500">5 announcements</span>
          <button className="text-xs font-medium text-blue-500 hover:text-blue-600 transition duration-150">
            View all
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CompactAnnouncementWidget;
