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

export interface SingleLesson {
  id: string;
  title: string;
  description: string;
  thumbnailKey: string;
  videoKey: string;
  chapterId?: string;
  progress: {
    isCompleted: boolean;
    lessonId: string;
  };
}

export interface SingleLessonResponse<T> {
  success: boolean;
  message: string;
  data?: SingleLesson;
}

export interface LessonUpdateData {
  name: string;
  description: string;
  thumbnailKey: string;
  videoKey: string;
}

export interface UpdateLessonParams {
  courseId: string;
  chapterId: string;
  lessonId: string;
  data: LessonUpdateData;
}
