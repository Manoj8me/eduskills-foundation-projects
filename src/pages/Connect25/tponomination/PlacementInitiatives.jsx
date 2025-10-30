import { Award } from "lucide-react";

const PlacementInitiatives = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const textareaClasses = (fieldName) => {
    return `
      w-full px-4 py-3 border rounded-lg transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      resize-none
      ${
        errors[fieldName]
          ? "border-red-300 bg-red-50"
          : "border-gray-300 hover:border-gray-400 focus:bg-white"
      }
    `;
  };

  // Function to count words
  const countWords = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Award className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">
            Section C: Key Initiatives & Achievements (July 2024 to Aug 2025)
          </h3>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="industryPartnerships"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Key Industry Partnerships Facilitated (Last 1 Year)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              e.g., MNC tie-ups, MoUs, job fairs, CoEs
            </p>
            <textarea
              id="industryPartnerships"
              name="industryPartnerships"
              value={formData.industryPartnerships || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("industryPartnerships")}
              placeholder="Describe your key industry partnerships and collaborations..."
            />
            {errors.industryPartnerships && (
              <p className="mt-1 text-sm text-red-600">
                {errors.industryPartnerships}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="placementStrategies"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Innovative Placement Strategies Adopted
            </label>
            <p className="text-xs text-gray-500 mb-2">
              e.g., AI-driven matching, mock interview ecosystems, virtual job
              fests
            </p>
            <textarea
              id="placementStrategies"
              name="placementStrategies"
              value={formData.placementStrategies || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("placementStrategies")}
              placeholder="Describe innovative strategies you've implemented..."
            />
            {errors.placementStrategies && (
              <p className="mt-1 text-sm text-red-600">
                {errors.placementStrategies}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="skillDevelopmentPrograms"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Skill Development/Certification Programs Initiated for Students
            </label>
            <p className="text-xs text-gray-500 mb-2">
              with platform/partner names
            </p>
            <textarea
              id="skillDevelopmentPrograms"
              name="skillDevelopmentPrograms"
              value={formData.skillDevelopmentPrograms || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("skillDevelopmentPrograms")}
              placeholder="List skill development programs and certification courses..."
            />
            {errors.skillDevelopmentPrograms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.skillDevelopmentPrograms}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ruralStudentInitiatives"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Initiatives for Tier-2/Tier-3 or Rural Students
            </label>
            <p className="text-xs text-gray-500 mb-2">
              special drives, mentoring, language programs
            </p>
            <textarea
              id="ruralStudentInitiatives"
              name="ruralStudentInitiatives"
              value={formData.ruralStudentInitiatives || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("ruralStudentInitiatives")}
              placeholder="Describe initiatives for rural/tier-2/tier-3 students..."
            />
            {errors.ruralStudentInitiatives && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ruralStudentInitiatives}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="diversityContribution"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Contribution to Women Empowerment / Diversity in Placements
            </label>
            <textarea
              id="diversityContribution"
              name="diversityContribution"
              value={formData.diversityContribution || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("diversityContribution")}
              placeholder="Describe your contributions to diversity and women empowerment..."
            />
            {errors.diversityContribution && (
              <p className="mt-1 text-sm text-red-600">
                {errors.diversityContribution}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="careerGuidancePrograms"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Career Guidance / Training Programs Organized (Mention highlights)
            </label>
            <textarea
              id="careerGuidancePrograms"
              name="careerGuidancePrograms"
              value={formData.careerGuidancePrograms || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("careerGuidancePrograms")}
              placeholder="Highlight key career guidance and training programs..."
            />
            {errors.careerGuidancePrograms && (
              <p className="mt-1 text-sm text-red-600">
                {errors.careerGuidancePrograms}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="visionStatement"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Personal Vision Statement (Max 150 words) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Your vision for transforming placements at your institution
            </p>
            <textarea
              id="visionStatement"
              name="visionStatement"
              value={formData.visionStatement || ""}
              onChange={handleChange}
              rows={4}
              className={textareaClasses("visionStatement")}
              placeholder="Share your vision for transforming placements..."
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {countWords(formData.visionStatement)}/150 words
            </div>
            {errors.visionStatement && (
              <p className="mt-1 text-sm text-red-600">
                {errors.visionStatement}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementInitiatives;
