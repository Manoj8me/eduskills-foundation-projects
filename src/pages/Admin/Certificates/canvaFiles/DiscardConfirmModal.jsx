const DiscardConfirmModal = ({
    show,
    onConfirmDiscard,
    onCancel
}) => {

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-card pretty-modal">
                <h3 className="modal-title">Unsaved Changes</h3>
                <p className="modal-text">Do you want to save changes before leaving?</p>

                <div className="modal-actions">
                    <button
                        className="modal-btn danger"
                        onClick={() => onConfirmDiscard(false)}
                    >
                        Discard
                    </button>
                    <button
                        className="modal-btn primary"
                        onClick={() => onConfirmDiscard(true)}
                    >
                        Save & Exit
                    </button>
                    <button
                        className="modal-btn ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscardConfirmModal;
