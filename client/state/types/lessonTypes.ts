export interface ReOrderLessonsRequest {
  chapterId: string;
  courseId: string;
  lessons: Array<{
    id: string;
    position: number;
  }>;
}

export interface ReOrderLessonsResponse {
  success: boolean;
  message: string;
}
