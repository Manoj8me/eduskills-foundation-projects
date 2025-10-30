import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  Mail,
  Settings,
  Code,
  Database,
  Building,
  User,
  Grid,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const KnowledgeHubPage = () => {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");

  // State for active category
  const [activeCategory, setActiveCategory] = useState("All");

  // State for expanded FAQ
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Categories list
  const categories = [
    "All",
    "Getting started",
    "Authentication",
    "Limits & pricing",
    "Advanced settings",
    "API endpoints",
    "Enterprise features",
  ];

  // FAQs list
  const faqs = [
    {
      id: 1,
      question: "How to contact support?",
      answer:
        "You can contact our support team via email at support@knowledgehub.com or through the chat widget available on all pages.",
    },
    {
      id: 2,
      question: "How to submit a support ticket?",
      answer:
        'Click on the "Submit ticket" button in the header or footer, fill in the required details, and our team will get back to you within 24 hours.',
    },
    {
      id: 3,
      question: "Support center operating hours?",
      answer:
        "Our support team is available 24/7 for urgent issues. For standard queries, we operate Monday-Friday, 9 AM to 6 PM EST.",
    },
    {
      id: 4,
      question: "Types of issues supported?",
      answer:
        "We provide support for account issues, billing inquiries, technical difficulties, feature requests, and general platform guidance.",
    },
    {
      id: 5,
      question: "Self-help resources on website?",
      answer:
        "Our knowledge base includes tutorials, guides, FAQs, and video demonstrations to help you find answers quickly.",
    },
    {
      id: 6,
      question: "Typical response time?",
      answer:
        "For standard tickets, we aim to respond within 12-24 hours. Premium accounts receive priority support with responses within 4 hours.",
    },
  ];

  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-4 px-6 sm:px-10 flex justify-between items-center border-b"
      >
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-blue-500 text-white p-1 rounded-lg"
          >
            <Grid size={16} />
          </motion.div>
          <span className="font-bold">KnowledgeHub X</span>
          <span className="text-gray-500 text-xs ml-2">Support center</span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="text-sm">
            Home
          </motion.a>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center text-sm"
          >
            <span>Pages</span>
            <ChevronRight size={16} className="ml-1" />
          </motion.div>
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="text-sm">
            Contact
          </motion.a>
          <motion.a href="#" whileHover={{ scale: 1.05 }} className="text-sm">
            Cart(0)
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm ml-2 shadow-md"
          >
            Submit ticket
          </motion.button>
        </nav>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-50 p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 text-white p-1 rounded-lg">
                  <Grid size={16} />
                </div>
                <span className="font-bold">KnowledgeHub X</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <a href="#" className="block text-lg font-medium">
                Home
              </a>
              <a href="#" className="block text-lg font-medium">
                Pages
              </a>
              <a href="#" className="block text-lg font-medium">
                Contact
              </a>
              <a href="#" className="block text-lg font-medium">
                Cart(0)
              </a>
              <button className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-medium mt-6">
                Submit ticket
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative py-16 px-6 sm:px-10 bg-gradient-to-br from-blue-50 to-purple-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Find the help you need for any problem
            </motion.h1>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="mt-6 relative hidden md:block"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full p-3 pl-4 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <Search
                className="absolute right-3 top-3 text-gray-400"
                size={20}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="flex-grow px-6 sm:px-10 -mt-8 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6"
        >
          {/* Left Sidebar on Desktop */}
          <div className="w-full md:w-72 flex-shrink-0">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-4 mb-6"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full p-2 pl-3 pr-8 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  className="absolute right-3 top-2 text-gray-400"
                  size={16}
                />
              </div>

              <div className="mt-4 space-y-1">
                {categories.slice(1).map((category, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center justify-between p-2 text-sm cursor-pointer hover:bg-gray-50 rounded-xl ${
                      activeCategory === category
                        ? "bg-blue-50 text-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {category === "Getting started" && (
                        <Grid
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      {category === "Authentication" && (
                        <User
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      {category === "Limits & pricing" && (
                        <Database
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      {category === "Advanced settings" && (
                        <Settings
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      {category === "API endpoints" && (
                        <Code
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      {category === "Enterprise features" && (
                        <Building
                          size={16}
                          className={`${
                            activeCategory === category
                              ? "text-blue-500"
                              : "text-gray-400"
                          } mr-2`}
                        />
                      )}
                      <span>{category}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={
                        activeCategory === category
                          ? "text-blue-500"
                          : "text-gray-400"
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-blue-100 p-3 rounded-full mb-3"
              >
                <Mail size={20} className="text-blue-500" />
              </motion.div>
              <h3 className="text-sm font-medium mb-1">Need more help?</h3>
              <p className="text-xs text-gray-500 mb-4">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs shadow-md"
              >
                Submit ticket
              </motion.button>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 gap-4">
              {/* Category Cards */}
              {categories.slice(1).map((category, index) => {
                // Skip rendering if not "All" and not the active category
                if (activeCategory !== "All" && activeCategory !== category) {
                  return null;
                }

                // Determine which icon to show
                let Icon = Grid;
                if (category === "Authentication") Icon = User;
                if (category === "Limits & pricing") Icon = Database;
                if (category === "Advanced settings") Icon = Settings;
                if (category === "API endpoints") Icon = Code;
                if (category === "Enterprise features") Icon = Building;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.01, y: -5 }}
                    className="bg-white rounded-2xl shadow-md p-5 flex"
                  >
                    <div className="mr-4 mt-1">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        <Icon size={20} className="text-blue-500" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-medium text-base mb-1">{category}</h2>
                      <p className="text-sm text-gray-500 mb-2">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit
                        sed do eiusmod tempor velit esse cillum dolore magna
                        aliqua ut labore et dolore magna.
                      </p>
                      <motion.a
                        href="#"
                        whileHover={{ x: 5 }}
                        className="text-blue-500 text-sm flex items-center"
                      >
                        Browse docs <ChevronRight size={16} className="ml-1" />
                      </motion.a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Popular Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-16"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-2xl font-bold text-center mb-2"
            >
              Popular questions?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-sm text-gray-500 text-center mb-8"
            >
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Side Categories */}
              <div className="col-span-1">
                <div className="flex flex-col">
                  {categories.map((category, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(category)}
                      className={`py-3 px-4 text-sm cursor-pointer rounded-xl mb-1 ${
                        category === activeCategory
                          ? "bg-blue-900 text-white"
                          : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    >
                      {category}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side FAQ Questions */}
              <div className="col-span-2">
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * faq.id }}
                    >
                      <motion.div
                        onClick={() => toggleFaq(faq.id)}
                        className="bg-white rounded-2xl p-4 border border-gray-100 cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium">
                            {faq.question}
                          </h3>
                          <motion.div
                            animate={{
                              rotate: expandedFaq === faq.id ? 90 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronRight size={18} className="text-gray-400" />
                          </motion.div>
                        </div>

                        <AnimatePresence>
                          {expandedFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-gray-500 mt-3 pt-3 border-t">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="max-w-6xl mx-auto mt-16 text-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg"
        >
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold mb-2"
          >
            Need more help?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            Get in touch with us today!
          </motion.p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-900 px-5 py-3 rounded-xl text-sm font-medium shadow-md"
            >
              Submit ticket
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-900 bg-opacity-30 px-5 py-3 rounded-xl text-sm font-medium"
            >
              Read documentation
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-blue-500 text-white p-1 rounded-lg"
              >
                <Grid size={16} />
              </motion.div>
              <span className="font-bold">KnowledgeHub X</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Solicitidin urna etiam egestas quis sollicitudin dolor at orci
              aliquet.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs shadow-md"
            >
              Submit ticket
            </motion.button>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-bold mb-4">Pages</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                "Sales",
                "Help center single V3",
                "Home V1",
                "Help center category V1",
                "Home V2",
                "Help center category V2",
                "Home V3",
                "Help center category V3",
                "Contact V1",
                "Changelog V1",
                "Contact V2",
                "Changelog V2",
                "Help center single V1",
                "Changelog single",
                "Help center single V2",
                "FAQs V1",
              ].map((page, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ x: 2, color: "#3B82F6" }}
                  className="text-gray-600 hover:text-blue-500"
                >
                  {page}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Utility Pages */}
          <div>
            <h3 className="font-bold mb-4">Utility pages</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {[
                "Start here",
                "Style guide",
                "FAQs V2",
                "Password protected",
                "FAQs V3",
                "404 Not found",
                "Videos V1",
                "Licenses",
                "Videos V2",
                "Changelog",
                "Video single",
                "Documentation",
                "Pricing",
                "More Webflow Templates",
                "Pricing Single",
              ].map((page, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ x: 2, color: "#3B82F6" }}
                  className="text-gray-600 hover:text-blue-500"
                >
                  {page}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-200 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
          <div>
            Copyright © KnowledgeHub X | Designed by{" "}
            <a href="#" className="text-blue-500">
              BRIx Templates
            </a>
          </div>
          <div>
            Powered by{" "}
            <a href="#" className="text-blue-500">
              Webflow
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-4 right-4 z-40"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white p-3 rounded-full shadow-lg cursor-pointer relative"
          onClick={() => setMobileMenuOpen(true)}
        >
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            3
          </div>
          <User size={20} className="text-blue-500" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default KnowledgeHubPage;
