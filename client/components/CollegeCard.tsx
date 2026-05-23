import Link from "next/link";
import { College } from "../types/college";

const TYPE_COLORS: Record<string, string> = {
  IIT: "bg-red-100 text-red-700",
  NIT: "bg-blue-100 text-blue-700",
  IIIT: "bg-purple-100 text-purple-700",
  IIM: "bg-amber-100 text-amber-700",
  Private: "bg-green-100 text-green-700",
  Deemed: "bg-indigo-100 text-indigo-700",
  State: "bg-teal-100 text-teal-700",
};

const CHANCE_COLORS: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Moderate: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Low: "bg-red-100 text-red-700 border border-red-200",
};

interface Props {
  college: College;
  showChance?: boolean;
}

export default function CollegeCard({ college, showChance }: Props) {
  const typeColor = TYPE_COLORS[college.type] || "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative">
        <img
          src={college.image}
          alt={college.name}
          className="w-full h-44 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1562774053-701939374585?w=800";
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}>
            {college.type}
          </span>
          {showChance && college.admissionChance && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CHANCE_COLORS[college.admissionChance]}`}>
              {college.admissionChance} Chance
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold text-slate-700">
          #{college.rank} NIRF
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1">
          {college.name}
        </h2>
        <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {college.location}, {college.state}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl p-2">
            <div className="text-sm font-black text-blue-600">
              ⭐ {college.rating}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Rating</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2">
            <div className="text-sm font-black text-emerald-600">
              {college.placementRate}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Placed</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-2">
            <div className="text-sm font-black text-purple-600">
              ₹{(college.avgPackage / 100000).toFixed(1)}L
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Avg Pkg</div>
          </div>
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1">
            💰 <span className="font-semibold">₹{(college.fees / 100000).toFixed(1)}L/yr</span>
          </span>
          <span className="flex items-center gap-1">
            🎓 <span className="font-semibold">Est. {college.establishedYear}</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {college.acceptedExams.slice(0, 3).map((exam) => (
            <span key={exam} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {exam}
            </span>
          ))}
        </div>

        <Link
          href={`/colleges/${college.id}`}
          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm text-center hover:bg-blue-700 transition block"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}