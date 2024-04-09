function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <p>{message}</p>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    );
  }

export default ConfirmationModal;  