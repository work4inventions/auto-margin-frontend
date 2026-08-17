import React from "react";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { formatMoney } from "../../utils/pricing";
import TableLoader from "./TableLoader";

const ProductTable = ({
  products,
  pagination,
  loading = false,
  canGoPrev = false,
  onNext,
  onPrev,
  itemsPerPage = 5,
}) => {
  const limit = pagination?.limit || itemsPerPage;
  const showPagination = pagination?.hasNextPage || canGoPrev;

  return (
    <div className="product-table-wrap">
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Collection</th>
              <th>Vendor</th>
              <th>Current Price</th>
              <th>Applied Margin</th>
              <th>Baseline Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">
                  <TableLoader label="Loading products..." />
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty-cell">
                  <div className="table-empty-content">
                    <Package size={28} className="table-empty-icon" />
                    <strong className="table-empty-title">No Products Available</strong>
                    <span className="table-empty-desc">Adjust search or filters, or try the next page.</span>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((prod) => {
                const margin = Number(prod.currentMargin) || 0;
                const baseline = prod.originalPrice != null
                  ? Number(prod.originalPrice)
                  : prod.currentPrice / (1 + margin / 100);

                return (
                  <tr key={prod.id} className="animated-fade-in">
                    <td>
                      <div className="product-cell-info">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="product-cell-thumb"
                            loading="lazy"
                          />
                        ) : (
                          <div className="product-cell-thumb product-cell-thumb--placeholder">
                            <Package size={16} />
                          </div>
                        )}
                        <div className="product-cell-text">
                          <span className="product-cell-title">{prod.title}</span>
                          <span className="product-cell-sku">{prod.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral product-cell-badge">{prod.collection}</span>
                    </td>
                    <td>
                      <span className="product-cell-vendor">{prod.vendor}</span>
                    </td>
                    <td>
                      <span className="product-cell-price">{formatMoney(prod.currentPrice)}</span>
                    </td>
                    <td>
                      <span className={`badge ${margin !== 0 ? "badge-success" : "badge-neutral"} product-cell-margin-badge`}>
                        {margin > 0 ? `+${margin}%` : `${margin}%`}
                      </span>
                    </td>
                    <td>
                      <span className="product-cell-baseline">{formatMoney(baseline)}</span>
                    </td>
                    <td>
                      <span className={`badge ${prod.status === "Active" ? "badge-success" : "badge-neutral"}`}>
                        {prod.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="table-pagination">
          <span className="table-pagination-info">
            Showing <strong>{products.length}</strong> variant{products.length === 1 ? "" : "s"} (page size {limit})
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

export default ProductTable;
