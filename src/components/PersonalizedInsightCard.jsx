import React, { useMemo } from 'react';
import { BarChart } from 'lucide-react';

import AssessmentTrendChart from "./AssessmentTrendChart.jsx";










export default function PersonalizedInsightCard({ 
  latestAssessment, 
  assessmentHistory = []
}) {


  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
            <BarChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Well-Being Insights</h3>
            <p className="text-sm text-gray-600">Personalized analysis from recent check-ins</p>
          </div>
        </div>
      </div>

      {/* Score Overview */}


      {/* Trend Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Progress Over Time
          </h4>
        </div>
        <AssessmentTrendChart history={assessmentHistory} />
      </div>


    </div>
  );
}