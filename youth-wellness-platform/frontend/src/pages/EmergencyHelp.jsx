import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Heart,
  Wind,
  BookOpen,
  User,
  AlertTriangle,
  Clock,
  Shield,
} from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import Alert from '../components/UI/Alert';
import { useNavigate } from 'react-router-dom';

const EmergencyHelp = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const emergencyNumbers = [
    {
      name: 'Emergency Services',
      number: '112',
      description: 'Police, Fire, Ambulance',
      available: '24/7',
      type: 'emergency',
      icon: '🚨',
    },
    {
      name: 'National Emergency Helpline',
      number: '108',
      description: 'Medical Emergency',
      available: '24/7',
      type: 'emergency',
      icon: '🏥',
    },
  ];

  const crisisHelplines = [
    {
      name: 'Vandrevala Foundation',
      number: '1860-2662-345',
      whatsapp: '9999666555',
      description: 'Free mental health support and crisis intervention',
      available: '24/7',
      languages: 'English, Hindi, and regional languages',
      icon: '💙',
    },
    {
      name: 'AASRA',
      number: '91-9820466726',
      email: 'aasrahelpline@yahoo.com',
      description: 'Crisis helpline for suicide prevention',
      available: '24/7',
      languages: 'English, Hindi',
      icon: '🤝',
    },
    {
      name: 'iCall',
      number: '91-9152987821',
      email: 'icall@tiss.edu',
      description: 'Psychosocial helpline by TISS',
      available: 'Mon-Sat, 8 AM - 10 PM',
      languages: 'English, Hindi, Marathi',
      icon: '☎️',
    },
    {
      name: 'Snehi',
      number: '91-22-27546669',
      description: 'Crisis intervention for emotional support',
      available: '24/7',
      languages: 'English, Hindi',
      icon: '💚',
    },
    {
      name: 'Fortis Stress Helpline',
      number: '91-8376804102',
      description: 'Mental health and stress management',
      available: '24/7',
      languages: 'English, Hindi',
      icon: '🏥',
    },
  ];

  const quickActions = [
    {
      title: 'Coping Tools',
      description: 'Immediate stress relief exercises',
      icon: Wind,
      color: 'blue',
      action: () => navigate('/wellness'),
    },
    {
      title: 'Resources',
      description: 'Articles, videos, and guides',
      icon: BookOpen,
      color: 'purple',
      action: () => navigate('/resources'),
    },
    {
      title: 'Chat Support',
      description: 'Talk to our AI companion',
      icon: MessageCircle,
      color: 'green',
      action: () => navigate('/chat'),
    },
  ];

  const handleCallEmergency = (number) => {
    window.location.href = `tel:${number.replace(/[^0-9]/g, '')}`;
  };

  const handleWhatsApp = (number) => {
    const message = encodeURIComponent(
      "Hi, I'm reaching out because I need mental health support. Can you help me?"
    );
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  const shareViaWhatsApp = (helpline) => {
    const message = encodeURIComponent(
      `I found this mental health helpline that might help:\n\n${helpline.name}\nPhone: ${helpline.number}\nAvailable: ${helpline.available}\n\nYou're not alone. Please reach out if you need support.`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setTrustedContacts([...trustedContacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: '', phone: '', relationship: '' });
      
      // Save to localStorage
      const updated = [...trustedContacts, { ...newContact, id: Date.now() }];
      localStorage.setItem('trusted_contacts', JSON.stringify(updated));
      
      alert('Contact added successfully!');
    }
  };

  const handleRemoveContact = (id) => {
    const updated = trustedContacts.filter((c) => c.id !== id);
    setTrustedContacts(updated);
    localStorage.setItem('trusted_contacts', JSON.stringify(updated));
  };

  // Load trusted contacts on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('trusted_contacts');
    if (saved) {
      setTrustedContacts(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-dark-text">
                Need Help Now?
              </h1>
              <p className="text-gray-600 dark:text-dark-muted">
                Immediate support is available. You're not alone.
              </p>
            </div>
          </div>
        </div>

        {/* Crisis Alert */}
        <Alert
          type="error"
          title="In Immediate Danger?"
          message={
            <div className="space-y-2">
              <p>If you or someone you know is in immediate danger:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Call 112 (Emergency Services) immediately</li>
                <li>Go to the nearest hospital emergency room</li>
                <li>Don't leave the person alone</li>
                <li>Remove any means of self-harm</li>
              </ul>
            </div>
          }
        />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Emergency & Crisis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Numbers */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-red-600 dark:text-red-400" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text">
                  Emergency Numbers
                </h2>
              </div>
              <div className="space-y-4">
                {emergencyNumbers.map((item, index) => (
                  <div
                    key={index}
                    className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{item.icon}</span>
                          <h3 className="font-semibold text-gray-800 dark:text-dark-text">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-dark-muted mb-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                          <Clock size={14} />
                          <span>{item.available}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCallEmergency(item.number)}
                        className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                      >
                        <Phone size={18} />
                        {item.number}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Crisis Helplines */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text">
                  24/7 Crisis Helplines
                </h2>
              </div>
              <div className="space-y-4">
                {crisisHelplines.map((helpline, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{helpline.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-1">
                          {helpline.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-dark-muted mb-2">
                          {helpline.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-dark-muted">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {helpline.available}
                          </span>
                          <span>• {helpline.languages}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCallEmergency(helpline.number)}
                        className="flex-1 min-w-[140px] px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <Phone size={16} />
                        Call Now
                      </button>
                      {helpline.whatsapp && (
                        <button
                          onClick={() => handleWhatsApp(helpline.whatsapp)}
                          className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <MessageCircle size={16} />
                          WhatsApp
                        </button>
                      )}
                      <button
                        onClick={() => shareViaWhatsApp(helpline)}
                        className="px-4 py-2 border-2 border-gray-300 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-700 dark:text-dark-text rounded-lg transition"
                        title="Share helpline via WhatsApp"
                      >
                        Share
                      </button>
                    </div>

                    {helpline.email && (
                      <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                        Email: {helpline.email}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Find Local Centers */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-purple-600 dark:text-purple-400" size={24} />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-dark-text">
                  Find Local Support Centers
                </h2>
              </div>
              <p className="text-gray-600 dark:text-dark-muted mb-4">
                Search for mental health professionals and counseling centers near you
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/mental+health+counselor+near+me',
                      '_blank'
                    )
                  }
                  icon={<MapPin size={18} />}
                >
                  Find Counselors Near Me
                </Button>
                <Button
                  variant="outline"
                  className="w-full dark:border-dark-border dark:text-dark-text"
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/psychiatric+hospital+near+me',
                      '_blank'
                    )
                  }
                  icon={<MapPin size={18} />}
                >
                  Find Psychiatric Hospitals
                </Button>
                <Button
                  variant="outline"
                  className="w-full dark:border-dark-border dark:text-dark-text"
                  onClick={() =>
                    window.open(
                      'https://www.google.com/maps/search/therapy+center+near+me',
                      '_blank'
                    )
                  }
                  icon={<MapPin size={18} />}
                >
                  Find Therapy Centers
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Trusted Contacts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full text-left p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20`}
                        >
                          <Icon
                            className={`text-${action.color}-600 dark:text-${action.color}-400`}
                            size={20}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-dark-muted">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Trusted Contacts */}
            <Card className="dark:bg-dark-card dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="text-green-600 dark:text-green-400" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text">
                    Trusted Contacts
                  </h2>
                </div>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  + Add
                </button>
              </div>

              {trustedContacts.length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto text-gray-300 dark:text-gray-600 mb-3" size={48} />
                  <p className="text-gray-600 dark:text-dark-muted text-sm mb-3">
                    Add people you trust and can reach out to
                  </p>
                  <Button size="sm" onClick={() => setShowContactModal(true)}>
                    Add Contact
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {trustedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-dark-text">
                            {contact.name}
                          </h3>
                          {contact.relationship && (
                            <p className="text-xs text-gray-500 dark:text-dark-muted">
                              {contact.relationship}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveContact(contact.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        onClick={() => handleCallEmergency(contact.phone)}
                        className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition text-sm"
                      >
                        <Phone size={16} />
                        Call {contact.phone}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Safety Reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    You Are Important
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Your life matters. If you're having thoughts of self-harm or suicide, please reach out immediately. Help is available 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tips */}
        <Card className="mt-6 dark:bg-dark-card dark:border-dark-border">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">
            While You Wait for Help
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-2">
                💨 Breathe
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted">
                Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8 seconds
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-2">
                🧊 Ground Yourself
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted">
                Use 5-4-3-2-1: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-dark-text mb-2">
                🚶 Move
              </h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted">
                Take a short walk, stretch, or do light exercise to release tension
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Add Trusted Contact"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Name *
            </label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Enter name"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={newContact.phone}
              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Relationship (Optional)
            </label>
            <input
              type="text"
              value={newContact.relationship}
              onChange={(e) =>
                setNewContact({ ...newContact, relationship: e.target.value })
              }
              placeholder="e.g., Friend, Family, Counselor"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowContactModal(false);
                setNewContact({ name: '', phone: '', relationship: '' });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              disabled={!newContact.name || !newContact.phone}
              className="flex-1"
            >
              Add Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmergencyHelp;