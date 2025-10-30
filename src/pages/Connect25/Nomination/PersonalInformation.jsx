import {
  User,
  Building,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Lock,
  FileText,
} from "lucide-react";

import pdfsampleFormat from "../../../assets/pdfs/leadersample.pdf";

const PersonalInformation = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isFieldDisabled,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Don't allow changes to disabled fields
    if (isFieldDisabled && isFieldDisabled(name)) {
      return;
    }

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

  const inputClasses = (fieldName) => {
    const isDisabled = isFieldDisabled && isFieldDisabled(fieldName);
    return `
      w-full px-4 py-3 pl-12 border rounded-lg transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${
        errors[fieldName]
          ? "border-red-300 bg-red-50"
          : isDisabled
          ? "border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
          : "border-gray-300 hover:border-gray-400 focus:bg-white"
      }
    `;
  };

  const getFieldIcon = (fieldName, IconComponent) => {
    const isDisabled = isFieldDisabled && isFieldDisabled(fieldName);
    return isDisabled ? (
      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
    ) : (
      <IconComponent className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Sample Form Format Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Sample Form Format
              </h3>
            </div>
          </div>
          <a
            href={pdfsampleFormat}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FileText className="h-4 w-4 mr-2" />
            View PDF
          </a>
        </div>
        {/* <div className="mt-4 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          This sample format shows the exact structure and examples for each
          field
        </div> */}
      </div>

      {/* Row 1: Full Name and Designation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Full Name *
          </label>
          <div className="relative">
            {getFieldIcon("fullName", User)}
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isFieldDisabled && isFieldDisabled("fullName")}
              className={inputClasses("fullName")}
              placeholder="Enter your full name"
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Designation *
          </label>
          <div className="relative">
            {getFieldIcon("designation", Building)}
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={isFieldDisabled && isFieldDisabled("designation")}
              className={inputClasses("designation")}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )}
        </div>
      </div>

      {/* Row 2: Institution Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="institutionName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Institution Name *
          </label>
          <div className="relative">
            {getFieldIcon("institutionName", Building)}
            <input
              type="text"
              id="institutionName"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              disabled={isFieldDisabled && isFieldDisabled("institutionName")}
              className={inputClasses("institutionName")}
              placeholder="Enter your organization name"
            />
          </div>
          {errors.institutionName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.institutionName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="emailId"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email ID *
          </label>
          <div className="relative">
            {getFieldIcon("emailId", Mail)}
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              disabled={isFieldDisabled && isFieldDisabled("emailId")}
              className={inputClasses("emailId")}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.emailId && (
            <p className="mt-1 text-sm text-red-600">{errors.emailId}</p>
          )}
        </div>
      </div>

      {/* Row 3: Mobile Number and Official Website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Mobile Number *
          </label>
          <div className="relative">
            {getFieldIcon("mobileNumber", Phone)}
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={isFieldDisabled && isFieldDisabled("mobileNumber")}
              className={inputClasses("mobileNumber")}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          {errors.mobileNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="officialWebsite"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Official Website
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="url"
              id="officialWebsite"
              name="officialWebsite"
              value={formData.officialWebsite}
              onChange={handleChange}
              className={inputClasses("officialWebsite")}
              placeholder="https://www.institution.com"
            />
          </div>
          {errors.officialWebsite && (
            <p className="mt-1 text-sm text-red-600">
              {errors.officialWebsite}
            </p>
          )}
        </div>
      </div>

      {/* Row 4: LinkedIn Profile */}
      <div>
        <label
          htmlFor="linkedinProfile"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          LinkedIn Profile{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <Linkedin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="url"
            id="linkedinProfile"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            onChange={handleChange}
            className={inputClasses("linkedinProfile")}
            placeholder="https://www.linkedin.com/in/yourprofile"
          />
        </div>
        {errors.linkedinProfile && (
          <p className="mt-1 text-sm text-red-600">{errors.linkedinProfile}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
