"use client";

export default function UsersList({
  organisationId,
}: {
  organisationId: string;
}) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <p className="text-gray-600">This is a placeholder for the users list.</p>
      {/* Add your users list component here */}
    </div>
  );
}
