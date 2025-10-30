import { Upload } from "@mui/icons-material";
import React, { useEffect } from "react";

const InstituteInfo = ({ instituteName, websiteUrl, onChange, loading,handleLogoUpload,logo ,handleRemoveLogo}) => {
  return (
    <>
      {/* Institute Name */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="md:w-1/3">
          <label className="block font-medium text-gray-700">Institute Name  <span className="text-red-500">*</span></label>
        </div>
        <div className="md:w-2/3">
          <input
            type="text"
            value={instituteName || ""}
            onChange={(e) => onChange('instituteName', e.target.value)}
            disabled={loading}
              readOnly
            className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
       {/* Institute Logo */}
<div className="mb-6 flex flex-col md:flex-row md:items-start gap-4">
  <div className="md:w-1/3">
    <label className="block font-medium text-gray-700">Institute Logo  <span className="text-red-500">*</span></label>
    <p className="text-xs text-gray-500 mt-1">Upload institute logo (PNG, JPG)</p>
  </div>
  <div className="md:w-2/3">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
      <input 
        type="file" 
        id="logo" 
        className="hidden" 
        accept="image/png, image/jpeg"
        onChange={handleLogoUpload}
      />
      <label htmlFor="logo" className="cursor-pointer flex flex-col items-center">
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 mb-1">
          {logo ? "Logo uploaded" : "Drop your logo here, or browse"}
        </span>
        <span className="text-xs text-gray-500">Max file size: 200KB</span>
      </label>

      {/* Logo Preview with Cut Button */}
      {logo && (
        <div className="relative mt-4 inline-block">
          <img
            src={logo}
            alt="Logo preview"
            className="w-32 h-auto border rounded"
          />
          <button
            onClick={handleRemoveLogo}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            title="Remove logo"
          >
            ×
          </button>
        </div>
      )}
    </div>
  </div>
</div>

      {/* Website URL */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="md:w-1/3">
          <label className="block font-medium text-gray-700">Website URL :</label>
        </div>
        <div className="md:w-2/3">
          <input
            type="text"
            value={websiteUrl || ""}
            onChange={(e) => onChange("website_url", e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </>
  );
};

export default InstituteInfo;