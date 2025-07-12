"use client";

import { useState, useEffect } from "react";

interface FrequentBadge {
  id: number;
  name: string;
  description: string;
  numCoursesCompleted: number;
}

interface CourseBadge {
  id: number;
  name: string;
  description: string;
  courseId: number;
}

interface CreatedBadges {
  coursesBadges: FrequentBadge[];
  courseBadges: CourseBadge[];
}

interface Course {
  id: number;
  name: string;
}

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<CreatedBadges>({
    coursesBadges: [],
    courseBadges: [],
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [freqName, setFreqName] = useState("");
  const [freqDesc, setFreqDesc] = useState("");
  const [freqCount, setFreqCount] = useState<number | "">("");

  const [specName, setSpecName] = useState("");
  const [specDesc, setSpecDesc] = useState("");
  const [specCourseId, setSpecCourseId] = useState<number | "">("");

  useEffect(() => {
    fetchBadges();
    fetchCourses();
  }, []);

  const fetchBadges = () => {
    setLoading(true);
    fetch("/api/badges/created-badges", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load badges");
        return r.json() as Promise<CreatedBadges>;
      })
      .then((data) => {
        setBadges(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load courses");
      const data = (await res.json()) as { courses: Course[] };
      setCourses(data.courses);
    } catch (err) {
      console.error(err);
    }
  };

  const addFrequentBadge = async () => {
    if (!freqName.trim() || freqCount === "" || freqCount < 0) {
      alert("Name and non-negative course count are required");
      return;
    }
    const res = await fetch("/api/badges/create-frequent", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: freqName.trim(),
        description: freqDesc.trim(),
        numCoursesCompleted: +freqCount,
      }),
    });
    if (res.ok) {
      setFreqName("");
      setFreqDesc("");
      setFreqCount("");
      fetchBadges();
    } else {
      alert("Could not create badge");
    }
  };

  const addCourseBadge = async () => {
    if (!specName.trim() || specCourseId === "") {
      alert("Name and course selection are required");
      return;
    }
    const res = await fetch("/api/badges/create-specific-course", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: specName.trim(),
        description: specDesc.trim(),
        courseId: specCourseId,
      }),
    });
    if (res.ok) {
      setSpecName("");
      setSpecDesc("");
      setSpecCourseId("");
      fetchBadges();
    } else {
      alert("Could not create badge");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-purple-600">Manage Badges</h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Add “Complete X Courses” Badge
          </h2>
          <input
            type="text"
            placeholder="Badge Name"
            value={freqName}
            onChange={(e) => setFreqName(e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring"
          />
          <textarea
            placeholder="Description (optional)"
            value={freqDesc}
            onChange={(e) => setFreqDesc(e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring"
            rows={2}
          />
          <input
            type="number"
            min={0}
            placeholder="Number of courses"
            value={freqCount}
            onChange={(e) =>
              setFreqCount(e.target.value === "" ? "" : +e.target.value)
            }
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring"
          />
          <button
            onClick={addFrequentBadge}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Create Badge
          </button>
        </div>

        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-2">
            Add “Course-Specific” Badge
          </h2>
          <input
            type="text"
            placeholder="Badge Name"
            value={specName}
            onChange={(e) => setSpecName(e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring"
          />
          <textarea
            placeholder="Description (optional)"
            value={specDesc}
            onChange={(e) => setSpecDesc(e.target.value)}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring"
            rows={2}
          />
          <select
            value={specCourseId}
            onChange={(e) => setSpecCourseId(Number(e.target.value) || "")}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring"
          >
            <option value="">Select a course…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={addCourseBadge}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Create Badge
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Existing Badges</h2>

        <h3 className="text-lg font-medium mb-2">Complete X Courses</h3>
        {loading ? (
          <p>Loading…</p>
        ) : badges.coursesBadges.length === 0 ? (
          <p className="text-gray-500">No frequent badges created.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.coursesBadges.map((b) => (
              <div
                key={b.id}
                className="p-3 border rounded-lg bg-purple-50 flex flex-col"
              >
                <span className="font-semibold">{b.name}</span>
                <small className="italic text-sm">
                  when you complete {b.numCoursesCompleted} courses
                </small>
                {b.description && (
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <h3 className="text-lg font-medium mt-6 mb-2">Course-Specific</h3>
        {loading ? (
          <p>Loading…</p>
        ) : badges.courseBadges.length === 0 ? (
          <p className="text-gray-500">No course-specific badges created.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.courseBadges.map((b) => (
              <div
                key={b.id}
                className="p-3 border rounded-lg bg-purple-50 flex flex-col"
              >
                <span className="font-semibold">{b.name}</span>
                <small className="italic text-sm">
                  for course #{b.courseId}
                </small>
                {b.description && (
                  <p className="text-gray-700 mt-1 line-clamp-2">
                    {b.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
