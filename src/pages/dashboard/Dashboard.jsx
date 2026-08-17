import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import ChartCard from "../../components/ui/ChartCard";
import MarginedVendorTable from "../../components/ui/MarginedVendorTable";
import CustomDropdown from "../../components/common/CustomDropdown";
import {
  fetchDashboardSummary,
  fetchDashboardAnalytics,
  fetchMarginedVendors,
} from "../../redux/slice/dashboardSlice";
import { fetchSyncLogs } from "../../redux/slice/syncLogsSlice";
import { collectionDetailPath } from "../../utils/collectionRoutes";
import {
  Folder,
  ShoppingBag,
  Users,
  Percent,
  ArrowUpRight,
  Activity,
  Sparkles,
  RefreshCcw,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Dashboard.css";
import "../../components/ui/MarginedVendorTable.css";

const getActivityIconClass = (type) => {
  if (type === "shopify_sync") return "activity-item-icon--shopify_sync";
  if (type === "margin_update") return "activity-item-icon--margin_update";
  return "activity-item-icon--default";
};

const VENDORS_PAGE_SIZE = 10;

const truncateChartLabel = (value) => {
  const text = String(value);
  return text.length > 14 ? `${text.slice(0, 12)}…` : text;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { summary, loading: summaryLoading, analytics, analyticsLoading } = useSelector(
    (state) => state.dashboard
  );
  const {
    marginedVendors,
    marginedVendorsPagination,
    marginedVendorsLoading,
  } = useSelector((state) => state.dashboard);
  const { items: activities, loading: logsLoading } = useSelector((state) => state.syncLogs);
  const [chartRange, setChartRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorPage, setVendorPage] = useState(1);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchSyncLogs({ page: 1, limit: 10 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardAnalytics(chartRange));
  }, [dispatch, chartRange]);

  useEffect(() => {
    setVendorPage(1);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchMarginedVendors({
        page: vendorPage,
        limit: VENDORS_PAGE_SIZE,
        search: searchQuery,
      })
    );
  }, [dispatch, vendorPage, searchQuery]);

  const marginActivityData = analytics?.marginActivity ?? [];
  const vendorPerformanceData = analytics?.vendorPerformance ?? [];

  const stats = {
    totalColl: summary?.totalCollections ?? 0,
    totalProd: summary?.totalProducts ?? 0,
    totalVendors: summary?.totalVendors ?? 0,
    avgMargin: summary?.avgMargin ?? 0,
    updatedProdCount: summary?.updatedProductsCount ?? 0,
  };

  const handleVendorsNext = () => {
    if (marginedVendorsPagination?.hasNextPage) {
      setVendorPage((p) => p + 1);
    }
  };

  const handleVendorsPrev = () => {
    if (marginedVendorsPagination?.hasPreviousPage) {
      setVendorPage((p) => Math.max(1, p - 1));
    }
  };

  const handleVendorRowClick = (row) => {
    if (!row.shopifyCollectionId) return;
    navigate(collectionDetailPath(row.shopifyCollectionId), {
      state: { title: row.collectionTitle },
    });
  };

  return (
    <div className="dashboard-page animated animated-fade-in">
      <div className="glass-card hero-banner">
        <div>
          <h2 className="hero-title">
            Profit Margin Intelligence Dashboard
            <Sparkles size={18} className="hero-title-icon" />
          </h2>
          <p className="hero-desc">
            Vendors listed here have a margin set on a collection. Open a row to view or edit that collection.
          </p>
        </div>
      </div>

      <div className="grid-stats">
        <StatCard title="Total Collections" value={stats.totalColl} icon={Folder} change={0} changeType="neutral" desc="From Shopify store" color="#36CFC9" />
        <StatCard title="Tracked Variants" value={stats.totalProd} icon={ShoppingBag} change={0} changeType="neutral" desc="Variants with saved margin state" color="#5C6AC4" />
        <StatCard title="Vendors With Margin" value={stats.totalVendors} icon={Users} change={0} changeType="neutral" desc="Collection vendors with margin &gt; 0%" color="#008060" />
        <StatCard title="Average Profit Margin" value={`${stats.avgMargin}%`} icon={Percent} change={0} changeType="neutral" desc="Across vendors with margin set" color="#FFC453" />
        <StatCard title="Items Under Margin" value={stats.updatedProdCount} icon={ArrowUpRight} change={stats.updatedProdCount > 0 ? 100 : 0} changeType="up" desc="Variants in margined vendor rules" color="#0070F3" />
      </div>

      <div className="grid-dashboard">
        <ChartCard
          title="Margin price updates"
          subtitle={
            analyticsLoading
              ? "Loading activity from margin apply logs..."
              : "Successful Shopify price updates from margin apply (last 4 weeks or 6 months)"
          }
          actions={
            <CustomDropdown
              size="sm"
              className="chart-range-dropdown"
              value={chartRange}
              onChange={setChartRange}
              aria-label="Chart date range"
              options={[
                { value: "month", label: "Last 4 weeks" },
                { value: "year", label: "Last 6 months" },
              ]}
            />
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={marginActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={false}
                formatter={(value, name) => {
                  if (name === "Price impact ($)") {
                    return [`$${Number(value).toFixed(2)}`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                name="Price updates"
                type="monotone"
                dataKey="updates"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUpdates)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Vendors by items under margin"
          subtitle={
            analyticsLoading
              ? "Loading vendor margin data..."
              : vendorPerformanceData.length === 0
                ? "Set margins on collections to see vendor breakdown"
                : "Top vendors with margin rules (items = variants in collection)"
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--text-muted)"
                fontSize={10}
                tickLine={false}
                tickFormatter={truncateChartLabel}
              />
              <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={false}
                formatter={(value, name) => {
                  if (name === "Avg margin %") return [`${value}%`, name];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar
                name="Items in collection"
                dataKey="items"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-dashboard">
        <div className="glass-card vendors-panel">
          <div className="vendors-panel-header">
            <div>
              <h3 className="section-title">Vendors With Margin Rules</h3>
              <p className="section-desc">
                Collection vendors where you have set a margin (margin &gt; 0%). Click a row to open the collection.
              </p>
            </div>
          </div>

          <div className="dashboard-vendors-toolbar">
            <div className="search-wrapper dashboard-vendors-search">
              <Search size={16} className="search-icon-svg" />
              <input
                type="text"
                placeholder="Search by vendor or collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field search-input"
                disabled={marginedVendorsLoading && marginedVendors.length === 0}
              />
            </div>
          </div>

          <MarginedVendorTable
            vendors={marginedVendors}
            pagination={marginedVendorsPagination}
            loading={marginedVendorsLoading || summaryLoading}
            onNext={handleVendorsNext}
            onPrev={handleVendorsPrev}
            onRowClick={handleVendorRowClick}
          />
        </div>

        <div className="glass-card activity-panel">
          <div>
            <h3 className="section-title section-title--with-icon">
              <Activity size={16} className="section-title-icon" />
              Margin Activity
            </h3>
            <p className="section-desc">Price updates from margin apply actions.</p>
          </div>
          <div className="activity-list">
            {logsLoading ? (
              <div className="activity-empty">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="activity-empty">No recent activity logs. Apply a margin to see events.</div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="activity-item animated-fade-in">
                  <div className="activity-item-rail">
                    <div className={`activity-item-icon ${getActivityIconClass(act.type)}`}>
                      {act.type === "shopify_sync" ? <RefreshCcw size={12} /> : <CheckCircle2 size={12} />}
                    </div>
                    <div className="activity-item-line" />
                  </div>
                  <div className="activity-item-body">
                    <p className="activity-item-message">{act.message}</p>
                    <div className="activity-item-meta">
                      <span className="activity-item-meta-time">
                        <Clock size={10} />
                        {act.timestamp}
                      </span>
                      <span>•</span>
                      <span>By {act.user}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
