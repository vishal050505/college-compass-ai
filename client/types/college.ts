export interface Course {
  id: number;
  courseName: string;
  duration: string;
  fees: number;
  seats: number;
  collegeId: number;
}

export interface Review {
  id: number;
  studentName: string;
  batch: string;
  rating: number;
  comment: string;
  collegeId: number;
}

export interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  avgPackage: number;
  highestPackage: number;
  placementRate: number;
  establishedYear: number;
  description: string;
  image: string;
  type: string;
  rank: number;
  totalStudents: number;
  acceptedExams: string[];
  minRank: number;
  maxRank: number;
  courses?: Course[];
  reviews?: Review[];
  admissionChance?: "High" | "Moderate" | "Low";
  createdAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollegesResponse {
  colleges: College[];
  pagination: PaginationMeta;
}