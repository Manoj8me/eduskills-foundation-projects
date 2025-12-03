import React, { useEffect, useRef } from "react";

export default function DropdownPortal({ dropdown, onClose, onAction }) {
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(event) {
      if (!dropdown) return;

      // If click was inside dropdown → do nothing
      if (ref.current && ref.current.contains(event.target)) return;

      onClose();
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdown, onClose]);

  if (!dropdown) return null;

  return (
    <div
      ref={ref}
      id="action-dropdown"
      className="absolute bg-white shadow-lg rounded border z-50"
      style={{
        left: dropdown.x,
        top: dropdown.y,
      }}
    >
      {dropdown.actions.map((action, i) => (
        <button
          key={i}
          className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
          onClick={() => onAction(action, dropdown.node)}
        >
          {action}
        </button>
      ))}
    </div>
  );
}
