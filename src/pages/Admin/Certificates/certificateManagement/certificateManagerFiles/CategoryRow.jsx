export default function CategoryRow({ node, onOpenDropdown, actions }) {
  return (
    <tr className="hover:bg-gray-50 border-b">
      <td className="py-3 px-6">{node.name}</td>

      <td className="py-3 px-6">
        <button
          onClick={(e) => onOpenDropdown(node, e.currentTarget, actions)
}
          className="p-2 rounded hover:bg-gray-200 cursor-pointer
                     flex items-center justify-center text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
