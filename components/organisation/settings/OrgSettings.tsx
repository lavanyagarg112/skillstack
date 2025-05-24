"use client";
import { useState } from "react";

export default function OrgSettings({ initialData }: { initialData: any }) {
  const [name, setName] = useState(initialData.organisation_name);
  const [description, setDescription] = useState(initialData.description);
  const [aiEnabled, setAiEnabled] = useState(initialData.ai_enabled);
  const [transferEmail, setTransferEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Call API to update organisation settings
      // show success toast
    } catch (err) {
      // show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferEmail) return;
    // open confirmation modal...
    // then call API to transfer ownership
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-purple-700">
          Organisation Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organisation Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organisation Name
            </label>
            <input
              type="text"
              value={name}
              maxLength={100}
              required
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-700 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-purple-600 focus:ring focus:ring-purple-200"
            />
          </div>

          {/* AI Toggle */}
          <div className="flex items-center">
            <input
              id="aiEnabled"
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
            />
            <label htmlFor="aiEnabled" className="ml-2 text-sm text-gray-700">
              Enable AI-powered recommendations
            </label>
          </div>

          {/* Transfer Ownership */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transfer Ownership
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="email"
                placeholder="New admin’s email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 p-2 focus:border-red-500 focus:ring focus:ring-red-200"
              />
              <button
                type="button"
                onClick={handleTransfer}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Transfer
              </button>
            </div>
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => {
                setName(name);
                setDescription(description);
                setAiEnabled(aiEnabled);
                setTransferEmail(transferEmail);
              }}
              disabled={isSaving}
              className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
