"use client";

import React from "react";

type Props = {
  q: any;
  can: any;
  toggleTalked: any;
  updateStatus: any;
  removeFromQueue: any;
  neonMode: boolean;
};

export default function QueueRow({
  q,
  can,
  toggleTalked,
  updateStatus,
  removeFromQueue,
  neonMode,
}: Props) {
  return (
    <tr
      className={`transition ${
        q.status === "done"
          ? neonMode
            ? "border-l-4 border-green-400"
            : "border-l-4 border-green-500"
          : "border-l-4 border-transparent"
      }`}
    >
      <td className="px-4 py-3 font-semibold">{q.ticket_number}</td>
      <td className="px-4 py-3">{q.name}</td>

      {/* Stage */}
      <td className="px-4 py-3">
        <span
          className={`text-sm font-medium ${
            q.stage === "cusub"
              ? neonMode
                ? "text-cyan-300"
                : "text-blue-600"
              : neonMode
              ? "text-purple-300"
              : "text-purple-600"
          }`}
        >
          {q.stage}
        </span>
      </td>

      {/* Talked */}
      <td className="px-4 py-3">
        <span
          className={`text-sm font-medium ${
            q.talked === "lala hadlay"
              ? neonMode
                ? "text-green-300"
                : "text-green-600"
              : neonMode
              ? "text-red-300"
              : "text-red-600"
          }`}
        >
          {q.talked}
        </span>
      </td>

      <td className="px-4 py-3">{q.service}</td>

      <td className="px-4 py-3">
        {q.status === "done" ? (
          <span className="text-green-500 font-semibold">Done</span>
        ) : (
          <span className="text-yellow-500">Waiting</span>
        )}
      </td>

      <td className="px-4 py-3 flex gap-2">
        {can("queue_talk") && (
          <button
            onClick={() => toggleTalked(q.id!, q.talked)}
            className={`px-3 py-1 rounded-lg text-xs ${
              q.talked === "lala hadlay"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {q.talked === "lala hadlay" ? "Talked ✓" : "Talk"}
          </button>
        )}

        {can("queue_done") && (
          <button
            onClick={() => updateStatus(q.id!, "done")}
            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
          >
            Done
          </button>
        )}

        {can("queue_delete") && (
          <button
            onClick={() => removeFromQueue(q.id!)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}