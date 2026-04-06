import React, { useState } from "react";

const STATUSES = ["active", "completed"];

export default function ItemModal({ item, onSave, onClose }) {
  const isEdit = Boolean(item);

  const [title,       setTitle]       = useState(item?.title       ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [status,      setStatus]      = useState(item?.status      ?? "active");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Basic client-side validation (mirrors server rules)
    if (!title.trim()) { setError("Title is required"); return; }
    if (title.trim().length > 120) { setError("Title must be 120 characters or fewer"); return; }

    setLoading(true);
    const result = await onSave({ title: title.trim(), description, status });
    setLoading(false);

    if (!result.ok) {
      setError(result.error || "Save failed – server may be experiencing issues. Please retry.");
    }
  }

  return (
    <div data-testid="item-modal-overlay" className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div data-testid="item-modal" className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 id="modal-title" data-testid="modal-title">
            {isEdit ? "Edit item" : "Create new item"}
          </h3>
          <button
            data-testid="btn-modal-close"
            className="btn-secondary btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <div data-testid="modal-error" className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <form data-testid="item-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="item-title">
              Title <span style={{ color: "#c5221f" }}>*</span>
            </label>
            <input
              id="item-title"
              data-testid="input-item-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short descriptive title"
              disabled={loading}
              maxLength={120}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-description">Description</label>
            <textarea
              id="item-description"
              data-testid="input-item-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional longer description…"
              disabled={loading}
              maxLength={1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-status">Status</label>
            <select
              id="item-status"
              data-testid="select-item-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button
              data-testid="btn-modal-cancel"
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              data-testid="btn-modal-save"
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" aria-hidden="true" />{isEdit ? "Saving…" : "Creating…"}</>
              ) : (
                isEdit ? "Save changes" : "Create item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
