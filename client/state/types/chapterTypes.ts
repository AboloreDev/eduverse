import { SingleLesson } from "./lessonTypes";

export interface ReOrderChapterRequest {
  courseId: string;
  chapters: Array<{
    id: string;
    position: number;
  }>;
}

export interface ReOrderChapterResponse {
  success: boolean;
  message: string;
}

// Chapter type
export interface Chapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: SingleLesson[];
  createdAt: string;
  updatedAt: string;
}
