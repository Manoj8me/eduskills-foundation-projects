import { Award, Users, Target, BookOpen, Trophy } from "lucide-react";

const LeadershipAchievements = ({
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
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

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:bg-white"
    }
  `;

  const selectClasses = (fieldName) => `
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
      {/* Years of Service and Tenure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="yearsOfService"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Years of Service in Education Leadership *
          </label>
          <div className="relative">
            <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <select
              id="yearsOfService"
              name="yearsOfService"
              value={formData.yearsOfService || ""}
              onChange={handleChange}
              className={selectClasses("yearsOfService")}
            >
              <option value="">Select years</option>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>
          {errors.yearsOfService && (
            <p className="mt-1 text-sm text-red-600">{errors.yearsOfService}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tenureAsPrincipal"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Tenure at Current Institution *
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <select
              id="tenureAsPrincipal"
              name="tenureAsPrincipal"
              value={formData.tenureAsPrincipal || ""}
              onChange={handleChange}
              className={selectClasses("tenureAsPrincipal")}
            >
              <option value="">Select years</option>
              {[...Array(31)].map((_, i) => (
                <option key={i} value={i}>
                  {i} {i === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>
          {errors.tenureAsPrincipal && (
            <p className="mt-1 text-sm text-red-600">
              {errors.tenureAsPrincipal}
            </p>
          )}
        </div>
      </div>

      {/* Key Contributions */}
      <div>
        <label
          htmlFor="keyContributions"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Key Contributions as an Academic Leader *
        </label>
        <p className="text-sm text-gray-600 mb-2">
          Highlight strategic vision, reforms, and institution-building efforts
          (Max 200 words)
        </p>
        <div className="relative">
          <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="keyContributions"
            name="keyContributions"
            value={formData.keyContributions || ""}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses("keyContributions")} resize-none`}
            placeholder="Describe your strategic vision, key reforms, and institution-building efforts..."
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          {errors.keyContributions && (
            <p className="text-sm text-red-600">{errors.keyContributions}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.keyContributions
              ? formData.keyContributions.split(" ").length
              : 0}
            /200 words
          </p>
        </div>
      </div>

      {/* Notable Achievements */}
      <div>
        <label
          htmlFor="notableAchievements"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Notable Student or Faculty Achievements under Your Leadership
        </label>
        <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
        <div className="relative">
          <Trophy className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="notableAchievements"
            name="notableAchievements"
            value={formData.notableAchievements || ""}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses("notableAchievements")} resize-none`}
            placeholder="List notable achievements of students or faculty under your leadership..."
          />
        </div>
        {errors.notableAchievements && (
          <p className="mt-1 text-sm text-red-600">
            {errors.notableAchievements}
          </p>
        )}
      </div>

      {/* Vision Statement */}
      <div>
        <label
          htmlFor="visionStatement"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Vision Statement – Future Plan for Institution *
        </label>
        <p className="text-sm text-gray-600 mb-2">Max 150 words</p>
        <div className="relative">
          <Target className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="visionStatement"
            name="visionStatement"
            value={formData.visionStatement || ""}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses("visionStatement")} resize-none`}
            placeholder="Share your vision for the future of your institution..."
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          {errors.visionStatement && (
            <p className="text-sm text-red-600">{errors.visionStatement}</p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.visionStatement
              ? formData.visionStatement.split(" ").length
              : 0}
            /150 words
          </p>
        </div>
      </div>

      {/* Focus Areas - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="digitalInitiatives"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Focus on Emerging Technologies / Digital Initiatives
          </label>
          <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
          <div className="relative">
            <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="digitalInitiatives"
              name="digitalInitiatives"
              value={formData.digitalInitiatives || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("digitalInitiatives")} resize-none`}
              placeholder="Describe initiatives to promote AI, Cloud, IoT, Cybersecurity, etc."
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="communityEngagement"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Social or Community Engagement Initiatives
          </label>
          <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="communityEngagement"
              name="communityEngagement"
              value={formData.communityEngagement || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("communityEngagement")} resize-none`}
              placeholder="CSR, inclusion, rural outreach, women empowerment programs, etc."
            />
          </div>
        </div>
      </div>

      {/* Focus Areas - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="institutionalReforms"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Major Institutional Reforms or Policies Introduced
          </label>
          <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
          <div className="relative">
            <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="institutionalReforms"
              name="institutionalReforms"
              value={formData.institutionalReforms || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("institutionalReforms")} resize-none`}
              placeholder="Academic innovation, governance, digitalization, NEP implementation..."
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="industryCollaboration"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Initiatives in Industry Collaboration / Skilling / Internship
            Programs
          </label>
          <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="industryCollaboration"
              name="industryCollaboration"
              value={formData.industryCollaboration || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("industryCollaboration")} resize-none`}
              placeholder="Describe industry partnerships, skill development programs..."
            />
          </div>
        </div>
      </div>

      {/* Focus Areas - Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="supportUnderrepresented"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Support for Rural, Women, or Underrepresented Student Communities
          </label>
          <p className="text-sm text-gray-600 mb-2">July 2024 to Aug 2025</p>
          <div className="relative">
            <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="supportUnderrepresented"
              name="supportUnderrepresented"
              value={formData.supportUnderrepresented || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses(
                "supportUnderrepresented"
              )} resize-none`}
              placeholder="Describe programs supporting rural, women, or underrepresented communities..."
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="recognitionAwards"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Recognition, Awards, or Distinctions Received
          </label>
          <p className="text-sm text-gray-600 mb-2">
            July 2024 to Aug 2025 (individual or institutional level)
          </p>
          <div className="relative">
            <Trophy className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="recognitionAwards"
              name="recognitionAwards"
              value={formData.recognitionAwards || ""}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("recognitionAwards")} resize-none`}
              placeholder="List any awards or recognition received..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadershipAchievements;
