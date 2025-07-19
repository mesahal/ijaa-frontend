import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  MessageCircle,
  Search,
  ArrowRight,
  GraduationCap,
  Network,
  Video,
  Shield,
  Globe,
  Heart,
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Connect with Alumni",
      description:
        "Find and connect with fellow graduates from your batch and department",
    },
    {
      icon: Calendar,
      title: "Alumni Events",
      description:
        "Stay updated with reunions, seminars, and networking events",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description:
        "Chat with individual alumni or participate in group discussions",
    },
    {
      icon: Video,
      title: "Video Calls",
      description:
        "Connect face-to-face with alumni through integrated video calling",
    },
    {
      icon: Network,
      title: "Professional Network",
      description:
        "Build your professional network and explore career opportunities",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find alumni by profession, location, batch year, and interests",
    },
  ];

  const stats = [
    { number: "5000+", label: "Active Alumni" },
    { number: "50+", label: "Countries" },
    { number: "200+", label: "Events Hosted" },
    { number: "15+", label: "Years of Excellence" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-2">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  IIT JU Alumni
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jahangirnagar University
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Connect with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  IIT JU Alumni
                </span>{" "}
                Worldwide
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
                Join the largest network of IIT Jahangirnagar University alumni.
                Connect, collaborate, and create lasting professional
                relationships with graduates from around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signin"
                  className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-center"
                >
                  Already a Member?
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-3 rounded-full shadow-lg">
                <Heart className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 p-3 rounded-full shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform provides all the tools you need to maintain and grow
              your professional network with fellow IIT JU alumni.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group"
              >
                <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <Shield className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Reconnect with Your Alma Mater?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of IIT Jahangirnagar University alumni who are
              already networking, sharing opportunities, and building lasting
              connections.
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center group"
            >
              Join the Network
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-2">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">IIT JU Alumni Network</h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Jahangirnagar University
                </p>
              </div>
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              Connecting graduates, fostering innovation, and building the
              future together.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-600">
              © 2025 IIT Jahangirnagar University Alumni Association. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
