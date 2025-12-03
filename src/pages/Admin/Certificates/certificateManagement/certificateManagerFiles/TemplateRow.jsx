export default function TemplateRow({
  template,
  nodeId,
  domainName,
  onOpenDropdown,
}) {
  const TEMPLATE_ACTIONS = [
    "Edit Template",
    "Delete Template",
    "Open in Canvas",
  ];

  return (
    <tr className="hover:bg-gray-50 border-b">
      {/* template cells here */}

      <td className="py-3 px-6">
        <button
          onClick={(e) =>
onOpenDropdown({ ...template, _nodeId: nodeId, _domain: domainName }, e.currentTarget, TEMPLATE_ACTIONS)

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
