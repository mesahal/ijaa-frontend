import React from "react";
import { Link } from "react-router-dom";
import { Button, Card } from '../../components/ui';

const LandingPageSimple = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                IJAA Alumni Network
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Join Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect with Your Alumni Network
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Stay connected with fellow graduates, discover career opportunities, 
            and participate in exclusive alumni events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why Join Our Network?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover the benefits of being part of our alumni community
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Connect with Alumni
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find and connect with fellow graduates from your batch and department
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Events & Meetups
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join alumni events, reunions, and professional meetups
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Career Opportunities
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Discover job opportunities and career guidance from alumni
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of alumni who are already connected
            </p>
            <Link to="/signup">
              <Button size="lg">Join Our Network</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageSimple;

