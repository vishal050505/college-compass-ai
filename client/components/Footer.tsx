import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">CC</span>
            </div>
            <span className="text-white font-black text-lg">CollegeCompass</span>
          </div>
          <p className="text-sm leading-relaxed">
            AI-powered platform for college discovery, comparison, and admission prediction.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Explore</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/colleges" className="hover:text-white transition">Browse Colleges</Link>
            <Link href="/compare" className="hover:text-white transition">Compare Colleges</Link>
            <Link href="/predictor" className="hover:text-white transition">Admission Predictor</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Built With</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Framer Motion"].map((tech) => (
              <span key={tech} className="bg-slate-800 px-2.5 py-1 rounded-full">{tech}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} CollegeCompass AI · Built for Full Stack Developer Internship Demo
      </div>
    </footer>
  );
}