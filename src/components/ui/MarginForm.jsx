import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { calculatePriceWithMargin, clampMargin, formatMoney, MARGIN_MAX, MARGIN_MIN } from "../../utils/pricing";
import CustomDropdown from "../common/CustomDropdown";
import { setCollectionVendorMargin } from "../../redux/slice/collectionVendorsSlice";
import { fetchProducts } from "../../redux/slice/productsSlice";
import { Percent, TrendingUp, AlertCircle, Save } from "lucide-react";
import "./MarginForm.css";

const MarginForm = ({
  selectedVendorFromParent,
  onSaveSuccess,
  collectionId,
  collectionTitle,
  vendorsList,
}) => {
  const dispatch = useDispatch();
  const { saving } = useSelector((state) => state.collectionVendors);
  const { items: products } = useSelector((state) => state.products);

  const vendors = vendorsList ?? [];
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [marginVal, setMarginVal] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (selectedVendorFromParent) {
      setSelectedVendorName(selectedVendorFromParent.name);
      setMarginVal(selectedVendorFromParent.currentMargin ?? 0);
    } else if (vendors.length > 0 && !selectedVendorName) {
      setSelectedVendorName(vendors[0].name);
      setMarginVal(vendors[0].currentMargin ?? 0);
    }
  }, [selectedVendorFromParent, vendors, selectedVendorName]);

  const activeVendor = useMemo(
    () => vendors.find((v) => v.name === selectedVendorName) || vendors[0],
    [selectedVendorName, vendors]
  );

  useEffect(() => {
    if (activeVendor && collectionId) {
      setMarginVal(activeVendor.currentMargin ?? 0);
      dispatch(fetchProducts({
        limit: 1,
        vendor: activeVendor.name,
        collectionId,
      }));
    }
  }, [activeVendor?.name, collectionId, dispatch]);

  const sampleProduct = useMemo(() => {
    if (!activeVendor) return null;
    return products.find((p) => p.vendor === activeVendor.name) || products[0] || null;
  }, [activeVendor, products]);

  const numericMargin = clampMargin(marginVal);

  const priceCalculations = useMemo(() => {
    if (!sampleProduct) return null;
    const baseline = sampleProduct.originalPrice != null
      ? Number(sampleProduct.originalPrice)
      : sampleProduct.currentPrice / (1 + (Number(sampleProduct.currentMargin) || 0) / 100);
    const newPrice = calculatePriceWithMargin(baseline, numericMargin, activeVendor?.roundUpTo99 !== false);
    return {
      currentPrice: sampleProduct.currentPrice,
      currentMargin: sampleProduct.currentMargin,
      baseline,
      newPrice,
    };
  }, [sampleProduct, numericMargin, activeVendor?.roundUpTo99]);

  const handleMarginInput = (raw) => {
    if (raw === "" || raw === "-") {
      setMarginVal(raw);
      return;
    }
    setMarginVal(clampMargin(raw));
  };

  const handleMarginBlur = () => {
    setMarginVal(numericMargin);
  };

  const handleSaveClick = () => {
    if (selectedVendorFromParent) {
      confirmSave();
      return;
    }
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    if (!selectedVendorName || saving || !collectionId) {
      return;
    }

    try {
      await dispatch(setCollectionVendorMargin({
        collectionId,
        vendorName: selectedVendorName,
        marginPercentage: numericMargin,
        productCount: activeVendor?.productCount ?? 0,
      })).unwrap();

      setShowConfirm(false);
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      setShowConfirm(false);
    }
  };

  const showVendorPicker = !selectedVendorFromParent && vendors.length > 1;
  const itemCount = activeVendor?.productCount ?? 0;

  return (
    <div className="margin-form">
      {showVendorPicker && (
        <div className="form-group">
          <label className="form-label">Select vendor</label>
          <CustomDropdown
            value={selectedVendorName}
            onChange={setSelectedVendorName}
            aria-label="Select vendor"
            placeholder="Select vendor"
            options={vendors.map((v) => ({
              value: v.name,
              label: `${v.name} (${v.productCount} in collection)`,
            }))}
          />
        </div>
      )}

      <div className="margin-form-slider-card">
        <div className="margin-form-slider-header">
          <span className="margin-form-slider-title">
            <Percent size={14} aria-hidden style={{ verticalAlign: "middle", marginRight: 6 }} />
            Set margin rule
          </span>
          <div className="margin-form-current">
            <span>Current</span>
            <span className="badge badge-neutral">{activeVendor?.currentMargin ?? 0}%</span>
          </div>
        </div>

        <div className="margin-form-controls">
          <div className="margin-form-slider-track">
            <input
              type="range"
              min={MARGIN_MIN}
              max={MARGIN_MAX}
              step="1"
              value={numericMargin}
              onChange={(e) => handleMarginInput(e.target.value)}
              className="margin-form-range"
              aria-label="Margin percentage slider"
            />
            <div className="margin-form-range-labels">
              <span>{MARGIN_MIN}%</span>
              <span className="margin-form-range-value">{numericMargin}%</span>
              <span>{MARGIN_MAX}%</span>
            </div>
          </div>

          <div className="margin-form-number-box">
            <input
              type="number"
              min={MARGIN_MIN}
              max={MARGIN_MAX}
              value={marginVal}
              onChange={(e) => handleMarginInput(e.target.value)}
              onBlur={handleMarginBlur}
              className="margin-form-number-input"
              aria-label="Margin percentage"
            />
            <span className="margin-form-percent-sign" aria-hidden>%</span>
          </div>
        </div>

        <p className="margin-form-item-count">
          Applies to <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} for this vendor in the collection.
        </p>
      </div>

      {sampleProduct && priceCalculations && (
        <div className="margin-form-preview">
          <h4 className="margin-form-preview-title">
            <TrendingUp size={14} aria-hidden />
            Pricing preview
          </h4>
          <p className="margin-form-preview-product">{sampleProduct.title}</p>
          <div className="preview-grid">
            <div>
              <p className="preview-label">Store price</p>
              <p className="preview-value">{formatMoney(priceCalculations.currentPrice)}</p>
            </div>
            <div>
              <p className="preview-label">Original</p>
              <p className="preview-value">{formatMoney(priceCalculations.baseline)}</p>
            </div>
            <div>
              <p className="preview-label">New price</p>
              <p className="preview-value preview-value--success">{formatMoney(priceCalculations.newPrice)}</p>
            </div>
          </div>
          {numericMargin === 0 && (
            <div className="margin-form-restore-note">
              <AlertCircle size={14} aria-hidden />
              <p>
                0% restores original price <strong>{formatMoney(priceCalculations.baseline)}</strong> in Shopify.
              </p>
            </div>
          )}
          {numericMargin < 0 && (
            <div className="margin-form-restore-note">
              <AlertCircle size={14} aria-hidden />
              <p>
                Negative margin subtracts <strong>{Math.abs(numericMargin)}%</strong> from the original price.
              </p>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="btn-primary margin-form-save-btn"
        onClick={handleSaveClick}
        disabled={!selectedVendorName || saving || !collectionId}
      >
        <Save size={18} aria-hidden />
        <span>{saving ? "Applying..." : "Save & apply margin"}</span>
      </button>

      {showConfirm && createPortal(
        <div className="margins-modal-overlay animated-fade-in">
          <div className="glass-card margins-modal-panel">
            <h3 className="margins-modal-title">Confirm margin update</h3>
            <p className="margins-modal-body">
              Set <strong>{selectedVendorName}</strong> margin to <strong>{numericMargin}%</strong>
              {collectionTitle ? (
                <> in collection <strong>{collectionTitle}</strong>?</>
              ) : (
                "?"
              )}
            </p>
            <p className="margins-modal-footnote">
              Applies to <strong>{itemCount}</strong> variant{itemCount === 1 ? "" : "s"} in this collection only.
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

export default MarginForm;
