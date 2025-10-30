import {
  BookOpen,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const NEPImplementation = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentValues = formData[name] || [];
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...currentValues, value]
          : currentValues.filter((v) => v !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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

  const checkboxClasses =
    "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500";

  return (
    <div className="space-y-6">
      {/* NEP 2020 Adoption */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          NEP 2020 Implementation Status
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Has your institution adopted reforms aligned with NEP 2020? *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="nepAdoption"
                value="yes"
                checked={formData.nepAdoption === "yes"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="nepAdoption"
                value="no"
                checked={formData.nepAdoption === "no"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="nepAdoption"
                value="partially"
                checked={formData.nepAdoption === "partially"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Partially</span>
            </label>
          </div>
          {errors.nepAdoption && (
            <p className="mt-1 text-sm text-red-600">{errors.nepAdoption}</p>
          )}
        </div>

        {(formData.nepAdoption === "yes" ||
          formData.nepAdoption === "partially") && (
          <div>
            <label
              htmlFor="nepInitiatives"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Details of NEP 2020 Initiatives Taken
            </label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="nepInitiatives"
                name="nepInitiatives"
                value={formData.nepInitiatives || ""}
                onChange={handleChange}
                rows={4}
                className={`${inputClasses("nepInitiatives")} resize-none`}
                placeholder="Provide details of the initiatives taken to align with NEP 2020..."
              />
            </div>
          </div>
        )}
      </div>

      {/* NEP-Aligned Reforms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          NEP-Aligned Reforms Initiated Under Your Leadership
        </h3>
        <p className="text-sm text-gray-600 mb-4">Select all that apply:</p>

        <div className="space-y-3">
          {[
            {
              value: "abc",
              label: "Implementation of Academic Bank of Credits (ABC)",
            },
            {
              value: "multidisciplinary",
              label: "Multidisciplinary course offerings",
            },
            {
              value: "skillBased",
              label: "Introduction of Skill-based / Vocational Courses",
            },
            {
              value: "obe",
              label:
                "Curriculum redesign in line with Outcome-Based Education (OBE)",
            },
            {
              value: "fourYear",
              label:
                "Launch of 4-Year Undergraduate Programs with Multiple Entry/Exit Options",
            },
            {
              value: "iks",
              label: "Introduction of Indian Knowledge Systems (IKS)",
            },
            {
              value: "regionalLanguages",
              label: "Use of Regional Languages in Teaching",
            },
            {
              value: "experiential",
              label: "Integration of Experiential & Project-Based Learning",
            },
            {
              value: "facultyTraining",
              label: "Faculty Training on NEP Guidelines",
            },
            {
              value: "internship",
              label: "Industry-aligned Internship & Employability Programs",
            },
          ].map((reform) => (
            <label key={reform.value} className="flex items-start">
              <input
                type="checkbox"
                name="nepReforms"
                value={reform.value}
                checked={formData.nepReforms?.includes(reform.value) || false}
                onChange={handleChange}
                className={`${checkboxClasses} mt-0.5 flex-shrink-0`}
              />
              <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                {reform.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* National-Level Collaborations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          National-Level Collaborations for NEP Rollout
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Has your institution collaborated with any national-level bodies for
            NEP rollout?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="nationalCollaboration"
                value="yes"
                checked={formData.nationalCollaboration === "yes"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="nationalCollaboration"
                value="no"
                checked={formData.nationalCollaboration === "no"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {formData.nationalCollaboration === "yes" && (
          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="partnerBody"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Partner Body
              </label>
              <p className="text-sm text-gray-600 mb-2">
                e.g., AICTE, UGC, NITTTR, EduSkills, etc.
              </p>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="partnerBody"
                  name="partnerBody"
                  value={formData.partnerBody || ""}
                  onChange={handleChange}
                  className={inputClasses("partnerBody")}
                  placeholder="Name of partner organization"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="collaborationNature"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Nature of Collaboration
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="collaborationNature"
                  name="collaborationNature"
                  value={formData.collaborationNature || ""}
                  onChange={handleChange}
                  className={inputClasses("collaborationNature")}
                  placeholder="Describe the nature of collaboration"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student-Centric Outcomes */}
      <div>
        <label
          htmlFor="studentOutcomes"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          NEP-Aligned Student-Centric Outcomes Achieved
        </label>
        <p className="text-sm text-gray-600 mb-2">
          List measurable improvements such as student retention, performance,
          credit transfer, skill certification, etc.
        </p>
        <div className="relative">
          <CheckCircle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="studentOutcomes"
            name="studentOutcomes"
            value={formData.studentOutcomes || ""}
            onChange={handleChange}
            rows={4}
            className={`${inputClasses("studentOutcomes")} resize-none`}
            placeholder="Describe measurable improvements in student outcomes..."
          />
        </div>
      </div>

      {/* Challenges */}
      <div>
        <label
          htmlFor="nepChallenges"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Challenges Faced in NEP Implementation
        </label>
        <p className="text-sm text-gray-600 mb-2">(if any)</p>
        <div className="relative">
          <AlertCircle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <textarea
            id="nepChallenges"
            name="nepChallenges"
            value={formData.nepChallenges || ""}
            onChange={handleChange}
            rows={3}
            className={`${inputClasses("nepChallenges")} resize-none`}
            placeholder="Describe any challenges faced during NEP implementation..."
          />
        </div>
      </div>
    </div>
  );
};

export default NEPImplementation;
