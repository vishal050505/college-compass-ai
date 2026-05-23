🎓 College Compass AI

An AI-powered college discovery and decision platform for Indian students.
Built as a production-grade full-stack application for the Full Stack Developer Internship Demo Task — Track B.

🚀 Live Demo
ServiceURL🌐 Frontendcollege-compass.vercel.app⚙️ Backend APIcollege-compass-api.onrender.com

✨ Features Built (Track B)
1. 🔍 College Listing + Search

40+ real Indian colleges seeded in PostgreSQL
Search by college name (debounced, instant)
Filter by: Type (IIT/NIT/IIIT/IIM/Private), State, Exam, Fees, Rating
Sort by: NIRF Rank, Rating, Package, Fees, Placement
Pagination with page controls
Loading skeletons and empty states

2. 🏫 College Detail Page

Full college profile with dynamic routing (/colleges/[id])
4 tabs: Overview, Courses, Placements, Reviews
Placement statistics with progress bars
Student reviews with star ratings
Accepted exams, rank ranges, total students
Direct links to Compare and Predictor

3. ⚖️ Compare Colleges (High Priority)

Select any 2 colleges from dropdown
Full comparison table across 11 metrics
Winner highlighting per row (green = better)
Overall Verdict row with wins count
Metrics: Fees, Placement %, Avg Package, Highest Package, Rating, NIRF Rank, Established Year, Total Students

4. 🤖 AI-Style College Predictor

Multi-criteria input: Exam, Rank, Budget, State, Type, Min Placement
Supports 9 exams: JEE Advanced, JEE Main, BITSAT, CAT, WBJEE, KCET, TNEA, MHT CET, VITEEE
Admission Chance tagging: 🟢 High / 🟡 Moderate / 🔴 Low
Rule-based + dataset-driven logic using real rank ranges from DB
Results link directly to college detail pages


🏗️ Tech Stack
LayerTechnologyFrontendNext.js 16, React, TypeScriptStylingTailwind CSS, Framer MotionBackendNode.js, Express.js, TypeScriptDatabasePostgreSQL (Neon)ORMPrismaNotificationsreact-hot-toastDeploymentVercel (frontend) + Render (backend)



⚙️ Backend API Endpoints
MethodEndpointDescriptionGET/api/collegesList colleges with filters + paginationGET/api/colleges/filtersGet all filter options (types, states, exams)GET/api/colleges/:idGet single college with courses + reviewsPOST/api/predictorPredict colleges based on exam + rank + criteria
Query Parameters for /api/colleges
?search=        Search by name
?state=         Filter by state
?type=          Filter by type (IIT, NIT, IIIT...)
?exam=          Filter by accepted exam
?maxFees=       Maximum annual fees
?minRating=     Minimum rating
?sortBy=        rank | rating | avgPackage | fees | placementRate
?sortOrder=     asc | desc
?page=          Page number
?limit=         Results per page (max 50)

🗄️ Database Schema
prismamodel College {
  id              Int
  name            String
  location        String
  state           String
  fees            Int
  rating          Float
  avgPackage      Float
  highestPackage  Float
  placementRate   Float
  establishedYear Int
  type            String    // IIT, NIT, IIIT, IIM, Private...
  rank            Int       // NIRF rank
  totalStudents   Int
  acceptedExams   String[]  // JEE Advanced, JEE Main, CAT...
  minRank         Int       // admission rank range
  maxRank         Int
  courses         Course[]
  reviews         Review[]
}

🏃 Running Locally
Prerequisites

Node.js 18+
PostgreSQL database (or Neon account)

1. Clone the repository
bashgit clone https://github.com/YOURNAME/college-compass-ai.git
cd college-compass-ai
2. Setup Backend
bashcd server
npm install
Create server/.env:
envDATABASE_URL="your_postgresql_connection_string"
bashnpx prisma db push
npx prisma generate
npx ts-node --transpile-only prisma/seed.ts
npm run dev
Backend runs on http://localhost:5000
3. Setup Frontend
bashcd client
npm install
Create client/.env.local:
envNEXT_PUBLIC_API_URL=http://localhost:5000
bashnpm run dev
Frontend runs on http://localhost:3000

🧪 Test the Predictor
ExamRankExpected OutputJEE Advanced500IIT Bombay, IIT Delhi, IIT MadrasJEE Advanced5000IIT Hyderabad, IIT GuwahatiJEE Main10000NIT Trichy, NIT SurathkalJEE Main100000VIT Vellore, Thapar, DTUCAT100IIM Ahmedabad, IIM BangaloreBITSAT2000BITS Pilani, BITS Goa

👨‍💻 Built By
Vishal Kumar Singh
Track B: College Discovery Platform

Built with Next.js · Express · PostgreSQL · Prisma · TypeScript · Tailwind CSS
