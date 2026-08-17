import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { calculatePriceWithMargin, formatMoney, roundUpTo99 } from "../../utils/pricing";
import { setCollectionVendorRoundUp } from "../../redux/slice/collectionVendorsSlice";
import { fetchProducts } from "../../redux/slice/productsSlice";
import { Hash, TrendingUp, Save } from "lucide-react";
import "./MarginForm.css";

const RoundUpForm = ({
  selectedVendorFromParent,
  onSaveSuccess,
  collectionId,
  collectionTitle,
}) => {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.collectionVendors);
  const { items: products } = useSelector((state) => state.products);

  const [roundUpEnabled, setRoundUpEnabled] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (selectedVendorFromParent) {
      setRoundUpEnabled(selectedVendorFromParent.roundUpTo99 !== false);
    }
  }, [selectedVendorFromParent]);

  useEffect(() => {
    if (selectedVendorFromParent && collectionId) {
      dispatch(fetchProducts({
        limit: 1,
        vendor: selectedVendorFromParent.name,
        collectionId,
      }));
    }
  }, [selectedVendorFromParent?.name, collectionId, dispatch]);

  const sampleProduct = useMemo(() => {
    if (!selectedVendorFromParent) return null;
    return products.find((p) => p.vendor === selectedVendorFromParent.name) || products[0] || null;
  }, [selectedVendorFromParent, products]);

  const pricePreview = useMemo(() => {
    if (!sampleProduct) return null;
    const baseline = sampleProduct.originalPrice != null
      ? Number(sampleProduct.originalPrice)
      : sampleProduct.currentPrice / (1 + (Number(sampleProduct.currentMargin) || 0) / 100);
    const margin = Number(selectedVendorFromParent?.currentMargin) || 0;
    const rawPrice = baseline * (1 + margin / 100);
    const newPrice = calculatePriceWithMargin(baseline, margin, roundUpEnabled);

    return {
      title: sampleProduct.title,
      baseline,
      rawPrice,
      newPrice,
      exampleRaw: 378,
      exampleRounded: roundUpTo99(378),
    };
  }, [sampleProduct, selectedVendorFromParent, roundUpEnabled]);

  const confirmSave = async () => {
    if (!selectedVendorFromParent || saving || !collectionId) return;

    try {
      await dispatch(setCollectionVendorRoundUp({
        collectionId,
        vendorName: selectedVendorFromParent.name,
        roundUpTo99: roundUpEnabled,
        productCount: selectedVendorFromParent.productCount ?? 0,
      })).unwrap();

      setShowConfirm(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      setShowConfirm(false);
    }
  };

  const itemCount = selectedVendorFromParent?.productCount ?? 0;

  return (
    <div className="margin-form">
      <div className="margin-form-slider-card">
        <div className="margin-form-slider-header">
          <span className="margin-form-slider-title">
            <Hash size={14} aria-hidden style={{ verticalAlign: "middle", marginRight: 6 }} />
            Round up price to $99
          </span>
          <div className="margin-form-current">
            <span>Current</span>
            <span className={`badge ${selectedVendorFromParent?.roundUpTo99 !== false ? "badge-success" : "badge-neutral"}`}>
              {selectedVendorFromParent?.roundUpTo99 !== false ? "On" : "Off"}
            </span>
          </div>
        </div>

        <label className="round-up-toggle">
          <input
            type="checkbox"
            checked={roundUpEnabled}
            onChange={(e) => setRoundUpEnabled(e.target.checked)}
          />
          <span className="round-up-toggle-label">
            Round prices up to nearest <strong>$99</strong> (e.g. 378 → 399)
          </span>
        </label>

        <p className="margin-form-item-count">
          Applies to <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} for this vendor
          {selectedVendorFromParent?.currentMargin !== 0 && (
            <> at <strong>{selectedVendorFromParent.currentMargin}%</strong> margin</>
          )}.
        </p>
      </div>

      {pricePreview && (
        <div className="margin-form-preview">
          <h4 className="margin-form-preview-title">
            <TrendingUp size={14} aria-hidden />
            Pricing preview
          </h4>
          <p className="margin-form-preview-product">{pricePreview.title}</p>
          <div className="preview-grid">
            <div>
              <p className="preview-label">Original</p>
              <p className="preview-value">{formatMoney(pricePreview.baseline)}</p>
            </div>
            <div>
              <p className="preview-label">With margin</p>
              <p className="preview-value">{formatMoney(pricePreview.rawPrice)}</p>
            </div>
            <div>
              <p className="preview-label">Final price</p>
              <p className="preview-value preview-value--success">{formatMoney(pricePreview.newPrice)}</p>
            </div>
          </div>
          <p className="round-up-example">
            Example: {formatMoney(pricePreview.exampleRaw)} → {formatMoney(pricePreview.exampleRounded)}
          </p>
        </div>
      )}

      <button
        type="button"
        className="btn-primary margin-form-save-btn"
        onClick={() => setShowConfirm(true)}
        disabled={!selectedVendorFromParent || saving || !collectionId}
      >
        <Save size={18} aria-hidden />
        <span>{saving ? "Applying..." : "Save & apply round up"}</span>
      </button>

      {showConfirm && createPortal(
        <div className="margins-modal-overlay animated-fade-in">
          <div className="glass-card margins-modal-panel">
            <h3 className="margins-modal-title">Confirm round up rule</h3>
            <p className="margins-modal-body">
              Turn round up to $99 <strong>{roundUpEnabled ? "ON" : "OFF"}</strong> for{" "}
              <strong>{selectedVendorFromParent?.name}</strong>
              {collectionTitle ? (
                <> in collection <strong>{collectionTitle}</strong>?</>
              ) : (
                "?"
              )}
            </p>
            <p className="margins-modal-footnote">
              Re-applies prices for <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} in this collection.
            </p>
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

export default RoundUpForm;
