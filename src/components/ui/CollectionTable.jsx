import React from "react";
import { FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import TableLoader from "./TableLoader";

const CollectionTable = ({
  collections,
  pagination,
  loading = false,
  canGoPrev = false,
  onNext,
  onPrev,
  onCollectionClick,
}) => {
  const limit = pagination?.limit || collections.length;
  const showPagination = pagination?.hasNextPage || canGoPrev;

  return (
    <div className="collection-table-wrap">
      <div className="table-container animated-fade-in">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>Product Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="table-empty-cell">
                  <TableLoader label="Loading collections..." />
                </td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan="2" className="table-empty-cell">
                  No collections found.
                </td>
              </tr>
            ) : (
              collections.map((coll) => (
                <tr
                  key={coll.id}
                  className={onCollectionClick ? "collection-row-clickable" : undefined}
                  onClick={() => onCollectionClick?.(coll)}
                  onKeyDown={(e) => {
                    if (onCollectionClick && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onCollectionClick(coll);
                    }
                  }}
                  tabIndex={onCollectionClick ? 0 : undefined}
                  role={onCollectionClick ? "button" : undefined}
                >
                  <td>
                    <div className="collection-cell-info">
                      {coll.image ? (
                        <img src={coll.image} alt={coll.title} className="collection-cell-thumb" />
                      ) : (
                        <div className="collection-cell-thumb collection-cell-thumb--placeholder">
                          <FolderOpen size={16} />
                        </div>
                      )}
                      <span className="collection-cell-title">{coll.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="collection-cell-count">{coll.productCount} products</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="table-pagination">
          <span className="table-pagination-info">
            Showing <strong>{collections.length}</strong> collection{collections.length === 1 ? "" : "s"} per page (max {limit})
          </span>
          <div className="table-pagination-actions">
            <button
              type="button"
              className="btn-secondary table-pagination-btn"
              onClick={onPrev}
              disabled={!canGoPrev || loading}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>
            <button
              type="button"
              className="btn-secondary table-pagination-btn"
              onClick={onNext}
              disabled={!pagination?.hasNextPage || loading}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionTable;
