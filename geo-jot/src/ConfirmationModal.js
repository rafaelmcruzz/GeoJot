//Component for the confirmation modal for deleting an account
function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
  
    //If isOpen is true, render the modal
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