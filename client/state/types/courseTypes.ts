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

export interface CourseResponse<T> {
  success: boolean;
  message: string;
  data?: Course;
}

export interface editCourseRequest {
  id: string;
  data: Partial<Course>;
}

export interface CourseDeleteResponse {
  success: boolean;
  message: string;
}
