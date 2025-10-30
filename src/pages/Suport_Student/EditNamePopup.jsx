import React, { useEffect, useRef } from "react";

const EditNamePopup = ({ editName, defaultFirstName, defaultLastName, onSave, onClose }) => {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  useEffect(() => {
    if (editName && firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, [editName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const firstName = firstNameRef.current.value.trim();
    const lastName = lastNameRef.current.value.trim();

    if (!firstName || !lastName) {
      alert("Both first name and last name are required.");
      return;
    }

    onSave({ firstName, lastName });
  };

  if (!editName) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Name</h3>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-gray-700">First Name + Middle Name</span>
            <input
              type="text"
              defaultValue={defaultFirstName}
              ref={firstNameRef}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Last Name</span>
            <input
              type="text"
              defaultValue={defaultLastName}
              ref={lastNameRef}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditNamePopup;
