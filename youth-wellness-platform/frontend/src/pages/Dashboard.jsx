import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  getConversationHistory,
  getMoodHistory,
  getJournalEntries,
} from '../services/api';
import {
  TrendingUp,
  MessageSquare,
  BookOpen,
  Heart,
  Award,
  Zap,
} from 'lucide-react';
import Card from '../components/UI/Card';
import Loading from '../components/UI/Loading';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { sessionId } = useApp();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMoodEntries: 0,
    totalJournalEntries: 0,
    currentStreak: 0,
    moodTrend: [],
    activityByDay: [],
    moodDistribution: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, [sessionId]);

  const loadDashboardData = async () => {
    try {
      const [chatResponse, moodResponse, journalResponse] = await Promise.all([
        getConversationHistory(sessionId),
        getMoodHistory(30),
        getJournalEntries(sessionId),
      ]);

      const totalChats = chatResponse.success
        ? chatResponse.history.filter((msg) => msg.role === 'user').length
        : 0;

      const moodEntries = (() => {
        if (!moodResponse) return [];
        if (Array.isArray(moodResponse)) return moodResponse;
        if (Array.isArray(moodResponse.moodEntries)) return moodResponse.moodEntries;
        if (Array.isArray(moodResponse.data)) return moodResponse.data;
        return [];
      })();

      const journalEntries = journalResponse.success ? journalResponse.entries : [];

      const moodTrend = processMoodTrend(moodEntries);
      const activityByDay = processActivityByDay(
        moodEntries,
        journalEntries,
        chatResponse.history || []
      );
      const moodDistribution = processMoodDistribution(moodEntries);
      const currentStreak = calculateActivityStreak([
        ...moodEntries,
        ...journalEntries,
      ]);

      setStats({
        totalChats,
        totalMoodEntries: moodEntries.length,
        totalJournalEntries: journalEntries.length,
        currentStreak,
        moodTrend,
        activityByDay,
        moodDistribution,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg">
        <Loading size="lg" text="Loading your progress..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={40} />
            Your Progress Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your mental wellness journey and celebrate your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={MessageSquare} title="Chat Messages" value={stats.totalChats} color="blue" subtitle="Conversations with AI" />
          <StatCard icon={Heart} title="Mood Entries" value={stats.totalMoodEntries} color="pink" subtitle="Times you checked in" />
          <StatCard icon={BookOpen} title="Journal Entries" value={stats.totalJournalEntries} color="purple" subtitle="Written reflections" />
          <StatCard icon={Zap} title="Current Streak" value={`${stats.currentStreak} days`} color="orange" subtitle="Keep it up!" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Mood Trend */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Mood Trend (Last 30 Days)
            </h3>
            {stats.moodTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="date" stroke="currentColor" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="currentColor" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#3B82F6" strokeWidth={2} name="Mood Score" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                Start tracking your mood to see trends
              </p>
            )}
          </Card>

          {/* Mood Distribution */}
          <Card>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Mood Distribution
            </h3>
            {stats.moodDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.moodDistribution} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={100} dataKey="value">
                    {stats.moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                Log your moods to see distribution
              </p>
            )}
          </Card>
        </div>

        {/* Activity */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Activity Overview (Last 7 Days)
          </h3>
          {stats.activityByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.activityByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff' }} />
                <Legend />
                <Bar dataKey="moods" fill="#EC4899" name="Mood Check-ins" />
                <Bar dataKey="journals" fill="#8B5CF6" name="Journal Entries" />
                <Bar dataKey="chats" fill="#3B82F6" name="Chat Messages" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-gray-500 dark:text-gray-400">
              Start using the app to see your activity
            </p>
          )}
        </Card>

        {/* Achievements */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-yellow-500" size={28} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Your Achievements
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '🎯', title: 'First Steps', description: 'Started your wellness journey', earned: stats.totalChats > 0 || stats.totalMoodEntries > 0 },
              { icon: '💪', title: 'Consistent', description: '7-day streak achieved', earned: stats.currentStreak >= 7 },
              { icon: '✍️', title: 'Reflective', description: 'Wrote 5 journal entries', earned: stats.totalJournalEntries >= 5 },
              { icon: '📊', title: 'Self-Aware', description: 'Logged 10 mood entries', earned: stats.totalMoodEntries >= 10 },
              { icon: '💬', title: 'Communicator', description: '50 chat messages sent', earned: stats.totalChats >= 50 },
              { icon: '🔥', title: 'On Fire!', description: '30-day streak achieved', earned: stats.currentStreak >= 30 },
            ].map((a, i) => (
              <Achievement key={i} {...a} />
            ))}
          </div>
        </Card>

        {/* Quote */}
        <div className="mt-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center shadow-lg">
          <p className="text-2xl font-semibold mb-2">"Progress, not perfection."</p>
          <p className="text-blue-100">Every small step you take is a victory. Keep going! 💙</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
};

const Achievement = ({ icon, title, description, earned }) => (
  <div
    className={`p-4 rounded-lg border-2 transition ${
      earned
        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60'
    }`}
  >
    <div className="text-4xl mb-2 text-center">{icon}</div>
    <h4 className={`font-semibold text-center mb-1 ${earned ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
      {title}
    </h4>
    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{description}</p>
    {earned && (
      <div className="mt-2 text-center">
        <span className="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 px-2 py-1 rounded-full font-medium">
          Unlocked! ✓
        </span>
      </div>
    )}
  </div>
);

function processMoodTrend(moodEntries) {
  const moodValues = { very_sad: 1, sad: 2, neutral: 3, happy: 4, very_happy: 5 };
  const dateMap = {};
  moodEntries.forEach((e) => {
    const d = formatDate(e.timestamp);
    if (!dateMap[d]) dateMap[d] = [];
    dateMap[d].push(moodValues[e.mood]);
  });
  return Object.entries(dateMap)
    .map(([date, moods]) => ({ date, mood: moods.reduce((a, b) => a + b) / moods.length }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30);
}

function processActivityByDay(m, j, c) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days.map((d) => {
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const f = (arr, k) => arr.filter((e) => new Date(e[k]) >= d && new Date(e[k]) < next).length;
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), moods: f(m, 'timestamp'), journals: f(j, 'createdAt'), chats: c.filter((e) => e.role === 'user' && new Date(e.timestamp) >= d && new Date(e.timestamp) < next).length };
  });
}

function processMoodDistribution(entries) {
  const map = {
    very_sad: { c: 0, color: '#EF4444', emoji: '😢' },
    sad: { c: 0, color: '#F97316', emoji: '😔' },
    neutral: { c: 0, color: '#6B7280', emoji: '😐' },
    happy: { c: 0, color: '#10B981', emoji: '🙂' },
    very_happy: { c: 0, color: '#3B82F6', emoji: '😊' },
  };
  entries.forEach((e) => map[e.mood] && map[e.mood].c++);
  return Object.entries(map)
    .filter(([_, v]) => v.c > 0)
    .map(([k, v]) => ({ name: k.replace('_', ' '), value: v.c, color: v.color, emoji: v.emoji }));
}

function calculateActivityStreak(entries) {
  if (!entries.length) return 0;
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));
  let streak = 0;
  let cur = new Date(); cur.setHours(0, 0, 0, 0);
  for (const e of sorted) {
    const d = new Date(e.timestamp || e.createdAt);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((cur - d) / (1000 * 60 * 60 * 24));
    if (diff === streak) streak++;
    else if (diff > streak) break;
  }
  return streak;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + r * Math.sin(-midAngle * Math.PI / 180);
  return (
    <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="14" fontWeight="bold">
      {`${payload.emoji} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default Dashboard;
