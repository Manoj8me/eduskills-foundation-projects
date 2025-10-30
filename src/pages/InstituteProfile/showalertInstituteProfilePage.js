import React, { useState } from 'react';
import Modal from 'react-modal';
import ApprovalDetails from './InstituteProfile'; // Adjust the path as necessary

const App = () => {
  const [isApprove, setIsApprove] = useState(0); // Simulated API response
  const [hasDismissed, setHasDismissed] = useState(false); // Tracks if modal has been dismissed

  const handleClose = () => {
    setHasDismissed(true);
  };

  return (
    <div>
      <Modal
        isOpen={isApprove === 0 && !hasDismissed}
        onRequestClose={handleClose}
        contentLabel="Approval Required"
      >
        <h2>Approval Needed</h2>
        <ApprovalDetails />
        <button onClick={handleClose}>Close</button>
      </Modal>
    </div>
  );
};

export default App;
