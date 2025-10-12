import { Chapter } from "./chapterTypes";
import { SingleLesson } from "./lessonTypes";
import { CourseLevel, CourseStatus } from "./uploadTypes";

export interface Course {
  id: string;
  title: string;
  subDescription: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  status: string;
  price: number;
  fileKey?: string;
  slug?: string;
}

export interface SingleCourse {
  courseId: string;
  title: string;
  description: string;
  subDescription: string; // JSON string from Tiptap
  category: string;
  price: number;
  duration: number;
  fileKey: string;
  slug: string;
  status: CourseStatus;
  level: CourseLevel;
  chapters: Chapter[];
  instructorId?: string;
  instructorName?: string;
  enrollmentCount?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}
export interface CourseResponse<T> {
  success: boolean;
  message: string;
  data?: Course;
  pagination?: Pagination;
}
export interface SingleCourseResponse<T> {
  success: boolean;
  message: string;
  data?: SingleCourse;
}

export interface editCourseRequest {
  id: string;
  data: Partial<Course>;
}

export interface CourseDeleteResponse {
  success: boolean;
  message: string;
}
