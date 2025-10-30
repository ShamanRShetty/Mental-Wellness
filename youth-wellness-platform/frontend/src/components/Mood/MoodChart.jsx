import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  // Prepare chart data — ensure we have timestamp
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Mood Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
