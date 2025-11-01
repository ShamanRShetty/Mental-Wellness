import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  createJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  getJournalPrompts
} from '../services/api';
import { BookOpen, Plus, Edit2, Trash2, Lightbulb, Save, X } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Loading from '../components/UI/Loading';
import Modal from '../components/UI/Modal';
import { formatDate, formatTime, getMoodEmoji, getMoodLabel } from '../utils/helpers';

const Journal = () => {
  const { sessionId } = useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [tags, setTags] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  const moods = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];

  useEffect(() => {
    loadEntries();
    loadPrompts();
  }, [sessionId]);

  const loadEntries = async () => {
    try {
      const response = await getJournalEntries(sessionId);
      if (response.success) {
        setEntries(response.entries || []);
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrompts = async () => {
    try {
      const response = await getJournalPrompts();
      if (response.success) {
        setPrompts(response.prompts || []);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const openEditor = (entry = null) => {
    if (entry) {
      setCurrentEntry(entry);
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedMood(entry.mood || 'neutral');
      setTags(entry.tags?.join(', ') || '');
      setSelectedPrompt(entry.prompt || '');
    } else {
      setCurrentEntry(null);
      setTitle('');
      setContent('');
      setSelectedMood('neutral');
      setTags('');
      setSelectedPrompt('');
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setCurrentEntry(null);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please write something in your journal');
      return;
    }

    setSaving(true);

    try {
      const entryData = {
        sessionId,
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        mood: selectedMood,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        prompt: selectedPrompt
      };

      if (currentEntry) {
        await updateJournalEntry(currentEntry._id, entryData);
      } else {
        await createJournalEntry(entryData);
      }

      await loadEntries();
      closeEditor();
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await deleteJournalEntry(id);
      await loadEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const usePrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setContent(prompt + '\n\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <Loading size="lg" text="Loading your journal..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
              <BookOpen className="text-blue-600" size={40} />
              My Journal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              A private space for your thoughts and reflections
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => openEditor()}
            icon={<Plus size={20} />}
          >
            New Entry
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center dark:bg-gray-800 dark:text-gray-100">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Total Entries</p>
            <p className="text-4xl font-bold text-blue-600">{entries.length}</p>
          </Card>
          <Card className="text-center dark:bg-gray-800 dark:text-gray-100">
            <p className="text-gray-600 dark:text-gray-400 mb-2">This Month</p>
            <p className="text-4xl font-bold text-green-600">
              {entries.filter(e => {
                const entryDate = new Date(e.createdAt);
                const now = new Date();
                return entryDate.getMonth() === now.getMonth() &&
                       entryDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </Card>
          <Card className="text-center dark:bg-gray-800 dark:text-gray-100">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Current Streak</p>
            <p className="text-4xl font-bold text-purple-600">
              {calculateStreak(entries)} days
            </p>
          </Card>
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <Card className="text-center py-12 dark:bg-gray-800">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Start Your Journaling Journey
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Writing about your feelings can help you understand yourself better
            </p>
            <Button onClick={() => openEditor()}>Write Your First Entry</Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry._id} hover className="dark:bg-gray-800 dark:text-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {entry.mood && (
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(entry.createdAt)} at {formatTime(entry.createdAt)}
                        </p>
                      </div>
                    </div>

                    {entry.prompt && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 mb-3">
                        <p className="text-sm text-blue-800 dark:text-blue-300 italic">
                          Prompt: {entry.prompt}
                        </p>
                      </div>
                    )}

                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap line-clamp-3">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {entry.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openEditor(entry)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Editor Modal */}
        <Modal
          isOpen={showEditor}
          onClose={closeEditor}
          title={currentEntry ? 'Edit Entry' : 'New Journal Entry'}
          size="lg"
        >
          <div className="space-y-4 dark:text-gray-100">
            {!currentEntry && prompts.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="text-yellow-600 dark:text-yellow-400" size={20} />
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                    Need inspiration? Try these prompts:
                  </h4>
                </div>
                <div className="space-y-2">
                  {prompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => usePrompt(prompt)}
                      className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:border-yellow-400 transition text-sm text-gray-700 dark:text-gray-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Thoughts
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none"
                rows="12"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How are you feeling?
              </label>
              <div className="flex gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      selectedMood === mood
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{getMoodLabel(mood)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="family, work, gratitude (comma-separated)"
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
              <Button variant="ghost" onClick={closeEditor}>
                <X size={18} className="mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={!content.trim()}
                icon={<Save size={18} />}
              >
                {currentEntry ? 'Update' : 'Save'} Entry
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

function calculateStreak(entries) {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

export default Journal;
