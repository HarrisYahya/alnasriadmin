"use client";

import QueueRow from "./QueueRow";

export default function QueueTable({
  queue,
  todayKey,
  can,
  toggleTalked,
  updateStatus,
  removeFromQueue,
  neonMode,
}: any) {
  const todayQueue = queue.filter((q: any) => q.queue_day === todayKey);

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className={`w-full ${neonMode ? "text-white" : "text-gray-900"}`}>
        <thead>
          <tr className={neonMode ? "text-cyan-400" : "text-gray-700"}>
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Talk</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {todayQueue.map((q: any) => (
            <QueueRow
              key={q.id}
              q={q}
              can={can}
              toggleTalked={toggleTalked}
              updateStatus={updateStatus}
              removeFromQueue={removeFromQueue}
              neonMode={neonMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}