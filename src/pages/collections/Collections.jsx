import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CollectionTable from "../../components/ui/CollectionTable";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import { fetchCollections } from "../../redux/slice/collectionsSlice";
import { fetchDashboardSummary } from "../../redux/slice/dashboardSlice";
import { useCursorPagination } from "../../hooks/useCursorPagination";
import { Search, FolderHeart, Layers, Package } from "lucide-react";
import { collectionDetailPath } from "../../utils/collectionRoutes";
import "./Collections.css";

const PAGE_SIZE = 10;

const Collections = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.collections);
  const { summary } = useSelector((state) => state.dashboard);

  const [searchQuery, setSearchQuery] = useState("");
  const { currentAfter, canGoPrev, goNext, goPrev } = useCursorPagination(searchQuery);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCollections({
      after: currentAfter,
      limit: PAGE_SIZE,
      search: searchQuery || undefined,
    }));
  }, [dispatch, currentAfter, searchQuery]);

  const stats = {
    total: summary?.totalCollections ?? 0,
    totalProducts: summary?.totalProducts ?? items.reduce((acc, curr) => acc + (curr.productCount || 0), 0),
    onPage: items.reduce((acc, curr) => acc + (curr.productCount || 0), 0),
  };

  const handleNext = () => {
    if (pagination?.hasNextPage && pagination.nextCursor) {
      goNext(pagination.nextCursor);
    }
  };

  return (
    <div className="collections-page animated animated-fade-in">
      <div className="grid-stats">
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--primary">
            <FolderHeart size={20} />
          </div>
          <div>
            <span className="stat-label">Total Collections</span>
            <h4 className="stat-value">{stats.total}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--accent">
            <Package size={20} />
          </div>
          <div>
            <span className="stat-label">Variants With Margin Rules</span>
            <h4 className="stat-value">{stats.totalProducts}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--success">
            <Layers size={20} />
          </div>
          <div>
            <span className="stat-label">Products On Page</span>
            <h4 className="stat-value">{stats.onPage}</h4>
          </div>
        </div>
      </div>

      <div className="glass-card table-card">
        <div className="table-header">
          <div>
            <h3 className="section-title">Shopify Smart Collections</h3>
            <p className="section-desc">
              Click a collection to view its vendors and set margins per vendor for products in that collection.
            </p>
          </div>
          <span className="result-count">
            {stats.total} collections in store
          </span>
        </div>

        <div className="collections-table-toolbar">
          <div className="search-wrapper collections-table-search">
            <Search size={16} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search collections by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input"
              disabled={loading && items.length === 0}
            />
          </div>
        </div>

        {loading && items.length === 0 ? (
          <LoadingSkeleton type="table" count={5} />
        ) : (
          <CollectionTable
            collections={items}
            pagination={pagination}
            loading={loading}
            canGoPrev={canGoPrev}
            onNext={handleNext}
            onPrev={goPrev}
            onCollectionClick={(coll) =>
              navigate(collectionDetailPath(coll.shopifyCollectionId), {
                state: { title: coll.title },
              })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Collections;
