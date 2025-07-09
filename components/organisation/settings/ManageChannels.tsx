"use client";

import { useState, useEffect } from "react";

interface Channel {
  id: number;
  name: string;
  description: string;
}

export default function ManageChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchChannels = () =>
    fetch("/api/courses/channels", { credentials: "include" })
      .then((r) => r.json())
      .then(setChannels)
      .catch(console.error);

  useEffect(() => {
    fetchChannels();
  }, []);

  const addChannel = async () => {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/courses/add-channel", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name, 
        description: newDescription.trim() 
      }),
    });
    if (res.ok) {
      setNewName("");
      setNewDescription("");
      fetchChannels();
    } else {
      alert("Failed to add channel");
    }
  };

  const deleteChannel = async (id: number) => {
    if (
      !confirm(
        "Delete this channel? All courses using this channel will be affected"
      )
    )
      return;
    const res = await fetch("/api/courses/delete-channel", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId: id }),
    });
    if (res.ok) fetchChannels();
    else alert("Delete failed");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Channels</h1>
      <p className="text-gray-600">Channels represent topics or subject areas for courses</p>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Channel name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
          />
          <textarea
            placeholder="Channel description (optional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            rows={3}
          />
        </div>
        <button
          onClick={addChannel}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Add Channel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow flex justify-between items-start"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base truncate">{channel.name}</h3>
              {channel.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{channel.description}</p>
              )}
            </div>
            <button
              onClick={() => deleteChannel(channel.id)}
              className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded flex-shrink-0"
              title="Delete channel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 012 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v3a1 1 0 11-2 0V9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}