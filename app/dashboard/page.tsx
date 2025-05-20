export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
      <div className="flex justify-center">
        <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-gray-700">Welcome to your dashboard!</p>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="bg-gray-200 p-4 rounded-lg shadow-md w-full max-w-md">
          <p className="text-gray-700">Here you can manage your account.</p>
        </div>
      </div>
    </div>
  );
}
