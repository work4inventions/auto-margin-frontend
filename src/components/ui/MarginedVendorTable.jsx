import React from "react";
import { Users, FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";

const formatUpdatedAt = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "badge-success";
    case "applying":
      return "badge-warning";
    case "failed":
      return "badge-danger";
    default:
      return "badge-neutral";
  }
};

const MarginedVendorTable = ({
  vendors,
  pagination,
  loading = false,
  onNext,
  onPrev,
  onRowClick,
}) => {
  const limit = pagination?.limit || vendors.length;
  const showPagination = pagination?.hasNextPage || pagination?.hasPreviousPage;

  return (
    <div className="margined-vendor-table-wrap">
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Collection</th>
              <th>Margin</th>
              <th>Items in collection</th>
              <th>Status</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="table-empty-cell">
                  Loading vendors with margins...
                </td>
              </tr>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-cell">
                  <div className="table-empty-content">
                    <Users size={28} className="table-empty-icon" />
                    <strong className="table-empty-title">No margins set yet</strong>
                    <span className="table-empty-desc">
                      Open a collection, set a vendor margin, and it will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              vendors.map((row) => (
                <tr
                  key={row.id}
                  className={onRowClick ? "margined-vendor-row-clickable animated-fade-in" : "animated-fade-in"}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  tabIndex={onRowClick ? 0 : undefined}
                  role={onRowClick ? "button" : undefined}
                >
                  <td>
                    <div className="margined-vendor-cell">
                      <div className="margined-vendor-cell-icon">
                        <Users size={16} />
                      </div>
                      <span className="margined-vendor-name">{row.vendorName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral product-cell-badge">
                      <FolderOpen size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
                      {row.collectionTitle}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">{row.marginPercentage}%</span>
                  </td>
                  <td>{row.productCount}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="text-muted-cell">{formatUpdatedAt(row.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="table-pagination">
          <span className="pagination-info">
            Showing {vendors.length} of {pagination?.total ?? vendors.length} vendor
            {(pagination?.total ?? vendors.length) === 1 ? "" : "s"} with margin
            {pagination?.page ? ` (page ${pagination.page})` : ""}
          </span>
          <div className="pagination-actions">
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={!pagination?.hasPreviousPage || loading}
              onClick={onPrev}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              disabled={!pagination?.hasNextPage || loading}
              onClick={onNext}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarginedVendorTable;
