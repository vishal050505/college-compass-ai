"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { College } from "../../types/college";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getBetter(v1: number, v2: number, higherIsBetter: boolean) {
  if (v1 === v2) return "tie";
  return higherIsBetter ? (v1 > v2 ? "left" : "right") : (v1 < v2 ? "left" : "right");
}

function Cell({ value, winner }: { value: string; winner: boolean }) {
  return (
    <td className={`p-4 text-center font-semibold text-sm ${winner ? "text-emerald-600 bg-emerald-50" : "text-slate-700"}`}>
      {winner && <span className="mr-1">✓</span>}
      {value}
    </td>
  );
}

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [col1Id, setCol1Id] = useState<string>(searchParams.get("college1") || "");
  const [col2Id, setCol2Id] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/colleges?limit=50&sortBy=rank`)
      .then((r) => r.json())
      .then((data) => { setColleges(data.colleges || []); setLoading(false); })
      .catch(console.error);
  }, []);

  const college1 = colleges.find((c) => String(c.id) === col1Id);
  const college2 = colleges.find((c) => String(c.id) === col2Id);

  const rows: { label: string; key: keyof College; higherIsBetter: boolean; format: (v: any) => string }[] = [
    { label: "Location", key: "location", higherIsBetter: true, format: (v) => v },
    { label: "State", key: "state", higherIsBetter: true, format: (v) => v },
    { label: "Type", key: "type", higherIsBetter: true, format: (v) => v },
    { label: "NIRF Rank", key: "rank", higherIsBetter: false, format: (v) => `#${v}` },
    { label: "Rating", key: "rating", higherIsBetter: true, format: (v) => `⭐ ${v}` },
    { label: "Annual Fees", key: "fees", higherIsBetter: false, format: (v) => `₹${(v / 100000).toFixed(1)}L` },
    { label: "Avg Package", key: "avgPackage", higherIsBetter: true, format: (v) => `₹${(v / 100000).toFixed(1)} LPA` },
    { label: "Highest Package", key: "highestPackage", higherIsBetter: true, format: (v) => `₹${(v / 100000).toFixed(0)} LPA` },
    { label: "Placement Rate", key: "placementRate", higherIsBetter: true, format: (v) => `${v}%` },
    { label: "Established", key: "establishedYear", higherIsBetter: false, format: (v) => String(v) },
    { label: "Total Students", key: "totalStudents", higherIsBetter: true, format: (v) => v.toLocaleString() },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Compare Colleges</h1>
        <p className="text-slate-500 mb-8">Select two colleges to see a side-by-side comparison across key metrics.</p>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { value: col1Id, setter: setCol1Id, label: "First College" },
            { value: col2Id, setter: setCol2Id, label: "Second College" },
          ].map(({ value, setter, label }) => (
            <div key={label}>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">{label}</label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500 [&>option]:text-slate-900 [&>option]:bg-white"
              >
                <option value="">-- Select a college --</option>
                {colleges.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Prompt */}
        {!college1 || !college2 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-xl font-bold text-slate-600">Select two colleges above to compare</h3>
            <p className="text-slate-400 mt-2 text-sm">All key metrics will appear side by side</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            {/* College Headers */}
            <div className="grid grid-cols-3 bg-slate-900 text-white">
              <div className="p-5 font-bold text-slate-300 text-sm uppercase tracking-wider">Metric</div>
              {[college1, college2].map((c) => (
                <div key={c.id} className="p-5 text-center">
                  <div className="font-black text-lg leading-tight">{c.name}</div>
                  <div className="text-slate-400 text-sm mt-1">
                    {c.location} · {c.type}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Rows */}
            <table className="w-full">
              <tbody>
                {rows.map((row, i) => {
                  const v1 = college1[row.key] as number;
                  const v2 = college2[row.key] as number;
                  const isNumeric = typeof v1 === "number";
                  const winner = isNumeric ? getBetter(v1, v2, row.higherIsBetter) : "tie";

                  return (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="p-4 font-bold text-slate-600 text-sm border-r border-slate-100">
                        {row.label}
                      </td>
                      <Cell
                        value={row.format(college1[row.key])}
                        winner={winner === "left"}
                      />
                      <Cell
                        value={row.format(college2[row.key])}
                        winner={winner === "right"}
                      />
                    </tr>
                  );
                })}

                {/* Accepted Exams */}
                <tr className="bg-white">
                  <td className="p-4 font-bold text-slate-600 text-sm border-r border-slate-100">Accepted Exams</td>
                  {[college1, college2].map((c) => (
                    <td key={c.id} className="p-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {c.acceptedExams.map((ex) => (
                          <span key={ex} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Courses count */}
                <tr className="bg-slate-50">
                  <td className="p-4 font-bold text-slate-600 text-sm border-r border-slate-100">Courses Offered</td>
                  {[college1, college2].map((c) => (
                    <td key={c.id} className="p-4 text-center text-sm font-semibold text-slate-700">
                      {c.courses?.length ?? "—"} programs
                    </td>
                  ))}
                </tr>

                {/* Verdict row */}
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <td className="p-5 font-black text-slate-900">Overall Verdict</td>
                  {(() => {
                    let s1 = 0, s2 = 0;
                    rows.filter((r) => typeof college1[r.key] === "number").forEach((r) => {
                      const w = getBetter(college1[r.key] as number, college2[r.key] as number, r.higherIsBetter);
                      if (w === "left") s1++;
                      if (w === "right") s2++;
                    });
                    return [college1, college2].map((c, i) => {
                      const score = i === 0 ? s1 : s2;
                      const isWinner = (i === 0 && s1 > s2) || (i === 1 && s2 > s1);
                      return (
                        <td key={c.id} className="p-5 text-center">
                          <div className={`inline-flex flex-col items-center px-4 py-2 rounded-xl ${isWinner ? "bg-emerald-100 border border-emerald-200" : "bg-slate-100"}`}>
                            <span className={`text-lg font-black ${isWinner ? "text-emerald-700" : "text-slate-600"}`}>
                              {isWinner ? "🏆 Winner" : s1 === s2 ? "🤝 Tie" : "Runner-up"}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">Wins {score}/{rows.filter((r) => typeof college1[r.key] === "number").length} metrics</span>
                          </div>
                        </td>
                      );
                    });
                  })()}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}