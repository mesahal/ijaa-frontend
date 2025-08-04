import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  Mail,
  Settings,
} from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-2">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Introduction */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Your Privacy is Our Priority
              </h2>
              <p className="text-gray-600 leading-relaxed">
                The IIT Jahangirnagar University Alumni Association ("we", "us",
                or "our") is committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our alumni network platform
                ("Service").
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                1. Information We Collect
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Personal Information You Provide
                </h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <p className="text-blue-800 text-sm">
                    This includes information you voluntarily provide when
                    creating your account and profile.
                  </p>
                </div>
                <ul className="space-y-2 text-gray-600 ml-4">
                  <li>
                    • <strong>Account Information:</strong> Name, email address,
                    password, graduation year, department
                  </li>
                  <li>
                    • <strong>Profile Information:</strong> Professional
                    details, bio, location, contact information
                  </li>
                  <li>
                    • <strong>Educational Information:</strong> Degree details,
                    academic achievements, batch information
                  </li>
                  <li>
                    • <strong>Professional Information:</strong> Current job,
                    company, skills, work experience
                  </li>
                  <li>
                    • <strong>Communication Data:</strong> Messages, posts,
                    comments, and other content you share
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Information Collected Automatically
                </h4>
                <ul className="space-y-2 text-gray-600 ml-4">
                  <li>
                    • <strong>Usage Data:</strong> Pages visited, time spent,
                    features used, click patterns
                  </li>
                  <li>
                    • <strong>Device Information:</strong> IP address, browser
                    type, operating system, device identifiers
                  </li>
                  <li>
                    • <strong>Log Data:</strong> Access times, error logs,
                    performance data
                  </li>
                  <li>
                    • <strong>Cookies and Tracking:</strong> Session data,
                    preferences, authentication tokens
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                2. How We Use Your Information
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Service Operations
                </h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Create and manage your account</li>
                  <li>• Provide platform features and functionality</li>
  
                  <li>• Facilitate connections between alumni</li>
  
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Communication & Support
                </h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Send important service notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Share alumni news and updates</li>
  
                  <li>• Deliver weekly digest emails (if opted in)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Platform Improvement
                </h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Analyze usage patterns and trends</li>
                  <li>• Improve platform performance</li>
                  <li>• Develop new features</li>
                  <li>• Ensure security and prevent fraud</li>
                  <li>• Conduct research and analytics</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Legal & Compliance
                </h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Comply with legal obligations</li>
                  <li>• Enforce our Terms of Service</li>
                  <li>• Protect rights and safety</li>
                  <li>• Respond to legal requests</li>
                  <li>• Prevent misuse of the platform</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                3. How We Share Your Information
              </h3>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Eye className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <p className="text-yellow-800 font-medium mb-2">
                    Your Control Over Sharing
                  </p>
                  <p className="text-yellow-700 text-sm">
                    You have full control over what information is visible to
                    other alumni through your privacy settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  With Other Alumni (Based on Your Settings)
                </h4>
                <ul className="space-y-1 text-gray-600 ml-4">
                  <li>• Profile information you choose to make visible</li>
  
                  <li>• Messages you send directly to other users</li>
  
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  With Service Providers
                </h4>
                <ul className="space-y-1 text-gray-600 ml-4">
  
                  <li>• Email service providers for notifications</li>
                  <li>• Cloud hosting providers for data storage</li>
                  <li>• Analytics providers for platform improvement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Legal Requirements
                </h4>
                <p className="text-gray-600 ml-4">
                  We may disclose your information if required by law, court
                  order, or to protect the rights, property, or safety of our
                  users or the public.
                </p>
              </div>
            </div>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                4. Your Privacy Rights and Controls
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">
                  Access and Control
                </h4>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li>• View and edit your profile information</li>
                  <li>• Download your data</li>
                  <li>• Delete your account</li>
                  <li>• Control profile visibility</li>
                  <li>• Manage notification preferences</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">
                  Privacy Settings
                </h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Choose who can see your information</li>
                  <li>• Control who can message you</li>
  
                  <li>• Set search preferences</li>
                  <li>• Control online status visibility</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                5. Data Security
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Encryption</h4>
                  <p className="text-sm text-gray-600">
                    Data is encrypted in transit and at rest using
                    industry-standard protocols.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Access Controls
                  </h4>
                  <p className="text-sm text-gray-600">
                    Strict access controls limit who can view and modify your
                    data.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Regular Audits
                  </h4>
                  <p className="text-sm text-gray-600">
                    We conduct regular security audits and vulnerability
                    assessments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                6. Data Retention
              </h3>
            </div>

            <div className="space-y-3 text-gray-600">
              <p>
                We retain your personal information only as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy.
              </p>
              <ul className="space-y-1 ml-4">
                <li>
                  • <strong>Active Accounts:</strong> Data is retained while
                  your account is active
                </li>
                <li>
                  • <strong>Deleted Accounts:</strong> Most data is deleted
                  within 30 days of account deletion
                </li>
                <li>
                  • <strong>Legal Requirements:</strong> Some data may be
                  retained longer if required by law
                </li>
                <li>
                  • <strong>Anonymized Data:</strong> Aggregated, anonymized
                  data may be retained for analytics
                </li>
              </ul>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                7. International Data Transfers
              </h3>
            </div>

            <p className="text-gray-600">
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure that such
              transfers comply with applicable data protection laws and that
              your information receives adequate protection.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              8. Children's Privacy
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Our Service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children
                under 18. If you become aware that a child has provided us with
                personal information, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              9. Changes to This Privacy Policy
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and sending you an email notification.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                10. Contact Us
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 mb-3">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Privacy Officer:</strong> privacy@iitju-alumni.org
                </p>
                <p>
                  <strong>General Contact:</strong> support@iitju-alumni.org
                </p>
                <p>
                  <strong>Phone:</strong> +880 1712-345678
                </p>
                <p>
                  <strong>Address:</strong> IIT Jahangirnagar University, Savar,
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              © 2025 IIT Jahangirnagar University Alumni Association. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-500">
              Version 1.0 • Effective January 15, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
