"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalDocuments: number;
  processedDocuments: number;
  pendingDocuments: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      <div className="border rounded p-4">
        <h3>Total Documents</h3>
        <p className="text-2xl font-bold">
          {stats.totalDocuments}
        </p>
      </div>

      <div className="border rounded p-4">
        <h3>Processed</h3>
        <p className="text-2xl font-bold">
          {stats.processedDocuments}
        </p>
      </div>

      <div className="border rounded p-4">
        <h3>Pending</h3>
        <p className="text-2xl font-bold">
          {stats.pendingDocuments}
        </p>
      </div>
    </div>
  );
}