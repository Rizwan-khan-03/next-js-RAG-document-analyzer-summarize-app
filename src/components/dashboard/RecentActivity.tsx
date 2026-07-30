export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="font-semibold text-white">
        Recent Activity
      </h3>

      <div className="mt-4 space-y-4 text-sm text-gray-400">
        <p>No recent activity</p>
      </div>
    </div>
  );
}