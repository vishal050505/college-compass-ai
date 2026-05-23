"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CollegeCard from "../../components/CollegeCard";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { College, PaginationMeta } from "../../types/college";
import { useDebounce } from "../../hooks/useDebounce";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Filters {
  types: string[];
  states: string[];
  exams: string[];
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ types: [], states: [], exams: [] });

  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Fetch filter options once
  useEffect(() => {
    fetch(`${API}/api/colleges/filters`)
      .then((r) => r.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  const fetchColleges = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "12",
      sortBy,
      sortOrder,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(selectedState && { state: selectedState }),
      ...(selectedType && { type: selectedType }),
      ...(selectedExam && { exam: selectedExam }),
      ...(maxFees && { maxFees }),
      ...(minRating && { minRating }),
    });

    fetch(`${API}/api/colleges?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setColleges(data.colleges || []);
        setPagination(data.pagination || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page, debouncedSearch, selectedState, selectedType, selectedExam, maxFees, minRating, sortBy, sortOrder]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedState, selectedType, selectedExam, maxFees, minRating, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearch("");
    setSelectedState("");
    setSelectedType("");
    setSelectedExam("");
    setMaxFees("");
    setMinRating("");
    setSortBy("rank");
    setSortOrder("asc");
    setPage(1);
  };

  const activeFilterCount = [selectedState, selectedType, selectedExam, maxFees, minRating].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900">Explore Colleges</h1>
          {pagination && (
            <p className="text-slate-500 mt-1">
              Showing {colleges.length} of {pagination.total} colleges
            </p>
          )}
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <select
            value={sortBy + "_" + sortOrder}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("_");
              setSortBy(sb);
              setSortOrder(so);
            }}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rank_asc">Sort: NIRF Rank</option>
            <option value="rating_desc">Sort: Highest Rated</option>
            <option value="avgPackage_desc">Sort: Best Package</option>
            <option value="fees_asc">Sort: Lowest Fees</option>
            <option value="fees_desc">Sort: Highest Fees</option>
            <option value="placementRate_desc">Sort: Best Placement</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition ${
              showFilters || activeFilterCount > 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">College Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Types</option>
                {filters.types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All States</option>
                {filters.states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Entrance Exam</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Exams</option>
                {filters.exams.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Max Fees (₹/yr)</label>
              <input
                type="number"
                placeholder="e.g. 300000"
                value={maxFees}
                onChange={(e) => setMaxFees(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.5">3.5+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <LoadingSkeleton key={i} />)
            : colleges.length === 0
            ? <EmptyState />
            : colleges.map((college) => <CollegeCard key={college.id} college={college} />)}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              ← Prev
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce((acc: (number | "...")[], curr, idx, arr) => {
                if (idx > 0 && curr - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(curr);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2 text-slate-400">…</span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(p as number)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}