// app/courses/page.tsx
import CourseList from "@/components/organisation/courses/CourseList";
import { Course } from "@/components/organisation/courses/CourseCard";
import { getAuthUser } from "@/lib/auth";

export default async function CoursesPage() {
  const user = await getAuthUser();

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  // 2) Dummy data
  const courses: Course[] = [
    { id: 1, name: "Intro to TypeScript", description: "Learn TS basics" },
    { id: 2, name: "Advanced React", description: "Hooks, Suspense, SSR" },
  ];

  // 3) Render the client component that will show/hide admin buttons
  return <CourseList courses={courses} isAdmin={isAdmin} />;
}
