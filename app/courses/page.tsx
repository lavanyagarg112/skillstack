"use client";

import CourseList from "@/components/organisation/courses/CourseList";
import { Course } from "@/components/organisation/courses/CourseCard";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  useEffect(() => {
    async function fetchCourses() {
      const fetchedCourses = await fetch("/api/courses", {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => data["courses"] || [])
        .catch((error) => {
          console.error("Failed to fetch courses:", error);
          return [];
        });
      setCourses(fetchedCourses);
    }
    fetchCourses();
  }, []);

  return <CourseList courses={courses} isAdmin={isAdmin} />;
}
