"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stats = [
  { value: "50+", label: "Top Colleges", icon: "🏛️" },
  { value: "15+", label: "States Covered", icon: "🗺️" },
  { value: "95%", label: "Placement Accuracy", icon: "🎯" },
  { value: "AI", label: "Powered Predictor", icon: "🤖" },
];

const features = [
  {
    icon: "🔍",
    title: "Smart Search & Filters",
    desc: "Filter by type (IIT/NIT/IIIT/Private), state, fees, rating, exam, and placement. Paginated results with instant search.",
  },
  {
    icon: "⚖️",
    title: "Side-by-Side Compare",
    desc: "Compare any 2 colleges across fees, packages, placement %, ratings, courses and more in a structured table.",
  },
  {
    icon: "🧠",
    title: "Multi-Criteria Predictor",
    desc: "Input your exam, rank, budget, and preferred state to get a personalized list of reachable colleges with admission chance.",
  },
  {
    icon: "📋",
    title: "Detailed College Pages",
    desc: "Full college profiles with courses, placements, student reviews, accepted exams and key stats.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-28 px-6">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-10 animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            🎓 India's Smartest College Discovery Platform
          </span>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Dream College
            </span>
            <br />with AI
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Search, compare, and predict admissions across 50+ top Indian colleges
            — IITs, NITs, IIITs, IIMs & more. Data-driven. Student-first.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              Browse Colleges →
            </Link>
            <Link
              href="/predictor"
              className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 backdrop-blur"
            >
              🤖 Try AI Predictor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black text-blue-600">{s.value}</div>
              <div className="text-sm font-semibold text-slate-600 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black text-slate-900 text-center">
              Everything You Need to Decide
            </h2>
            <p className="text-slate-500 text-center mt-3 text-lg">
              Built end-to-end — frontend + backend + database
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          >
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-7 border border-slate-200 hover:shadow-lg transition group">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {f.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-black text-slate-900">
            Ready to find your college?
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Use our predictor to get personalised college recommendations based on your exam rank.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/predictor"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition hover:scale-105"
            >
              Start Prediction →
            </Link>
            <Link
              href="/compare"
              className="border border-slate-300 px-8 py-4 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition hover:scale-105"
            >
              Compare Colleges
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}