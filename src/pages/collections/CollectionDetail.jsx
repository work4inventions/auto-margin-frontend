import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Layers, Sparkles, X, AlertCircle } from "lucide-react";
import VendorCard from "../../components/ui/VendorCard";
import MarginForm from "../../components/ui/MarginForm";
import RoundUpForm from "../../components/ui/RoundUpForm";
import CompareAtForm from "../../components/ui/CompareAtForm";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import {
  clearCollectionVendors,
  fetchCollectionVendors,
} from "../../redux/slice/collectionVendorsSlice";
import { fetchProducts } from "../../redux/slice/productsSlice";
import { fetchSyncLogs } from "../../redux/slice/syncLogsSlice";
import { decodeCollectionId } from "../../utils/collectionRoutes";
import "./CollectionDetail.css";

const CollectionDetail = () => {
  const { collectionId: encodedId } = useParams();
  const collectionId = decodeCollectionId(encodedId);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { collection, items, loading, cacheRefreshing } = useSelector(
    (state) => state.collectionVendors
  );
  const [editingVendor, setEditingVendor] = useState(null);
  const [editingRoundUpVendor, setEditingRoundUpVendor] = useState(null);
  const [editingCompareAtVendor, setEditingCompareAtVendor] = useState(null);

  const collectionTitle = collection?.title || location.state?.title || "Collection";

  useEffect(() => {
    if (collectionId) {
      dispatch(fetchCollectionVendors(collectionId));
    }
    return () => {
      dispatch(clearCollectionVendors());
    };
  }, [dispatch, collectionId]);

  useEffect(() => {
    if (!collectionId || !cacheRefreshing) return undefined;
    const timer = setTimeout(() => {
      dispatch(fetchCollectionVendors(collectionId));
    }, 10000);
    return () => clearTimeout(timer);
  }, [dispatch, collectionId, cacheRefreshing]);

  const activeVendorCount = items.filter((v) => v.status === "Active").length;
  const averageMargin = items.length > 0
    ? (items.reduce((acc, curr) => acc + curr.currentMargin, 0) / items.length).toFixed(1)
    : 0;
  const totalProducts = items.reduce((acc, curr) => acc + curr.productCount, 0);

  return (
    <div className="collection-detail-page animated animated-fade-in">
      <button
        type="button"
        className="btn-secondary collection-detail-back"
        onClick={() => navigate("/collections")}
      >
        <ArrowLeft size={16} />
        <span>Back to Collections</span>
      </button>

      <div className="collection-detail-hero glass-card">
        <div>
          <h2 className="collection-detail-title">{collectionTitle}</h2>
          <p className="collection-detail-subtitle">
            Vendors in this collection — set margin per vendor. Prices update only for that vendor&apos;s products in this collection.
          </p>
        </div>
      </div>

      <div className="grid-stats">
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--primary">
            <Users size={20} />
          </div>
          <div>
            <span className="stat-label">Vendors</span>
            <h4 className="stat-value">{items.length}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--success">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="stat-label">Active Margins</span>
            <h4 className="stat-value">{activeVendorCount}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--warning">
            <Layers size={20} />
          </div>
          <div>
            <span className="stat-label">Products (variants)</span>
            <h4 className="stat-value">{totalProducts}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--accent">
            <Layers size={20} />
          </div>
          <div>
            <span className="stat-label">Avg Margin</span>
            <h4 className="stat-value">{averageMargin}%</h4>
          </div>
        </div>
      </div>

      <div className="collection-detail-section">
        <header className="collection-detail-section-header">
          <h3 className="section-title">Collection Vendors</h3>
          <p className="section-desc">
            Each vendor below has products in <strong>{collectionTitle}</strong>. Use Adjust Margin, Adjust Round Up, or Remove Compare-at to set pricing for that vendor in this collection only.
          </p>
        </header>

        {loading && items.length === 0 ? (
          <LoadingSkeleton type="card" />
        ) : items.length === 0 ? (
          <div className="glass-card empty-card">
            <AlertCircle size={32} className="empty-card-icon" />
            <h4>No Vendors in This Collection</h4>
            <p className="empty-card-desc">
              Add products with vendor names to this collection in Shopify, then refresh.
            </p>
          </div>
        ) : (
          <div className="collection-vendors-grid">
            {items.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                onEditMargin={(v) => setEditingVendor(v)}
                onEditRoundUp={(v) => setEditingRoundUpVendor(v)}
                onEditCompareAt={(v) => setEditingCompareAtVendor(v)}
              />
            ))}
          </div>
        )}
      </div>

      {editingVendor && createPortal(
        <div className="collection-detail-modal-overlay animated-fade-in">
          <div className="glass-card collection-detail-modal-panel">
            <div className="collection-detail-modal-header">
              <div>
                <h3 className="collection-detail-modal-title">Adjust margin</h3>
                <p className="collection-detail-modal-subtitle">
                  <strong>{editingVendor.name}</strong>
                  <span className="collection-detail-modal-subtitle-sep"> · </span>
                  <span>{collectionTitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVendor(null)}
                className="icon-btn collection-detail-modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="collection-detail-modal-body">
            <MarginForm
              selectedVendorFromParent={editingVendor}
              collectionId={collectionId}
              collectionTitle={collectionTitle}
              vendorsList={items}
              onSaveSuccess={() => {
                const vendorName = editingVendor?.name;
                setEditingVendor(null);
                dispatch(fetchCollectionVendors(collectionId));
                if (vendorName) {
                  dispatch(fetchProducts({
                    limit: 20,
                    vendor: vendorName,
                    collectionId,
                  }));
                }
                dispatch(fetchSyncLogs({ page: 1, limit: 10 }));
              }}
            />
            </div>
          </div>
        </div>,
        document.body
      )}

      {editingRoundUpVendor && createPortal(
        <div className="collection-detail-modal-overlay animated-fade-in">
          <div className="glass-card collection-detail-modal-panel">
            <div className="collection-detail-modal-header">
              <div>
                <h3 className="collection-detail-modal-title">Adjust round up</h3>
                <p className="collection-detail-modal-subtitle">
                  <strong>{editingRoundUpVendor.name}</strong>
                  <span className="collection-detail-modal-subtitle-sep"> · </span>
                  <span>{collectionTitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoundUpVendor(null)}
                className="icon-btn collection-detail-modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="collection-detail-modal-body">
              <RoundUpForm
                selectedVendorFromParent={editingRoundUpVendor}
                collectionId={collectionId}
                collectionTitle={collectionTitle}
                onSaveSuccess={() => {
                  const vendorName = editingRoundUpVendor?.name;
                  setEditingRoundUpVendor(null);
                  dispatch(fetchCollectionVendors(collectionId));
                  if (vendorName) {
                    dispatch(fetchProducts({
                      limit: 20,
                      vendor: vendorName,
                      collectionId,
                    }));
                  }
                  dispatch(fetchSyncLogs({ page: 1, limit: 10 }));
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {editingCompareAtVendor && createPortal(
        <div className="collection-detail-modal-overlay animated-fade-in">
          <div className="glass-card collection-detail-modal-panel">
            <div className="collection-detail-modal-header">
              <div>
                <h3 className="collection-detail-modal-title">Remove compare-at price</h3>
                <p className="collection-detail-modal-subtitle">
                  <strong>{editingCompareAtVendor.name}</strong>
                  <span className="collection-detail-modal-subtitle-sep"> · </span>
                  <span>{collectionTitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCompareAtVendor(null)}
                className="icon-btn collection-detail-modal-close-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="collection-detail-modal-body">
              <CompareAtForm
                selectedVendorFromParent={editingCompareAtVendor}
                collectionId={collectionId}
                collectionTitle={collectionTitle}
                onSaveSuccess={() => {
                  const vendorName = editingCompareAtVendor?.name;
                  setEditingCompareAtVendor(null);
                  dispatch(fetchCollectionVendors(collectionId));
                  if (vendorName) {
                    dispatch(fetchProducts({
                      limit: 20,
                      vendor: vendorName,
                      collectionId,
                    }));
                  }
                  dispatch(fetchSyncLogs({ page: 1, limit: 10 }));
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CollectionDetail;
