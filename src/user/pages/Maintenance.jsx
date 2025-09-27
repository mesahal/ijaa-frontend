import React from "react";
import { Link } from "react-router-dom";
import { Settings, Clock, Mail, GraduationCap, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Button, Card, Badge   } from '../../components/ui';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-900/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IIT JU Alumni</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jahangirnagar University</p>
          </div>
        </div>

        {/* Maintenance Illustration */}
        <Card className="p-8 mb-8">
          <div className="bg-warning-100 dark:bg-warning-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-10 w-10 text-warning-600 dark:text-warning-400 animate-spin" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Under Maintenance
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're currently performing scheduled maintenance to improve your
            experience. We'll be back online shortly!
          </p>

          <Card className="mb-6 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
            <div className="p-4">
              <div className="flex items-center justify-center space-x-2 text-primary-700 dark:text-primary-300 mb-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Estimated downtime: 2 hours</span>
              </div>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Started at 2:00 AM UTC • Expected completion: 4:00 AM UTC
              </p>
            </div>
          </Card>
        </Card>

        {/* What's Being Updated */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            What we're working on:
          </h3>
          <div className="space-y-3">
            {[
              "Database performance improvements",
              "Enhanced security features",
              "New messaging capabilities",
              "Bug fixes and optimizations"
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress Indicator */}
        <Card className="p-6 mb-8 border-warning-200 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <RefreshCw className="h-5 w-5 text-warning-600 dark:text-warning-400 animate-spin" />
            <h3 className="font-semibold text-warning-900 dark:text-warning-100">
              Maintenance Progress
            </h3>
          </div>
          <div className="w-full bg-warning-200 dark:bg-warning-800 rounded-full h-2 mb-3">
            <div className="bg-warning-600 dark:bg-warning-400 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
          <p className="text-sm text-warning-700 dark:text-warning-300">
            65% Complete • Database optimization in progress
          </p>
        </Card>

        {/* Contact Information */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Need immediate assistance?
          </p>
          <Button
            variant="outline"
            as="a"
            href="mailto:support@iitju-alumni.org"
            icon={<Mail className="h-4 w-4" />}
          >
            Contact Support
          </Button>
        </div>

        {/* Status Updates */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Recent Updates
          </h3>
          <div className="space-y-3">
            {[
              { time: "2:15 AM", status: "Database backup completed", type: "success" },
              { time: "2:30 AM", status: "Security patches applied", type: "success" },
              { time: "2:45 AM", status: "Performance optimization in progress", type: "warning" }
            ].map((update, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <Badge variant={update.type} size="sm">{update.time}</Badge>
                <span className="text-gray-600 dark:text-gray-300">{update.status}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Social Links */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Stay updated on our progress:
          </p>
          <div className="flex justify-center space-x-6">
            {[
              {
                name: "Facebook",
                href: "#",
                icon: (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )
              },
              {
                name: "Twitter",
                href: "#",
                icon: (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                )
              },
              {
                name: "LinkedIn",
                href: "#",
                icon: (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )
              }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
