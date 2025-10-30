import React, { useState, useEffect } from 'react';
import { getResources, getEmergencyHelplines } from '../services/api';
import ResourceCard from '../components/Resources/ResourceCard';
import Loading from '../components/UI/Loading';
import Alert from '../components/UI/Alert';
import { Search, Filter, Phone } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [emergencyHelplines, setEmergencyHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'helpline', label: 'Helplines' },
    { value: 'article', label: 'Articles' },
    { value: 'exercise', label: 'Exercises' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'video', label: 'Videos' },
  ];

  useEffect(() => {
    loadResources();
  }, [selectedCategory]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      
      const [resourcesResponse, helplinesResponse] = await Promise.all([
        getResources(filters),
        getEmergencyHelplines(),
      ]);

      if (resourcesResponse.success) {
        setResources(resourcesResponse.resources || []);
      }

      if (helplinesResponse.success) {
        setEmergencyHelplines(helplinesResponse.helplines || []);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = (resourceId) => {
    setResources((prev) =>
      prev.map((r) =>
        r._id === resourceId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
      )
    );
  };

  // Filter resources by search query
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Mental Wellness Resources
          </h1>
          <p className="text-gray-600">
            Curated resources to support your mental health journey
          </p>
        </div>

        {/* Emergency Helplines Banner */}
        {emergencyHelplines.length > 0 && (
          <div className="mb-8">
            <Alert
              type="warning"
              title="Emergency Helplines - Available 24/7"
              message={
                <div className="mt-3 space-y-2">
                  {emergencyHelplines.slice(0, 3).map((helpline, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{helpline.title}</p>
                        <p className="text-sm">{helpline.description}</p>
                      </div>
                      
                      <a  href={`tel:${helpline.content.match(/\d+/)?.[0]}`}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <Phone size={16} />
                        Call Now
                      </a>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 mt-4">
            Showing {filteredResources.length} resource(s)
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <Loading size="lg" text="Loading resources..." />
        ) : (
          <>
            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No resources found. Try a different search or category.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    onMarkHelpful={handleMarkHelpful}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;