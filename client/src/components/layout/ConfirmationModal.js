import React from "react";

const ConfirmationModal = ({ confirmDeleteHandler, deleteCancelHandler }) => {
  return (
    <div className="modal">
      <h3>Are you sure you want to delete?</h3>
      <button className="confirmation-button" onClick={confirmDeleteHandler}>
        Yes
      </button>
      <button className="cancel-button" onClick={deleteCancelHandler}>
        Cancel
      </button>
    </div>
  );
};

export default ConfirmationModal;
