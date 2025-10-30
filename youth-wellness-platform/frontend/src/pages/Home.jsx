import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Shield, Heart, Clock, Users, Brain } from 'lucide-react';
import Button from '../components/UI/Button';

const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Companion',
      description: 'Chat with an empathetic AI that understands Indian youth culture and challenges',
    },
    {
      icon: Shield,
      title: '100% Anonymous',
      description: 'Your privacy is sacred. No sign-up, no personal data, completely confidential',
    },
    {
      icon: Heart,
      title: 'Culturally Aware',
      description: 'Understanding Indian family dynamics, academic pressure, and social challenges',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Get support whenever you need it, day or night, without waiting',
    },
    {
      icon: Users,
      title: 'Safe Space',
      description: 'Non-judgmental support for your mental health journey',
    },
    {
      icon: Brain,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns and get personalized insights',
    },
  ];

  const stats = [
    { value: '1M+', label: 'Students in India need support' },
    { value: '24/7', label: 'Always available' },
    { value: '100%', label: 'Anonymous & Safe' },
    { value: '0₹', label: 'Completely Free' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Safe Space for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Mental Wellness
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Anonymous, empathetic, and culturally-aware AI support for Indian youth. 
              Talk about anything - we're here to listen, not judge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Chatting Now
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Resources
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              🔒 100% Anonymous • No Sign-up Required • Free Forever
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose MindCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for Indian youth facing academic pressure, 
              family expectations, and social challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is simple and completely anonymous
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Start Chatting',
                  description: 'Click "Start Chatting" - no sign-up, no personal information required',
                },
                {
                  step: '2',
                  title: 'Share Your Feelings',
                  description: 'Talk about what\'s bothering you. Our AI companion listens without judgment',
                },
                {
                  step: '3',
                  title: 'Get Support',
                  description: 'Receive empathetic responses, coping strategies, and professional resources',
                },
                {
                  step: '4',
                  title: 'Track Your Progress',
                  description: 'Use mood tracking to understand your patterns and see your growth',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              You're Not Alone
            </h2>
            <p className="text-xl text-gray-600">
              Anonymous stories from students like you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "Finally, a place where I can talk about my exam stress without being judged. The AI really understands what students go through.",
                author: "Engineering Student, Delhi",
              },
              {
                quote: "I was hesitant at first, but the anonymity made it easy to open up. It helped me realize I wasn't alone in my struggles.",
                author: "12th Grade Student, Mumbai",
              },
              {
                quote: "The mood tracker helped me see patterns I never noticed. It's like having a supportive friend available 24/7.",
                author: "College Student, Bangalore",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl text-blue-600 mb-4">"</div>
                <p className="text-gray-700 mb-4">{testimonial.quote}</p>
                <p className="text-sm text-gray-500 font-medium">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your mental health matters. Start your journey towards better emotional wellness today.
          </p>
          <Link to="/chat">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Your Free Session
            </Button>
          </Link>
          <p className="mt-6 text-blue-100 text-sm">
            If you're in crisis, please call: Vandrevala Foundation 1860-2662-345 (24/7)
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;