import React from "react";
import { Sliders, Package, TrendingDown, TrendingUp, Hash, Tag } from "lucide-react";
import { clampMargin, MARGIN_MAX, MARGIN_MIN } from "../../utils/pricing";
import "./VendorCard.css";

const VendorCard = ({ vendor, onEditMargin, onEditRoundUp, onEditCompareAt }) => {
  const { name, productCount, currentMargin, roundUpTo99, removeCompareAtPrice, status } = vendor;
  const margin = clampMargin(currentMargin);
  const isMinus = margin < 0;
  const isActive = status?.toLowerCase() === "active" || margin !== 0;
  const marginFillPercent = ((margin - MARGIN_MIN) / (MARGIN_MAX - MARGIN_MIN)) * 100;
  const roundUpOn = roundUpTo99 !== false;
  const compareAtOn = removeCompareAtPrice === true;
  const variantLabel = productCount === 1 ? "variant" : "variants";

  return (
    <article className="vendor-card animated-fade-in">
      <div className="vendor-card-top">
        <div className="vendor-card-heading">
          <h4 className="vendor-card-name">{name}</h4>
          <p className="vendor-card-meta">
            <Package size={14} aria-hidden />
            <span>
              <strong>{productCount}</strong> {variantLabel} in collection
            </span>
          </p>
        </div>
        <span
          className={`vendor-card-status ${isActive ? "vendor-card-status--active" : "vendor-card-status--inactive"}`}
        >
          {isActive && <span className="vendor-card-status-dot" aria-hidden />}
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="vendor-card-margin-section">
        <div className="vendor-card-margin-section-header">
          <span className="vendor-card-margin-section-label">Margin rule</span>
          <span className="vendor-card-margin-section-value">{margin}%</span>
        </div>
        <div
          className="vendor-card-progress-track"
          role="progressbar"
          aria-valuenow={margin}
          aria-valuemin={MARGIN_MIN}
          aria-valuemax={MARGIN_MAX}
          aria-label={`Margin ${margin} percent`}
        >
          <div
            className={`vendor-card-progress-fill ${
              isMinus
                ? "vendor-card-progress-fill--minus"
                : isActive
                  ? "vendor-card-progress-fill--active"
                  : ""
            }`}
            style={{ width: `${Math.max(marginFillPercent, margin === 0 ? 0 : 4)}%` }}
          />
        </div>
      </div>

      <div className="vendor-card-margin-section">
        <div className="vendor-card-margin-section-header">
          <span className="vendor-card-margin-section-label">Round up rule</span>
          <span className="vendor-card-margin-section-value">{roundUpOn ? "$99" : "Off"}</span>
        </div>
        <div
          className="vendor-card-progress-track"
          role="progressbar"
          aria-valuenow={roundUpOn ? 100 : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={roundUpOn ? "Round up to 99 enabled" : "Round up disabled"}
        >
          <div
            className={`vendor-card-progress-fill ${roundUpOn ? "vendor-card-progress-fill--roundup" : ""}`}
            style={{ width: roundUpOn ? "100%" : "0%" }}
          />
        </div>
      </div>

      <div className="vendor-card-margin-section">
        <div className="vendor-card-margin-section-header">
          <span className="vendor-card-margin-section-label">Compare-at rule</span>
          <span className="vendor-card-margin-section-value">{compareAtOn ? "Remove" : "Off"}</span>
        </div>
        <div
          className="vendor-card-progress-track"
          role="progressbar"
          aria-valuenow={compareAtOn ? 100 : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={compareAtOn ? "Compare-at removal enabled" : "Compare-at removal disabled"}
        >
          <div
            className={`vendor-card-progress-fill ${compareAtOn ? "vendor-card-progress-fill--compareat" : ""}`}
            style={{ width: compareAtOn ? "100%" : "0%" }}
          />
        </div>
      </div>

      <div className="vendor-card-footer">
        <div className="vendor-card-margin-summary">
          <span className="vendor-card-margin-label">Current margin</span>
          <div className="vendor-card-margin-row">
            <span
              className={`vendor-card-margin-value ${
                isMinus
                  ? "vendor-card-margin-value--minus"
                  : isActive
                    ? "vendor-card-margin-value--active"
                    : ""
              }`}
            >
              {margin}%
            </span>
            {isActive ? (
              <span className={`vendor-card-margin-badge ${
                isMinus
                  ? "vendor-card-margin-badge--minus"
                  : "vendor-card-margin-badge--active"
              }`}>
                {isMinus ? <TrendingDown size={11} aria-hidden /> : <TrendingUp size={11} aria-hidden />}
                {isMinus ? "Minus" : "Applied"}
              </span>
            ) : (
              <span className="vendor-card-margin-badge vendor-card-margin-badge--flat">
                Not set
              </span>
            )}
          </div>
        </div>

        <div className="vendor-card-actions">
          <button
            type="button"
            className="btn-adjust-margin"
            onClick={() => onEditMargin(vendor)}
          >
            <Sliders size={15} aria-hidden />
            <span>Adjust margin</span>
          </button>
          <button
            type="button"
            className="btn-adjust-roundup"
            onClick={() => onEditRoundUp(vendor)}
          >
            <Hash size={15} aria-hidden />
            <span>Adjust round up</span>
          </button>
          <button
            type="button"
            className="btn-adjust-compareat"
            onClick={() => onEditCompareAt(vendor)}
          >
            <Tag size={15} aria-hidden />
            <span>Remove compare-at</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default VendorCard;
