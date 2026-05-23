"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { College } from "../../../types/college";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-100 text-red-700 border border-red-200",
  NIT: "bg-blue-100 text-blue-700 border border-blue-200",
  IIIT: "bg-purple-100 text-purple-700 border border-purple-200",
  IIM: "bg-amber-100 text-amber-700 border border-amber-200",
  Private: "bg-green-100 text-green-700 border border-green-200",
  Deemed: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  State: "bg-teal-100 text-teal-700 border border-teal-200",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? "text-yellow-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-bold text-slate-700 ml-1">{rating}</span>
    </div>
  );
}

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  useEffect(() => {
    if (!params?.id) return;
    fetch(`${API}/api/colleges/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setCollege(data); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [params?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-64 bg-slate-200 rounded-2xl mb-6" />
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
        </div>
      </main>
    );
  }

  if (!college) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-32 text-center">
          <h2 className="text-3xl font-bold text-slate-700">College not found</h2>
          <Link href="/colleges" className="mt-6 inline-block text-blue-600 font-semibold hover:underline">
            ← Back to Colleges
          </Link>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: `Courses (${college.courses?.length ?? 0})` },
    { id: "placements", label: "Placements" },
    { id: "reviews", label: `Reviews (${college.reviews?.length ?? 0})` },
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1562774053-701939374585?w=1200";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_COLORS[college.type] || "bg-slate-100 text-slate-700"}`}>
                  {college.type}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                  #{college.rank} NIRF
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                {college.name}
              </h1>
              <p className="text-slate-300 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {college.location}, {college.state}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="hidden md:flex items-center gap-2 text-white bg-white/20 border border-white/30 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur hover:bg-white/30 transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Rating", value: `⭐ ${college.rating}`, color: "text-yellow-600" },
            { label: "Avg Package", value: `₹${(college.avgPackage / 100000).toFixed(1)}L`, color: "text-emerald-600" },
            { label: "Highest Pkg", value: `₹${(college.highestPackage / 100000).toFixed(0)}L`, color: "text-blue-600" },
            { label: "Placement", value: `${college.placementRate}%`, color: "text-purple-600" },
            { label: "Annual Fees", value: `₹${(college.fees / 100000).toFixed(1)}L`, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-white text-blue-600 shadow"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">About</h3>
              <p className="text-slate-600 leading-relaxed">{college.description}</p>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Established</span>
                  <span className="font-semibold text-slate-800">{college.establishedYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Students</span>
                  <span className="font-semibold text-slate-800">{college.totalStudents.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-800">{college.location}, {college.state}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Accepted Exams</h3>
              <div className="flex flex-wrap gap-2">
                {college.acceptedExams.map((exam) => (
                  <span key={exam} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                    {exam}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <h4 className="font-bold text-slate-700 mb-3">Rank Range for Admission</h4>
                <div className="bg-slate-50 rounded-xl p-4 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Min Rank</span>
                    <span className="font-bold text-emerald-600">{college.minRank.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Rank</span>
                    <span className="font-bold text-red-500">{college.maxRank.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Link
                href={`/compare?college1=${college.id}`}
                className="flex-1 text-center bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
              >
                ⚖️ Compare This College
              </Link>
              <Link
                href={`/predictor`}
                className="flex-1 text-center bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition"
              >
                🤖 Check Admission Chance
              </Link>
            </div>
          </div>
        )}

        {activeTab === "courses" && (
          <div className="space-y-3">
            {college.courses && college.courses.length > 0 ? (
              college.courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition">
                  <div>
                    <h4 className="font-bold text-slate-900">{course.courseName}</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Duration: {course.duration} · {course.seats} seats</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">₹{(course.fees / 100000).toFixed(1)}L</div>
                    <div className="text-xs text-slate-400">per year</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-10">No course data available.</div>
            )}
          </div>
        )}

        {activeTab === "placements" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-5">Placement Statistics</h3>
              <div className="space-y-4">
                {[
                  { label: "Placement Rate", value: `${college.placementRate}%`, color: "bg-emerald-500" },
                  { label: "Average Package", value: `₹${(college.avgPackage / 100000).toFixed(1)} LPA`, color: "bg-blue-500" },
                  { label: "Highest Package", value: `₹${(college.highestPackage / 100000).toFixed(0)} LPA`, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-600 font-medium">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                        style={{ width: item.label === "Placement Rate" ? `${college.placementRate}%` : "70%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-5">Key Recruiters</h3>
              <div className="flex flex-wrap gap-2">
                {["Google", "Microsoft", "Amazon", "Flipkart", "Infosys", "TCS", "Wipro", "Deloitte", "Goldman Sachs", "JP Morgan"].map((r) => (
                  <span key={r} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {college.reviews && college.reviews.length > 0 ? (
              college.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {review.studentName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{review.studentName}</div>
                        <div className="text-xs text-slate-400">Batch of {review.batch}</div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-10">No reviews yet.</div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}