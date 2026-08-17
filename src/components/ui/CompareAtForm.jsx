import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCollectionVendorRemoveCompareAt } from "../../redux/slice/collectionVendorsSlice";
import { Tag, Save } from "lucide-react";
import "./MarginForm.css";

const CompareAtForm = ({
  selectedVendorFromParent,
  onSaveSuccess,
  collectionId,
  collectionTitle,
}) => {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.collectionVendors);

  const [removeEnabled, setRemoveEnabled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (selectedVendorFromParent) {
      setRemoveEnabled(selectedVendorFromParent.removeCompareAtPrice === true);
    }
  }, [selectedVendorFromParent]);

  const confirmSave = async () => {
    if (!selectedVendorFromParent || saving || !collectionId) return;

    try {
      await dispatch(setCollectionVendorRemoveCompareAt({
        collectionId,
        vendorName: selectedVendorFromParent.name,
        removeCompareAtPrice: removeEnabled,
        productCount: selectedVendorFromParent.productCount ?? 0,
      })).unwrap();

      setShowConfirm(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      setShowConfirm(false);
    }
  };

  const itemCount = selectedVendorFromParent?.productCount ?? 0;
  const currentlyOn = selectedVendorFromParent?.removeCompareAtPrice === true;

  return (
    <div className="margin-form">
      <div className="margin-form-slider-card">
        <div className="margin-form-slider-header">
          <span className="margin-form-slider-title">
            <Tag size={14} aria-hidden style={{ verticalAlign: "middle", marginRight: 6 }} />
            Remove compare-at price
          </span>
          <div className="margin-form-current">
            <span>Current</span>
            <span className={`badge ${currentlyOn ? "badge-success" : "badge-neutral"}`}>
              {currentlyOn ? "On" : "Off"}
            </span>
          </div>
        </div>

        <label className="round-up-toggle">
          <input
            type="checkbox"
            checked={removeEnabled}
            onChange={(e) => setRemoveEnabled(e.target.checked)}
          />
          <span className="round-up-toggle-label">
            Clear compare-at price in Shopify (<strong>compareAtPrice: null</strong>)
          </span>
        </label>

        <p className="margin-form-item-count">
          Applies to <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} for this vendor
          in this collection.
        </p>
      </div>

      <div className="margin-form-preview">
        <h4 className="margin-form-preview-title">
          <Tag size={14} aria-hidden />
          What this does
        </h4>
        <p className="round-up-example">
          When enabled, compare-at prices are removed from all variants for this vendor in Shopify.
          Future margin updates will also clear compare-at when this rule is on.
        </p>
      </div>

      <button
        type="button"
        className="btn-primary margin-form-save-btn"
        onClick={() => setShowConfirm(true)}
        disabled={!selectedVendorFromParent || saving || !collectionId}
      >
        <Save size={18} aria-hidden />
        <span>{saving ? "Applying..." : "Save & apply compare-at rule"}</span>
      </button>

      {showConfirm && createPortal(
        <div className="margins-modal-overlay animated-fade-in">
          <div className="glass-card margins-modal-panel">
            <h3 className="margins-modal-title">Confirm compare-at rule</h3>
            <p className="margins-modal-body">
              Turn compare-at removal <strong>{removeEnabled ? "ON" : "OFF"}</strong> for{" "}
              <strong>{selectedVendorFromParent?.name}</strong>
              {collectionTitle ? (
                <> in collection <strong>{collectionTitle}</strong>?</>
              ) : (
                "?"
              )}
            </p>
            {removeEnabled && (
              <p className="margins-modal-footnote">
                Clears compare-at price on <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} in Shopify.
              </p>
            )}
            {!removeEnabled && (
              <p className="margins-modal-footnote">
                Compare-at prices will no longer be cleared on future margin updates for this vendor.
              </p>
            )}
            <div className="margins-modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={confirmSave} disabled={saving}>Confirm</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CompareAtForm;
