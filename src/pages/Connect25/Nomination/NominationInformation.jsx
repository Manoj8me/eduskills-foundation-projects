import { Award, FileText, Building, Globe } from "lucide-react";

const NominationInformation = ({
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

  return (
    <div className="space-y-6">
      {/* Row 1: Award Category and Nomination Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="awardCategory"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Award Category *
          </label>
          <div className="relative">
            <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <select
              id="awardCategory"
              name="awardCategory"
              value={formData.awardCategory}
              onChange={handleChange}
              className={inputClasses("awardCategory")}
            >
              <option value="">Select award category</option>
              <option value="innovation">Innovation Excellence</option>
              <option value="leadership">Leadership Excellence</option>
              <option value="research">Research Excellence</option>
              <option value="education">Educational Excellence</option>
              <option value="community">Community Service</option>
              <option value="technology">Technology Excellence</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="sustainability">Sustainability Impact</option>
            </select>
          </div>
          {errors.awardCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.awardCategory}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nominationTitle"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Nomination Title *
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="nominationTitle"
              name="nominationTitle"
              value={formData.nominationTitle}
              onChange={handleChange}
              className={inputClasses("nominationTitle")}
              placeholder="Brief title for your nomination"
            />
          </div>
          {errors.nominationTitle && (
            <p className="mt-1 text-sm text-red-600">
              {errors.nominationTitle}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Years of Experience and Project Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="yearsExperience"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Years of Experience *
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              id="yearsExperience"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className={inputClasses("yearsExperience")}
              placeholder="e.g., 5"
              min="0"
              max="50"
            />
          </div>
          {errors.yearsExperience && (
            <p className="mt-1 text-sm text-red-600">
              {errors.yearsExperience}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="projectImpact"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Project Impact Scale *
          </label>
          <div className="relative">
            <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <select
              id="projectImpact"
              name="projectImpact"
              value={formData.projectImpact}
              onChange={handleChange}
              className={inputClasses("projectImpact")}
            >
              <option value="">Select impact scale</option>
              <option value="local">Local/Department</option>
              <option value="organizational">Organizational</option>
              <option value="regional">Regional</option>
              <option value="industry">Industry-wide</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>
          {errors.projectImpact && (
            <p className="mt-1 text-sm text-red-600">{errors.projectImpact}</p>
          )}
        </div>
      </div>

      {/* Row 3: Key Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="keyAchievements"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Key Achievements *
          </label>
          <div className="relative">
            <Award className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="keyAchievements"
              name="keyAchievements"
              value={formData.keyAchievements}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("keyAchievements")} resize-none`}
              placeholder="List your top 3-5 key achievements"
            />
          </div>
          {errors.keyAchievements && (
            <p className="mt-1 text-sm text-red-600">
              {errors.keyAchievements}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="innovationDescription"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Innovation/Impact Description *
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <textarea
              id="innovationDescription"
              name="innovationDescription"
              value={formData.innovationDescription}
              onChange={handleChange}
              rows={3}
              className={`${inputClasses("innovationDescription")} resize-none`}
              placeholder="Describe the innovation or impact of your work"
            />
          </div>
          {errors.innovationDescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.innovationDescription}
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Achievement Description (Full Width) */}
      <div>
        <label
          htmlFor="achievementDescription"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Detailed Achievement Description *
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="achievementDescription"
            name="achievementDescription"
            value={formData.achievementDescription}
            onChange={handleChange}
            rows={5}
            className={`${inputClasses("achievementDescription")} resize-none`}
            placeholder="Provide a comprehensive description of your achievements, contributions, and their impact (max 1000 words)"
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          {errors.achievementDescription && (
            <p className="text-sm text-red-600">
              {errors.achievementDescription}
            </p>
          )}
          <p className="text-sm text-gray-500 ml-auto">
            {formData.achievementDescription
              ? formData.achievementDescription.length
              : 0}
            /1000 characters
          </p>
        </div>
      </div>

      {/* Row 5: Supporting Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="supportingDocs"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Supporting Documents URL{" "}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="url"
              id="supportingDocs"
              name="supportingDocs"
              value={formData.supportingDocs}
              onChange={handleChange}
              className={inputClasses("supportingDocs")}
              placeholder="https://drive.google.com/your-documents"
            />
          </div>
          {errors.supportingDocs && (
            <p className="mt-1 text-sm text-red-600">{errors.supportingDocs}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="references"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Professional References{" "}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="references"
              name="references"
              value={formData.references}
              onChange={handleChange}
              className={inputClasses("references")}
              placeholder="Contact details of 2-3 professional references"
            />
          </div>
          {errors.references && (
            <p className="mt-1 text-sm text-red-600">{errors.references}</p>
          )}
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips for a Strong Nomination
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Be specific about your achievements and their measurable
                  impact
                </li>
                <li>
                  Include quantifiable results where possible (e.g., cost
                  savings, efficiency improvements)
                </li>
                <li>
                  Highlight innovations that set your work apart from others
                </li>
                <li>
                  Mention any recognition, awards, or publications related to
                  your work
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NominationInformation;
