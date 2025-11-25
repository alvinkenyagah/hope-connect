import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Area,
  ComposedChart
} from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const score = payload[0].value;
  const date = payload[0].payload.fullDate;

  let severity = "Minimal";
  let severityColor = "text-green-600 bg-green-50";
  
  if (score >= 20) {
    severity = "Severe";
    severityColor = "text-red-600 bg-red-50";
  } else if (score >= 10) {
    severity = "Moderate";
    severityColor = "text-yellow-600 bg-yellow-50";
  } else if (score >= 5) {
    severity = "Mild";
    severityColor = "text-blue-600 bg-blue-50";
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-xs text-gray-500 mb-1">{date}</p>
      <p className="text-lg font-bold text-gray-900 mb-2">Score: {score}</p>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${severityColor}`}>
        {severity}
      </span>
    </div>
  );
};

const TrendIndicator = ({ history }) => {
  if (history.length < 2) return null;

  const latest = history[0].score;
  const previous = history[1].score;
  const change = latest - previous;

  if (change < -1) {
    return (
      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <TrendingDown className="w-3 h-3" />
        <span className="text-xs font-semibold">Improving</span>
      </div>
    );
  } else if (change > 1) {
    return (
      <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full">
        <TrendingUp className="w-3 h-3" />
        <span className="text-xs font-semibold">Increasing</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
        <Minus className="w-3 h-3" />
        <span className="text-xs font-semibold">Stable</span>
      </div>
    );
  }
};

export default function AssessmentTrendChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <LineChart className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">No trend data yet</p>
          <p className="text-sm text-gray-500">Complete more assessments to see your progress</p>
        </div>
      </div>
    );
  }

  // Format data for the graph
  const chartData = history
    .map((item) => {
      const date = new Date(item.dateTaken);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        fullDate: date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        score: item.score
      };
    })
    .reverse();

  // Calculate average
  const avgScore = (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1);

  // Determine gradient colors based on score range
  const getGradientStops = () => {
    return (
      <>
        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
        <stop offset="20%" stopColor="#3b82f6" stopOpacity={0.2} />
        <stop offset="50%" stopColor="#eab308" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
      </>
    );
  };

  return (
    <div className="space-y-3">
      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-xs text-gray-500">Average</p>
            <p className="text-lg font-bold text-gray-900">{avgScore}</p>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-left">
            <p className="text-xs text-gray-500">Check-ins</p>
            <p className="text-lg font-bold text-gray-900">{history.length}</p>
          </div>
        </div>
        <TrendIndicator history={history} />
      </div>

      {/* Chart */}
      <div className="w-full h-56 bg-gradient-to-br from-indigo-50/30 to-white rounded-xl p-4 border border-gray-100">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                {getGradientStops()}
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            
            {/* Reference lines for severity levels */}
            <ReferenceLine y={5} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.3} />
            <ReferenceLine y={10} stroke="#eab308" strokeDasharray="3 3" strokeOpacity={0.3} />
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.3} />
            
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis 
              domain={[0, 24]} 
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              ticks={[0, 5, 10, 15, 20, 24]}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1 }} />
            
            {/* Area fill under the line */}
            <Area
              type="monotone"
              dataKey="score"
              fill="url(#colorScore)"
              stroke="none"
            />
            
            {/* Main line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: "#6366f1", 
                strokeWidth: 2, 
                stroke: "#fff" 
              }}
              activeDot={{ 
                r: 7, 
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 3
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Minimal (0-4)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Mild (5-9)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-600">Moderate (10-19)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Severe (20-24)</span>
        </div>
      </div>
    </div>
  );
}