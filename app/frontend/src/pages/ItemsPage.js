import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../App";
import { itemsApi } from "../services/api";
import ItemModal from "../components/ItemModal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ItemsPage() {
  const { user, logout } = useAuth();

  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [successMsg,  setSuccessMsg]  = useState(null);

  // Filters
  const [search,       setSearch]      = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState(null); // null = create, object = edit

  // Confirm-delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (search)       filters.search = search;

      const res = await itemsApi.getAll(filters);

      if (res.success) {
        setItems(res.data.items);
      } else {
        setError(res._status === 500
          ? `Server error (may be transient): ${res.error}`
          : res.error || "Failed to load items"
        );
      }
    } catch {
      setError("Network error – is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function flash(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  }

  function openCreate() { setEditTarget(null); setModalOpen(true); }
  function openEdit(item) { setEditTarget(item); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditTarget(null); }

  async function handleSave(payload) {
    const res = editTarget
      ? await itemsApi.update(editTarget.id, payload)
      : await itemsApi.create(payload);

    if (res.success) {
      closeModal();
      flash(editTarget ? "Item updated." : "Item created.");
      fetchItems();
      return { ok: true };
    }
    return { ok: false, error: res.error };
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await itemsApi.delete(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        flash("Item deleted.");
        fetchItems();
      } else {
        setError(res.error || "Delete failed");
        setDeleteTarget(null);
      }
    } catch {
      setError("Network error during delete");
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div data-testid="items-page">
      {/* Topbar */}
      <div className="topbar">
        <h1>QA Demo – Task Manager</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span data-testid="logged-in-user">
            {user.username} ({user.role})
          </span>
          <button
            data-testid="btn-logout"
            className="btn-secondary btn-sm"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="page">
        {/* Alerts */}
        {error && (
          <div data-testid="page-error" className="alert alert-error" role="alert">
            {error}
            <button
              data-testid="btn-retry"
              className="btn-secondary btn-sm"
              style={{ marginLeft: 12 }}
              onClick={fetchItems}
            >
              Retry
            </button>
          </div>
        )}

        {successMsg && (
          <div data-testid="page-success" className="alert alert-success" role="status">
            {successMsg}
          </div>
        )}

        {/* Controls */}
        <div className="items-header">
          <h2>
            Items
            <span
              data-testid="items-count"
              style={{ fontSize: "0.8rem", fontWeight: 400, marginLeft: 8, color: "#666" }}
            >
              ({items.length})
            </span>
          </h2>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div className="filters">
              <input
                data-testid="filter-search"
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search items"
              />
              <select
                data-testid="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              data-testid="btn-create-item"
              className="btn-primary"
              onClick={openCreate}
            >
              + New item
            </button>

            <button
              data-testid="btn-refresh"
              className="btn-secondary"
              onClick={fetchItems}
              disabled={loading}
              aria-label="Refresh items"
            >
              {loading ? <span className="spinner" aria-hidden="true" /> : "↻"} Refresh
            </button>
          </div>
        </div>

        {/* List */}
        {loading && items.length === 0 ? (
          <div data-testid="items-loading" className="empty-state">
            <span className="spinner" />Loading items…
          </div>
        ) : items.length === 0 ? (
          <div data-testid="items-empty" className="empty-state">
            No items found. {search || statusFilter ? "Try different filters." : "Create one!"}
          </div>
        ) : (
          <div data-testid="items-list">
            {items.map((item) => (
              <div
                key={item.id}
                data-testid={`item-card-${item.id}`}
                className="item-card"
              >
                <div className="item-info">
                  <div className="item-title" data-testid={`item-title-${item.id}`}>
                    {item.title}
                  </div>
                  <div className="item-desc" data-testid={`item-desc-${item.id}`}>
                    {item.description}
                  </div>
                  <div className="item-meta">
                    <span
                      className={`badge badge-${item.status}`}
                      data-testid={`item-status-${item.id}`}
                    >
                      {item.status}
                    </span>
                    &nbsp;· Created {new Date(item.createdAt).toLocaleDateString()}
                    &nbsp;· ID: <code style={{ fontSize: "0.7rem" }}>{item.id}</code>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    data-testid={`btn-edit-${item.id}`}
                    className="btn-secondary btn-sm"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    Edit
                  </button>
                  <button
                    data-testid={`btn-delete-${item.id}`}
                    className="btn-danger btn-sm"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${item.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <ItemModal
          item={editTarget}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
