import { getAuthUser } from "@/lib/auth";
import ChatHistoryPage from "@/components/chatbot/ChatHistory";

export default async function DashboardPage() {
  const user = await getAuthUser();
  if (!user || !user.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-purple-600">Chat History</h1>
      <ChatHistoryPage />
    </div>
  );
}
