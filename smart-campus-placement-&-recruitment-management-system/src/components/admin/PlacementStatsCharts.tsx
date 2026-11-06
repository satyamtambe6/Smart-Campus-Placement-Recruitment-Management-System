import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, PieChart, Award, GraduationCap } from 'lucide-react';

export const PlacementStatsCharts: React.FC = () => {
  const { placementStats, students, applications, jobs } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Charts Row: Branch-wise Placement & Salary Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise Placement Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Branch-wise Placement Performance</h2>
              <p className="text-xs text-slate-500">Placement percentage and average package by department</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>

          <div className="mt-4 space-y-4">
            {placementStats.branchWiseStats.map((item) => (
              <div key={item.branch} className="text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">{item.branch}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">
                      {item.placed} / {item.total} Placed
                    </span>
                    <span className="font-bold text-blue-700 font-mono tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>

                <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                  <span>Batch Class of 2026</span>
                  <span className="font-mono font-medium text-slate-600">
                    Avg Package: {item.avgLPA > 0 ? `${item.avgLPA} LPA` : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Package Tier Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">CTC Compensation Distribution</h2>
              <p className="text-xs text-slate-500">Offers categorized by salary brackets</p>
            </div>
            <PieChart className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="mt-4 space-y-4">
            {placementStats.salaryDistribution.map((tier) => (
              <div key={tier.bracket} className="text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-800">{tier.bracket}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">{tier.count} offers</span>
                    <span className="font-bold text-indigo-700 font-mono tabular-nums">
                      {tier.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(tier.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-[11px] text-slate-500 block">Average Offered CTC</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {placementStats.averagePackageLPA} LPA
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Highest Campus Offer</span>
                <span className="text-lg font-black text-emerald-700 font-mono">
                  {placementStats.highestPackageLPA} LPA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Hiring Progress Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Placement Season Drive Velocity</h2>
            <p className="text-xs text-slate-500">Monthly offers and recruitment drives conducted</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {placementStats.monthlyHiringTrend.map((m) => (
            <div
              key={m.month}
              className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-center"
            >
              <span className="text-[11px] font-bold text-slate-500 block">{m.month}</span>
              <p className="text-xl font-extrabold text-blue-700 font-mono mt-1">{m.offers}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">{m.drives} company drives</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
