"use client";

import CourseList from "@/components/organisation/courses/CourseList";
import { Course } from "@/components/organisation/courses/CourseCard";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<Course[]>([]);
  const [other, setOther] = useState<Course[]>([]);
  const [completed, setCompleted] = useState<Course[]>([]);

  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  const isAdmin = user?.organisation?.role === "admin";

  useEffect(() => {
    async function fetchAdminCourses() {
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
    async function fetchUserCourses() {
      const userCourses = await fetch("/api/courses/all-user-courses", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setEnrolled(data.enrolled || []);
          setOther(data.other || []);
          setCompleted(data.completed || []);
        })
        .catch((err) => {
          console.error("Failed to fetch user courses:", err);
          setEnrolled([]);
          setOther([]);
          setCompleted([]);
        });
    }
    if (isAdmin) {
      fetchAdminCourses();
    } else {
      fetchUserCourses();
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <CourseList
        courses={courses}
        isAdmin={true}
        isEnrolled={true}
        isCompleted={true}
      />
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          My Courses
        </h2>
        {enrolled.length > 0 ? (
          <CourseList
            courses={enrolled}
            isAdmin={false}
            isEnrolled={true}
            isCompleted={false}
          />
        ) : (
          <p className="text-gray-600">
            You’re not enrolled in any courses yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          Available Courses
        </h2>
        {other.length > 0 ? (
          <CourseList
            courses={other}
            isAdmin={false}
            isEnrolled={false}
            isCompleted={false}
          />
        ) : (
          <p className="text-gray-600">No other courses available.</p>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          Completed Courses
        </h2>
        {completed.length > 0 ? (
          <CourseList
            courses={completed}
            isAdmin={false}
            isEnrolled={false}
            isCompleted={true}
          />
        ) : (
          <p className="text-gray-600">No completed courses.</p>
        )}
      </section>
    </div>
  );
}
