import { BookOpen, FileText, Award, Users, Target } from "lucide-react";

const ResearchPublications = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // For previously number inputs, now text inputs - validate numeric input
    const numericFields = [
      "internationalJournals",
      "nationalJournals",
      "totalBooks",
      "chaptersInBooks",
      "patentsFiled",
      "patentsPublished",
      "patentsGranted",
      "totalValue",
    ];

    let processedValue = value;

    // For numeric fields, ensure we only allow valid number characters
    if (numericFields.includes(name)) {
      // Allow empty string, digits, and decimal point for totalValue
      if (name === "totalValue") {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
          processedValue = value;
        } else {
          return; // Don't update if invalid number format
        }
      } else {
        // For integer fields, only allow digits
        if (value === "" || /^\d*$/.test(value)) {
          processedValue = value;
        } else {
          return; // Don't update if invalid number format
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:bg-white"
    }
  `;

  return (
    <div className="space-y-6">
      {/* Research Papers Published */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Research Papers Published (July 2024 to Aug 2025)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="internationalJournals"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              In International Journals (Scopus/SCI/UGC) *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="internationalJournals"
                name="internationalJournals"
                value={formData.internationalJournals || ""}
                onChange={handleChange}
                className={inputClasses("internationalJournals")}
                placeholder="0"
              />
            </div>
            {errors.internationalJournals && (
              <p className="mt-1 text-sm text-red-600">
                {errors.internationalJournals}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="nationalJournals"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              In National Journals *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="nationalJournals"
                name="nationalJournals"
                value={formData.nationalJournals || ""}
                onChange={handleChange}
                className={inputClasses("nationalJournals")}
                placeholder="0"
              />
            </div>
            {errors.nationalJournals && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nationalJournals}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Books and Chapters */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Books/Chapters Authored or Edited (July 2024 to Aug 2025)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="totalBooks"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Total Books Published
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="totalBooks"
                name="totalBooks"
                value={formData.totalBooks || ""}
                onChange={handleChange}
                className={inputClasses("totalBooks")}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="chaptersInBooks"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Chapters in Edited Books
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="chaptersInBooks"
                name="chaptersInBooks"
                value={formData.chaptersInBooks || ""}
                onChange={handleChange}
                className={inputClasses("chaptersInBooks")}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Patents */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Patents Filed / Published / Granted (July 2024 to Aug 2025)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="patentsFiled"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Patents Filed
            </label>
            <div className="relative">
              <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="patentsFiled"
                name="patentsFiled"
                value={formData.patentsFiled || ""}
                onChange={handleChange}
                className={inputClasses("patentsFiled")}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="patentsPublished"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Patents Published
            </label>
            <div className="relative">
              <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="patentsPublished"
                name="patentsPublished"
                value={formData.patentsPublished || ""}
                onChange={handleChange}
                className={inputClasses("patentsPublished")}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="patentsGranted"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Patents Granted
            </label>
            <div className="relative">
              <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="patentsGranted"
                name="patentsGranted"
                value={formData.patentsGranted || ""}
                onChange={handleChange}
                className={inputClasses("patentsGranted")}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Research */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sponsored Research / Consultancy Projects Handled (July 2024 to Aug
          2025)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="totalValue"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Total Value (₹ Lakhs)
            </label>
            <div className="relative">
              <Target className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="totalValue"
                name="totalValue"
                value={formData.totalValue || ""}
                onChange={handleChange}
                className={inputClasses("totalValue")}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="fundingAgencies"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Funding Agencies
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="fundingAgencies"
                name="fundingAgencies"
                value={formData.fundingAgencies || ""}
                onChange={handleChange}
                className={inputClasses("fundingAgencies")}
                placeholder="e.g., DST, AICTE, UGC, Industry Partners"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Boards */}
      <div>
        <label
          htmlFor="editorialMembership"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Membership in Editorial Boards / Academic Bodies
        </label>
        <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
        <div className="relative">
          <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="editorialMembership"
            name="editorialMembership"
            value={formData.editorialMembership || ""}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses("editorialMembership")} resize-none`}
            placeholder="List editorial boards, academic committees, professional bodies..."
          />
        </div>
      </div>

      {/* Top 3 Research Contributions */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Top 3 Research Contributions or Innovations
        </label>
        <p className="text-sm text-gray-600 mb-4">
          July 2024 to Aug 2025 (Brief Summary)
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="researchContribution1"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              a) First Contribution
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="researchContribution1"
                name="researchContribution1"
                value={formData.researchContribution1 || ""}
                onChange={handleChange}
                rows={2}
                className={`${inputClasses(
                  "researchContribution1"
                )} resize-none`}
                placeholder="Describe your first major research contribution or innovation..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="researchContribution2"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              b) Second Contribution
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="researchContribution2"
                name="researchContribution2"
                value={formData.researchContribution2 || ""}
                onChange={handleChange}
                rows={2}
                className={`${inputClasses(
                  "researchContribution2"
                )} resize-none`}
                placeholder="Describe your second major research contribution or innovation..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="researchContribution3"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              c) Third Contribution
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="researchContribution3"
                name="researchContribution3"
                value={formData.researchContribution3 || ""}
                onChange={handleChange}
                rows={2}
                className={`${inputClasses(
                  "researchContribution3"
                )} resize-none`}
                placeholder="Describe your third major research contribution or innovation..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPublications;
