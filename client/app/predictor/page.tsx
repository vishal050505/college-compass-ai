"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { College } from "../../types/college";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const EXAMS = [
  { value: "JEE Advanced", label: "JEE Advanced (IITs)", maxRank: 15000 },
  { value: "JEE Main", label: "JEE Main (NITs, IIITs, State)", maxRank: 800000 },
  { value: "BITSAT", label: "BITSAT (BITS)", maxRank: 3000 },
  { value: "CAT", label: "CAT (IIMs)", maxRank: 200000 },
  { value: "WBJEE", label: "WBJEE (West Bengal)", maxRank: 50000 },
  { value: "KCET", label: "KCET (Karnataka)", maxRank: 200000 },
  { value: "TNEA", label: "TNEA (Tamil Nadu)", maxRank: 200000 },
  { value: "MHT CET", label: "MHT CET (Maharashtra)", maxRank: 150000 },
  { value: "VITEEE", label: "VITEEE (VIT)", maxRank: 300000 },
];

const CHANCE_CONFIG = {
  High: { color: "bg-emerald-100 text-emerald-700 border border-emerald-200", icon: "🟢" },
  Moderate: { color: "bg-yellow-100 text-yellow-700 border border-yellow-200", icon: "🟡" },
  Low: { color: "bg-red-100 text-red-600 border border-red-200", icon: "🔴" },
};

interface PredictionResult {
  success: boolean;
  totalFound: number;
  predictedColleges: (College & { admissionChance: "High" | "Moderate" | "Low" })[];
  criteria: any;
}

export default function PredictorPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [preferredState, setPreferredState] = useState("");
  const [preferredType, setPreferredType] = useState("");
  const [minPlacementRate, setMinPlacementRate] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedExam = EXAMS.find((e) => e.value === exam);

  const handlePredict = async () => {
    if (!exam) return toast.error("Please select your entrance exam");
    if (!rank) return toast.error("Please enter your rank");
    const rankNum = Number(rank);
    if (rankNum < 1) return toast.error("Rank must be at least 1");
    if (selectedExam && rankNum > selectedExam.maxRank) {
      return toast.error(`${exam} rank is typically up to ${selectedExam.maxRank.toLocaleString()}`);
    }

    setLoading(true);
    const toastId = toast.loading("Predicting colleges...");

    try {
      const res = await fetch(`${API}/api/predictor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: rankNum,
          ...(maxFees && { maxFees: Number(maxFees) }),
          ...(preferredState && { preferredState }),
          ...(preferredType && { preferredType }),
          ...(minPlacementRate && { minPlacementRate: Number(minPlacementRate) }),
        }),
      });
      const data = await res.json();
      setResult(data);
      toast.success(
        data.totalFound > 0
          ? `Found ${data.totalFound} matching college${data.totalFound > 1 ? "s" : ""}!`
          : "No colleges matched. Try relaxing your filters.",
        { id: toastId }
      );
    } catch (err) {
      toast.error("Prediction failed. Check your server.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900">🤖 College Predictor</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Enter your exam and rank to get a personalised list of reachable colleges.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="font-bold text-slate-800 text-lg mb-5">Your Criteria</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Exam */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
                Entrance Exam <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EXAMS.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setExam(e.value)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition text-left ${
                      exam === e.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {e.value}
                    <div className={`text-xs mt-0.5 font-normal ${exam === e.value ? "text-blue-200" : "text-slate-400"}`}>
                      Up to rank {e.maxRank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rank */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">
                Your Rank <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder={selectedExam ? `1 – ${selectedExam.maxRank.toLocaleString()}` : "Enter rank"}
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-slate-900 [&>option]:bg-white"
              />
            </div>

            {/* Max Fees */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Max Annual Fees per Year (₹)</label>
              <select
                value={maxFees}
                onChange={(e) => setMaxFees(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">-- Select budget range --</option>
                <option value="50000">₹50,000 per year (Budget)</option>
                <option value="150000">₹1.5 Lakh per year (Moderate)</option>
                <option value="250000">₹2.5 Lakh per year (Mid-range)</option>
                <option value="400000">₹4 Lakh per year (Higher)</option>
                <option value="600000">₹6 Lakh per year (Premium)</option>
              </select>
            </div>

            {/* Preferred State */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Preferred State (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Tamil Nadu, Maharashtra, Delhi (leave empty for any)"
                value={preferredState}
                onChange={(e) => setPreferredState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Preferred Type */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">College Type</label>
              <select
                value={preferredType}
                onChange={(e) => setPreferredType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">-- All types --</option>
                <option value="IIT">IIT (Indian Institute of Technology)</option>
                <option value="NIT">NIT (National Institute of Technology)</option>
                <option value="IIIT">IIIT (Indian Institute of Information Technology)</option>
                <option value="IIM">IIM (Indian Institute of Management)</option>
                <option value="Private">Private Universities</option>
                <option value="Deemed">Deemed Universities</option>
                <option value="State">State Public Universities</option>
              </select>
            </div>

            {/* Min Placement */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Minimum Placement Rate (%)</label>
              <select
                value={minPlacementRate}
                onChange={(e) => setMinPlacementRate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">-- No minimum --</option>
                <option value="90">90% and above (Excellent)</option>
                <option value="85">85% and above (Very Good)</option>
                <option value="80">80% and above (Good)</option>
                <option value="75">75% and above (Fair)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Predicting...
              </>
            ) : (
              "🚀 Predict My Colleges"
            )}
          </button>
        </div>

        {/* Legend */}
        {result && (
          <div className="flex gap-3 mt-6 flex-wrap">
            {Object.entries(CHANCE_CONFIG).map(([k, v]) => (
              <span key={k} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${v.color}`}>
                {v.icon} {k} Chance
              </span>
            ))}
            <span className="text-xs text-slate-500 self-center ml-1">
              Based on your rank vs college's historical admission range
            </span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-4">
            {result.totalFound === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                <div className="text-4xl mb-3">😕</div>
                <h3 className="font-bold text-slate-700 text-lg">No colleges found</h3>
                <p className="text-slate-400 mt-2 text-sm">Try relaxing your filters — higher fees limit, different state, or any type.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {result.predictedColleges.map((college, i) => {
                  const cfg = CHANCE_CONFIG[college.admissionChance];
                  return (
                    <div
                      key={college.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {college.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{college.location}</span>
                            <span>·</span>
                            <span className="font-semibold">{college.type}</span>
                            <span>·</span>
                            <span>#{college.rank} NIRF</span>
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-slate-600">
                            <span>⭐ {college.rating}</span>
                            <span>💰 ₹{(college.fees / 100000).toFixed(1)}L/yr</span>
                            <span>📦 ₹{(college.avgPackage / 100000).toFixed(1)} LPA avg</span>
                            <span>✅ {college.placementRate}% placed</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${cfg.color}`}>
                          {cfg.icon} {college.admissionChance}
                        </span>
                        <Link
                          href={`/colleges/${college.id}`}
                          className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}