import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDate } from '../../utils/helpers';

const MoodChart = ({ moodEntries }) => {
  if (!Array.isArray(moodEntries) || moodEntries.length === 0) {
    return null;
  }

  // Convert mood to numeric value for chart
  const moodToValue = {
    very_sad: 1,
    sad: 2,
    neutral: 3,
    happy: 4,
    very_happy: 5,
  };

  // Prepare chart data
  const chartData = moodEntries
    .map((entry) => {
      const ts = entry.timestamp || entry.date || entry.createdAt;
      return {
        date: ts ? formatDate(ts) : 'Unknown',
        mood: moodToValue[entry.mood] ?? null,
        intensity: entry.intensity ?? null,
      };
    })
    .filter((d) => d.mood !== null);

  if (chartData.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Mood Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb" // Light grid for light mode
          />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              color: '#1f2937',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
            labelStyle={{ color: '#3b82f6' }}
            itemStyle={{ color: '#111827' }}
            wrapperStyle={{
              colorScheme: 'light dark',
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
