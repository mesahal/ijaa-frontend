import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

const TermsAndConditions = () => {
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Terms and Conditions
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Last updated: January 15, 2025</p>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900/20 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Welcome to IIT JU Alumni Network
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  These Terms and Conditions ("Terms") govern your use of the IIT
                  Jahangirnagar University Alumni Network platform ("Service")
                  operated by the IIT JU Alumni Association ("we", "us", or
                  "our"). By accessing or using our Service, you agree to be bound
                  by these Terms.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Acceptance of Terms */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  By creating an account or using our Service, you acknowledge
                  that you have read, understood, and agree to be bound by these
                  Terms and our Privacy Policy. If you do not agree to these
                  Terms, please do not use our Service.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to modify these Terms at any time. We will
                  notify users of any material changes via email or through the
                  platform. Your continued use of the Service after such
                  modifications constitutes acceptance of the updated Terms.
                </p>
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                2. Eligibility
              </h3>
              <Card className="mb-4 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1" />
                    <div>
                      <p className="text-primary-800 dark:text-primary-200 font-medium mb-2">
                        Alumni Verification Required
                      </p>
                      <p className="text-primary-700 dark:text-primary-300 text-sm">
                        This platform is exclusively for verified alumni of IIT
                        Jahangirnagar University.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span>You must be a graduate of IIT Jahangirnagar University</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span>You must be at least 18 years old</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span>You must provide accurate and complete information during registration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  <span>You must verify your alumni status through our verification process</span>
                </li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                3. User Accounts
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Account Security:</p>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Account Information:</p>
                  <p>You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">One Account Per Person:</p>
                  <p>Each user may maintain only one account. Multiple accounts by the same person are prohibited.</p>
                </div>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                4. Acceptable Use Policy
              </h3>
              <Card className="mb-4 border-warning-200 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/10">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-1" />
                    <div>
                      <p className="text-warning-800 dark:text-warning-200 font-medium mb-2">
                        Professional Conduct Expected
                      </p>
                      <p className="text-warning-700 dark:text-warning-300 text-sm">
                        This is a professional alumni network. Please maintain
                        appropriate conduct at all times.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Info className="h-4 w-4 text-error-500" />
                    <span>You agree NOT to:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Post offensive, discriminatory, or inappropriate content",
                      "Harass, bully, or threaten other users",
                      "Share false or misleading information",
                      "Violate any applicable laws or regulations",
                      "Spam or send unsolicited commercial messages",
                      "Attempt to hack or compromise the platform's security",
                      "Impersonate others or create fake profiles",
                      "Share copyrighted material without permission"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <div className="w-2 h-2 bg-error-500 rounded-full"></div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success-500" />
                    <span>You agree TO:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Treat all users with respect and professionalism",
                      "Keep your profile information accurate and up-to-date",
                      "Respect others' privacy and intellectual property",
                      "Report inappropriate behavior or content",
                      "Use the platform primarily for professional networking and alumni activities"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-success-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                5. Privacy and Data Protection
              </h3>
              <Card className="mb-4 border-success-200 dark:border-success-700 bg-success-50 dark:bg-success-900/10">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-success-600 dark:text-success-400 mt-1" />
                    <div>
                      <p className="text-success-800 dark:text-success-200 font-medium mb-2">
                        Your Privacy Matters
                      </p>
                      <p className="text-success-700 dark:text-success-300 text-sm">
                        We are committed to protecting your personal information and
                        privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p>
                  Your privacy is important to us. Please review our Privacy
                  Policy to understand how we collect, use, and protect your
                  information.
                </p>
                <p>
                  You have control over your profile visibility and can adjust
                  privacy settings to control who can see your information.
                </p>
                <p>
                  We will never sell your personal information to third parties
                  without your explicit consent.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                6. Intellectual Property
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Platform Content:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    The Service and its original content, features, and functionality are owned by the IIT JU
                    Alumni Association and are protected by international copyright,
                    trademark, and other intellectual property laws.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">User Content:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    You retain ownership of content you post on the platform. By posting content, you grant us a
                    non-exclusive, royalty-free license to use, display, and
                    distribute your content on the platform.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Respect Others' Rights:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    You must not post content that infringes on others' intellectual property rights.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                7. Account Termination
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Voluntary Termination:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may delete your account at any time through your account settings. Upon
                    deletion, your profile and associated data will be permanently removed.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Involuntary Termination:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    We reserve the right to suspend or terminate accounts that violate these Terms or
                    engage in inappropriate behavior.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Effect of Termination:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Upon termination, your right to use the Service will cease immediately, and we may
                    delete your account and associated data.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                8. Disclaimers and Limitations
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Service Availability:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    We strive to maintain high availability but cannot guarantee uninterrupted service.
                    The platform may be temporarily unavailable for maintenance or technical issues.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">User-Generated Content:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    We are not responsible for content posted by users. Users are solely responsible for
                    their posts and interactions.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Third-Party Links:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our Service may contain links to third-party websites. We are not responsible for the
                    content or practices of these external sites.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                9. Contact Information
              </h3>
              <Card className="bg-gray-50 dark:bg-gray-800">
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    If you have any questions about these Terms and Conditions,
                    please contact us:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="primary" size="sm">Email</Badge>
                      <span className="text-gray-900 dark:text-white font-medium">legal@iitju-alumni.org</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="primary" size="sm">Phone</Badge>
                      <span className="text-gray-900 dark:text-white font-medium">+880 1712-345678</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="primary" size="sm">Address</Badge>
                      <span className="text-gray-900 dark:text-white font-medium">IIT Jahangirnagar University, Savar, Dhaka, Bangladesh</span>
                    </div>
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

export default TermsAndConditions;
