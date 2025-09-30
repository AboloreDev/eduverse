export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";
export type CourseStatus = "Draft" | "Published" | "Archived";

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    key: string;
    url: string;
    size: number;
    type: string;
    uploadedBy: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface UploadCourseResponse {
  title: string;
  subDescription: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  fileKey: string;
  slug: string;
  status: CourseStatus;
  level: CourseLevel;
}
