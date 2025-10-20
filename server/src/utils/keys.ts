export function getKeyName(...args: string[]) {
  return `eduverse:${args.join(":")}`;
}

// Authentication
export const authenticationKeyById = (userId: string) =>
  getKeyName("authentication", userId);

//  Courses
export const coursesKeyById = (id: string) => getKeyName("coursesById", id);

export const coursesListKey = (page: number, limit: number, role: string) =>
  getKeyName("allCourses", "list", role, `page:${page}`, `limit:${limit}`);

export const recentCourseListKey = () => getKeyName("recentCourses");

// Lessons
export const singleLessonKeyById = (chapterId: string, lessonId: string) =>
  getKeyName("singleLesson", `ChapterId:${chapterId}`, `LessonId:${lessonId}`);
// Chapters
export const singleChapterKey = (courseId: string, chapterId: string) =>
  getKeyName("singleLesson", `ChapterId:${chapterId}`, `courseId:${courseId}`);
// Payments

export const paymentStatsKey = () => getKeyName("stats", "payments", "30days");
export const dashboardStatsKey = () =>
  getKeyName("stats", "dashboard", "analytics");
