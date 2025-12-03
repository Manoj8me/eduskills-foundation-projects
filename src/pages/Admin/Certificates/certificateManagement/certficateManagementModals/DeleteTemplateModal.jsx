import { CenteredPortal } from "./CenteredPortal";

export function DeleteTemplateModal({ title, message, onCancel, onConfirm }) {
    return (
        <CenteredPortal>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 overflow-auto p-4">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                    <h2 className="text-xl font-bold mb-3">{title}</h2>
                    <p className="mb-6">{message}</p>
                    <div className="flex justify-end gap-2">
                        <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
                        <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Confirm</button>
                    </div>
                </div>
            </div>
        </CenteredPortal>
    );
}
