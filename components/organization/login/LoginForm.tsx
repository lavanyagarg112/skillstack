import Link from "next/link";

export default function OrganizationLoginForm() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Organization Login
      </h1>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Admin Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
        >
          Sign In
        </button>

        <div className="text-center mt-2">
          <Link
            href="/organization/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </>
  );
}
