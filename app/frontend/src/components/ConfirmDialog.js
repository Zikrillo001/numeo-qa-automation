import React from "react";

export default function ConfirmDialog({ message, loading, onConfirm, onCancel }) {
  return (
    <div data-testid="confirm-dialog-overlay" className="modal-overlay">
      <div data-testid="confirm-dialog" className="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="modal-header">
          <h3 id="confirm-title" data-testid="confirm-title">Confirm action</h3>
        </div>

        <p data-testid="confirm-message" style={{ fontSize: "0.9rem", color: "#444" }}>
          {message}
        </p>

        <div className="modal-footer">
          <button
            data-testid="btn-confirm-cancel"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            data-testid="btn-confirm-ok"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" aria-hidden="true" />Deleting…</>
            ) : (
              "Yes, delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
