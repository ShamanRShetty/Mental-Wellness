import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatDate, getMoodLabel } from '../../utils/helpers';

const MoodChart = ({ moodEntries = [] }) => {
  if (!Array.isArray(moodEntries) || moodEntries.length === 0) return null;

  const moodToValue = {
    very_sad: 1,
    sad: 2,
    neutral: 3,
    happy: 4,
    very_happy: 5,
  };

  const formatShort = (ts) => {
    try {
      return formatDate(ts);
    } catch {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return 'Unknown';
      const isToday = new Date().toDateString() === d.toDateString();
      if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
    }
  };

  const { data: chartData, indexMode } = useMemo(() => {
    // -----------------------------------------------------------------
    // 1. Normalise every entry
    // -----------------------------------------------------------------
    const normalised = moodEntries
      .map((entry, idx) => {
        const ts = entry.timestamp ?? entry.date ?? entry.createdAt;
        if (!ts) return null;

        const dateObj = new Date(ts);
        const rawDate = isNaN(dateObj.getTime()) ? null : dateObj.getTime();
        const moodValue = moodToValue[entry.mood];

        if (!rawDate || moodValue === undefined) return null;

        const dateOnly = new Date(rawDate);
        dateOnly.setHours(0, 0, 0, 0);

        return {
          key: `point-${idx}`,               // stable key
          originalIndex: idx,
          rawDate,
          dateOnly: dateOnly.getTime(),
          xLabel: formatShort(rawDate),
          mood: moodValue,
          intensity: typeof entry.intensity === 'number' ? entry.intensity : null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.rawDate - b.rawDate);

    if (normalised.length === 0) return { data: [], indexMode: false };

    // -----------------------------------------------------------------
    // 2. Detect same‑day mode
    // -----------------------------------------------------------------
    const allSameDay = normalised.every(p => p.dateOnly === normalised[0].dateOnly);

    // -----------------------------------------------------------------
    // 3. Build final data (no mutation later!)
    // -----------------------------------------------------------------
    if (allSameDay) {
      // Index mode – evenly spaced
      const data = normalised.map((p, i) => ({
        ...p,
        rawX: i,
        xLabel: new Date(p.rawDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      return { data, indexMode: true };
    }

    // Time mode – avoid overlapping timestamps **once**
    const data = normalised.map((p, i, arr) => {
      const prev = i > 0 ? arr[i - 1].rawDate : null;
      const x = prev !== null && p.rawDate <= prev ? prev + 1000 : p.rawDate;
      return { ...p, rawX: x };
    });

    return { data, indexMode: false };
  }, [moodEntries]); // ← only recompute when entries change

  if (!chartData.length) return null;

  // -----------------------------------------------------------------
  // Tick generation (unchanged)
  // -----------------------------------------------------------------
  const computeTicks = (data, isIndexMode) => {
    const maxTicks = 6;
    const n = data.length;
    const interval = Math.max(1, Math.round(n / Math.min(n, maxTicks)));

    if (isIndexMode) {
      const ticks = [];
      for (let i = 0; i < n; i += interval) ticks.push(i);
      if (!ticks.includes(n - 1)) ticks.push(n - 1);
      return ticks;
    }

    const times = data.map(d => d.rawX);
    const ticks = times.filter((_, idx) => idx % interval === 0);
    if (!ticks.includes(times[times.length - 1])) ticks.push(times[times.length - 1]);
    return ticks;
  };

  const ticks = computeTicks(chartData, indexMode);
  const yTickVals = [1, 2, 3, 4, 5];

  const findNearest = (value) => {
    if (!chartData.length) return null;
    let best = chartData[0];
    let bestDist = Math.abs(chartData[0].rawX - value);
    for (let i = 1; i < chartData.length; i++) {
      const d = Math.abs(chartData[i].rawX - value);
      if (d < bestDist) {
        best = chartData[i];
        bestDist = d;
      }
    }
    return best;
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md transition-colors duration-300">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Mood Trend
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />

          <XAxis
            dataKey="rawX"
            type="number"
            domain={indexMode ? [0, chartData.length - 1] : ['dataMin', 'dataMax']}
            ticks={ticks}
            tickFormatter={(val) => {
              if (indexMode) {
                const idx = Math.round(val);
                const item = chartData[idx] ?? chartData[chartData.length - 1];
                return item ? item.xLabel : '';
              }
              const nearest = findNearest(val);
              return nearest ? nearest.xLabel : formatShort(val);
            }}
            stroke="#6b7280"
            tick={{ fill: '#374151', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            height={40}
            interval={0}
            minTickGap={10}
          />

          <YAxis
            domain={[1, 5]}
            ticks={yTickVals}
            tickFormatter={(val) => {
              const key = Object.keys(moodToValue).find(k => moodToValue[k] === val);
              return key ? getMoodLabel(key) : val;
            }}
            stroke="#6b7280"
            tick={{ fill: '#374151', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={{ stroke: '#d1d5db' }}
            width={110}
            allowDecimals={false}
          />

          <Tooltip
            labelFormatter={(label) => {
              if (indexMode) {
                const idx = Math.round(label);
                const it = chartData[idx];
                return it ? it.xLabel : '';
              }
              const it = findNearest(label);
              return it ? formatShort(it.rawDate) : formatShort(label);
            }}
            formatter={(value, name) => {
              if (name === 'mood') {
                const moodKey = Object.keys(moodToValue).find(k => moodToValue[k] === value);
                return [getMoodLabel(moodKey) || value, 'Mood'];
              }
              if (name === 'intensity') {
                return [`${value}/10`, 'Intensity'];
              }
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: '#ffffff',
              color: '#111827',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
              padding: '10px 12px',
            }}
            itemStyle={{ color: '#111827' }}
          />

          <ReferenceLine y={3} stroke="#9ca3af" strokeDasharray="4 4" />

          <Line
            type="monotone"
            dataKey="mood"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 5, strokeWidth: 2, fill: '#8B5CF6', stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 2, fill: '#4F46E5', stroke: '#fff' }}
            isAnimationActive={false}      // ← turn off animation while debugging
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Each point is a logged mood. When all entries are on the same day the chart uses even spacing for clarity.
      </p>
    </div>
  );
};

export default MoodChart;