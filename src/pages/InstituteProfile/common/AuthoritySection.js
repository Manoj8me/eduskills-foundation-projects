import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const AuthoritySection = ({ 
  title, 
  items = [], 
  options = [], 
  customDesignation = false,
  onChange 
}) => {
  const [errors, setErrors] = useState([]);

  const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

const validatePhone = (value) => {
  const regex = /^\d{10}$/;
  return regex.test(value);
};


  const handleItemChange = (index, field, value) => {
  const updatedItems = [...items];
  updatedItems[index][field] = value;
  onChange(updatedItems);

  const updatedErrors = [...errors];
  if (!updatedErrors[index]) updatedErrors[index] = {};

  if (field === "email") {
    updatedErrors[index].email = validateEmail(value) ? "" : "Invalid email";
  } else if (field === "phone") {
    updatedErrors[index].phone = validatePhone(value) ? "" : "Invalid phone number";
  }

  setErrors(updatedErrors);
};

  // const handleItemChange = (index, field, value) => {
  //   const updated = [...items];
  //   updated[index][field] = value;
  //   onChange(updated);
  // };

  const addItem = () => {
    const updated = [...items, { designation: "", name: "", email: "", phone: "", localDesignation: "" }];
    onChange(updated);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    onChange(updated);
  };

  const isDesignationUsed = (designation, currentIndex) => {
    return items.some((item, index) => index !== currentIndex && item.designation === designation);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      {items.map((item, index) => (
        <div key={index} className="flex flex-wrap -mx-2 mb-4 items-center">
          {/* Designation Field */}
          <div className="w-full md:w-1/6 px-2 mb-4">
            <label className="block font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
            {customDesignation ? (
              <input
                type="text"
                value={item.designation}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (!isDesignationUsed(newValue, index)) {
                    handleItemChange(index, "designation", newValue);
                  } else {
                    alert("This designation is already used.");
                  }
                }}
                placeholder="Enter Designation"
                className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <select
                value={item.designation}
                onChange={(e) => handleItemChange(index, "designation", e.target.value)}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Designation </option>
                {options.filter(option => 
                  !isDesignationUsed(option, index)
                ).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>

          {/* Name Field */}
          <div className="w-full md:w-1/6 px-2 mb-4">
            <label className="block font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              placeholder="Enter Name"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="w-full md:w-1/6 px-2 mb-4">
            <label className="block font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
           <input
  type="email"
  value={item.email}
  onChange={(e) => handleItemChange(index, "email", e.target.value)}
  placeholder="Enter Email"
  className={`border rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 ${
    errors[index]?.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
  }`}
/>
{errors[index]?.email && (
  <p className="text-red-500 text-xs mt-1">{errors[index].email}</p>
)}

          </div>

          {/* Phone Number Field */}
          <div className="w-full md:w-1/6 px-2 mb-4">
            <label className="block font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
          <input
  type="tel"
  value={item.phone}
  onChange={(e) => handleItemChange(index, "phone", e.target.value)}
  placeholder="Enter Phone Number"
  className={`border rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 ${
    errors[index]?.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
  }`}
/>
{errors[index]?.phone && (
  <p className="text-red-500 text-xs mt-1">{errors[index].phone}</p>
)}

          </div>

          {/* Local Designation Field */}
          <div className="w-full md:w-1/6 px-2 mb-4">
            <label className="block font-medium text-gray-700 mb-1">Local Designation</label>
            <input
              type="text"
              value={item.localDesignation}
              onChange={(e) => handleItemChange(index, "localDesignation", e.target.value)}
              placeholder="Enter Local Designation"
              className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions (Remove/Add buttons) */}
          <div className="w-full md:w-1/12 px-2 mb-2 flex items-center gap-2 mt-4">
            {/* Show delete button only if it's not the first row */}
            {index > 0 && (
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={addItem}
              className="text-blue-500 hover:text-blue-700"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthoritySection;