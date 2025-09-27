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
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button, Card, Badge   } from '../../components/ui';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="h-5 w-5" />}
          />
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
              <p className="text-gray-600 dark:text-gray-300">Last updated: January 15, 2025</p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-success-100 dark:bg-success-900/20 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Your Privacy is Our Priority
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
                <Database className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  1. Information We Collect
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Personal Information You Provide
                  </h4>
                  <Card className="mb-3 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
                    <div className="p-4">
                      <p className="text-primary-800 dark:text-primary-200 text-sm">
                        This includes information you voluntarily provide when
                        creating your account and profile.
                      </p>
                    </div>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: "Account Information", detail: "Name, email address, password, graduation year, department" },
                      { label: "Profile Information", detail: "Professional details, bio, location, contact information" },
                      { label: "Educational Information", detail: "Degree details, academic achievements, batch information" },
                      { label: "Professional Information", detail: "Current job, company, skills, work experience" },
                      { label: "Communication Data", detail: "Messages, posts, comments, and other content you share" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{item.label}:</span>
                          <span className="text-sm"> {item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Information Collected Automatically
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label: "Usage Data", detail: "Pages visited, time spent, features used, click patterns" },
                      { label: "Device Information", detail: "IP address, browser type, operating system, device identifiers" },
                      { label: "Log Data", detail: "Access times, error logs, performance data" },
                      { label: "Cookies and Tracking", detail: "Session data, preferences, authentication tokens" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{item.label}:</span>
                          <span className="text-sm"> {item.detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  2. How We Use Your Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Service Operations",
                    items: ["Create and manage your account", "Provide platform features and functionality", "Facilitate connections between alumni"]
                  },
                  {
                    title: "Communication & Support",
                    items: ["Send important service notifications", "Provide customer support", "Share alumni news and updates", "Deliver weekly digest emails (if opted in)"]
                  },
                  {
                    title: "Platform Improvement",
                    items: ["Analyze usage patterns and trends", "Improve platform performance", "Develop new features", "Ensure security and prevent fraud", "Conduct research and analytics"]
                  },
                  {
                    title: "Legal & Compliance",
                    items: ["Comply with legal obligations", "Enforce our Terms of Service", "Protect rights and safety", "Respond to legal requests", "Prevent misuse of the platform"]
                  }
                ].map((category, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      {category.title}
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-success-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  3. How We Share Your Information
                </h3>
              </div>

              <Card className="mb-4 border-warning-200 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/10">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-1" />
                    <div>
                      <p className="text-warning-800 dark:text-warning-200 font-medium mb-2">
                        Your Control Over Sharing
                      </p>
                      <p className="text-warning-700 dark:text-warning-300 text-sm">
                        You have full control over what information is visible to
                        other alumni through your privacy settings.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                {[
                  {
                    title: "With Other Alumni (Based on Your Settings)",
                    items: ["Profile information you choose to make visible", "Messages you send directly to other users"]
                  },
                  {
                    title: "With Service Providers",
                    items: ["Email service providers for notifications", "Cloud hosting providers for data storage", "Analytics providers for platform improvement"]
                  }
                ].map((section, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {section.title}
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-300 ml-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Legal Requirements
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 ml-4">
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
                <Lock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  4. Your Privacy Rights and Controls
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/10">
                  <div className="p-4">
                    <h4 className="font-medium text-success-900 dark:text-success-100 mb-3">
                      Access and Control
                    </h4>
                    <ul className="space-y-2 text-success-800 dark:text-success-200 text-sm">
                      {["View and edit your profile information", "Download your data", "Delete your account", "Control profile visibility", "Manage notification preferences"].map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <Card className="border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
                  <div className="p-4">
                    <h4 className="font-medium text-primary-900 dark:text-primary-100 mb-3">
                      Privacy Settings
                    </h4>
                    <ul className="space-y-2 text-primary-800 dark:text-primary-200 text-sm">
                      {["Choose who can see your information", "Control who can message you", "Set search preferences", "Control online status visibility"].map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  5. Data Security
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Encryption",
                      description: "Data is encrypted in transit and at rest using industry-standard protocols."
                    },
                    {
                      title: "Access Controls",
                      description: "Strict access controls limit who can view and modify your data."
                    },
                    {
                      title: "Regular Audits",
                      description: "We conduct regular security audits and vulnerability assessments."
                    }
                  ].map((item, index) => (
                    <Card key={index} className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  6. Data Retention
                </h3>
              </div>

              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  We retain your personal information only as long as necessary to
                  provide our services and fulfill the purposes outlined in this
                  Privacy Policy.
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Active Accounts", detail: "Data is retained while your account is active" },
                    { label: "Deleted Accounts", detail: "Most data is deleted within 30 days of account deletion" },
                    { label: "Legal Requirements", detail: "Some data may be retained longer if required by law" },
                    { label: "Anonymized Data", detail: "Aggregated, anonymized data may be retained for analytics" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{item.label}:</span>
                        <span> {item.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  7. International Data Transfers
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                Your information may be transferred to and processed in countries
                other than your country of residence. We ensure that such
                transfers comply with applicable data protection laws and that
                your information receives adequate protection.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                8. Children's Privacy
              </h3>
              <Card className="border-error-200 dark:border-error-700 bg-error-50 dark:bg-error-900/10">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400 mt-1" />
                    <div>
                      <p className="text-error-800 dark:text-error-200">
                        Our Service is not intended for individuals under the age of 18.
                        We do not knowingly collect personal information from children
                        under 18. If you become aware that a child has provided us with
                        personal information, please contact us immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                9. Changes to This Privacy Policy
              </h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
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
                <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  10. Contact Us
                </h3>
              </div>

              <Card className="bg-gray-50 dark:bg-gray-800">
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    If you have any questions about this Privacy Policy or our
                    privacy practices, please contact us:
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "Privacy Officer", value: "privacy@iitju-alumni.org" },
                      { label: "General Contact", value: "support@iitju-alumni.org" },
                      { label: "Phone", value: "+880 1712-345678" },
                      { label: "Address", value: "IIT Jahangirnagar University, Savar, Dhaka, Bangladesh" }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Badge variant="primary" size="sm">{contact.label}</Badge>
                        <span className="text-gray-900 dark:text-white font-medium">{contact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                © 2025 IIT Jahangirnagar University Alumni Association. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" size="sm">Version 1.0</Badge>
                <Badge variant="secondary" size="sm">Effective January 15, 2025</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
