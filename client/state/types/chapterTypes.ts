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
