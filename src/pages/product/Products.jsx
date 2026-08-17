import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductTable from "../../components/ui/ProductTable";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import CustomDropdown from "../../components/common/CustomDropdown";
import { fetchProducts } from "../../redux/slice/productsSlice";
import { fetchCollections } from "../../redux/slice/collectionsSlice";
import { fetchVendorNames } from "../../redux/slice/productsSlice";
import { useCursorPagination } from "../../hooks/useCursorPagination";
import { Search, ShoppingBag, Eye, Layers } from "lucide-react";
import "./Products.css";

const PAGE_SIZE = 8;
const COLLECTIONS_PAGE_SIZE = 25;

const Products = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading } = useSelector((state) => state.products);
  const {
    items: collections,
    pagination: collectionsPagination,
    loadingMore: collectionsLoadingMore,
  } = useSelector((state) => state.collections);
  const { vendorNames } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const filterKey = `${searchQuery}|${selectedVendor}|${selectedCollection}`;
  const { currentAfter, canGoPrev, goNext, goPrev } = useCursorPagination(filterKey);

  useEffect(() => {
    dispatch(fetchCollections({ limit: COLLECTIONS_PAGE_SIZE }));
    dispatch(fetchVendorNames());
  }, [dispatch]);

  const loadMoreCollections = useCallback(() => {
    if (
      collectionsLoadingMore
      || !collectionsPagination?.hasNextPage
      || !collectionsPagination?.nextCursor
    ) {
      return;
    }
    dispatch(
      fetchCollections({
        after: collectionsPagination.nextCursor,
        limit: COLLECTIONS_PAGE_SIZE,
        append: true,
      })
    );
  }, [dispatch, collectionsPagination, collectionsLoadingMore]);

  useEffect(() => {
    dispatch(fetchProducts({
      after: currentAfter,
      limit: PAGE_SIZE,
      search: searchQuery || undefined,
      vendor: selectedVendor,
      collectionId: selectedCollection,
    }));
  }, [dispatch, currentAfter, searchQuery, selectedVendor, selectedCollection]);

  const vendorOptions = [
    { value: "all", label: "All Vendors" },
    ...vendorNames.map((name) => ({ value: name, label: name })),
  ];

  const collectionOptions = [
    { value: "all", label: "All Collections" },
    ...collections.map((c) => ({
      value: c.shopifyCollectionId || c.id,
      label: c.title,
    })),
  ];

  const handleNext = () => {
    if (pagination?.hasNextPage && pagination.nextCursor) {
      goNext(pagination.nextCursor);
    }
  };

  return (
    <div className="products-page animated animated-fade-in">
      <div className="grid-stats">
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--primary">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="stat-label">On This Page</span>
            <h4 className="stat-value">{items.length}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--accent">
            <Layers size={20} />
          </div>
          <div>
            <span className="stat-label">Active Margin (page)</span>
            <h4 className="stat-value">{items.filter((p) => p.currentMargin !== 0).length}</h4>
          </div>
        </div>
        <div className="glass-card stat-banner">
          <div className="stat-banner-icon stat-banner-icon--success">
            <Eye size={20} />
          </div>
          <div>
            <span className="stat-label">Source</span>
            <h4 className="stat-value" style={{ fontSize: "1rem" }}>Shopify Live</h4>
          </div>
        </div>
      </div>

      <div className="glass-card table-card">
        <div className="table-header">
          <div>
            <h3 className="section-title">Shopify Active Inventory</h3>
            <p className="section-desc">
              Variants load live from Shopify with cursor pagination, search, and filters.
            </p>
          </div>
        </div>

        <div className="products-table-toolbar">
          <div className="search-wrapper products-table-search">
            <Search size={16} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search products by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field search-input"
              disabled={loading && items.length === 0}
            />
          </div>
          <div className="products-table-filter">
            <CustomDropdown
              value={selectedVendor}
              onChange={setSelectedVendor}
              aria-label="Filter by vendor"
              options={vendorOptions}
            />
          </div>
          <div className="products-table-filter">
            <CustomDropdown
              value={selectedCollection}
              onChange={setSelectedCollection}
              aria-label="Filter by collection"
              options={collectionOptions}
              hasMore={Boolean(collectionsPagination?.hasNextPage)}
              loadingMore={collectionsLoadingMore}
              onLoadMore={loadMoreCollections}
            />
          </div>
        </div>

        {loading && items.length === 0 ? (
          <LoadingSkeleton type="table" count={8} />
        ) : !loading && items.length === 0 ? (
          <div className="empty-state">
            <strong className="empty-state-title">No Products Found</strong>
            <span className="empty-state-desc">Try adjusting your filters or go to the next page.</span>
          </div>
        ) : (
          <ProductTable
            products={items}
            pagination={{ ...pagination, limit: PAGE_SIZE }}
            loading={loading}
            canGoPrev={canGoPrev}
            onNext={handleNext}
            onPrev={goPrev}
            itemsPerPage={PAGE_SIZE}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
