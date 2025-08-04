import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  FileText,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";

const TermsAndConditions = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">
              Terms and Conditions
            </h1>
            <p className="text-gray-600">Last updated: January 15, 2025</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Introduction */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Welcome to IIT JU Alumni Network
              </h2>
              <p className="text-gray-600 leading-relaxed">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h3>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                By creating an account or using our Service, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms and our Privacy Policy. If you do not agree to these
                Terms, please do not use our Service.
              </p>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes via email or through the
                platform. Your continued use of the Service after such
                modifications constitutes acceptance of the updated Terms.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              2. Eligibility
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-blue-800 font-medium mb-2">
                    Alumni Verification Required
                  </p>
                  <p className="text-blue-700 text-sm">
                    This platform is exclusively for verified alumni of IIT
                    Jahangirnagar University.
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• You must be a graduate of IIT Jahangirnagar University</li>
              <li>• You must be at least 18 years old</li>
              <li>
                • You must provide accurate and complete information during
                registration
              </li>
              <li>
                • You must verify your alumni status through our verification
                process
              </li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              3. User Accounts
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Account Security:</strong> You are responsible for
                maintaining the confidentiality of your account credentials and
                for all activities that occur under your account.
              </p>
              <p>
                <strong>Account Information:</strong> You agree to provide
                accurate, current, and complete information during registration
                and to update such information to keep it accurate, current, and
                complete.
              </p>
              <p>
                <strong>One Account Per Person:</strong> Each user may maintain
                only one account. Multiple accounts by the same person are
                prohibited.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              4. Acceptable Use Policy
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <p className="text-yellow-800 font-medium mb-2">
                    Professional Conduct Expected
                  </p>
                  <p className="text-yellow-700 text-sm">
                    This is a professional alumni network. Please maintain
                    appropriate conduct at all times.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  You agree NOT to:
                </h4>
                <ul className="space-y-1 text-gray-600 ml-4">
                  <li>
                    • Post offensive, discriminatory, or inappropriate content
                  </li>
                  <li>• Harass, bully, or threaten other users</li>
                  <li>• Share false or misleading information</li>
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Spam or send unsolicited commercial messages</li>
                  <li>
                    • Attempt to hack or compromise the platform's security
                  </li>
                  <li>• Impersonate others or create fake profiles</li>
                  <li>• Share copyrighted material without permission</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  You agree TO:
                </h4>
                <ul className="space-y-1 text-gray-600 ml-4">
                  <li>• Treat all users with respect and professionalism</li>
                  <li>
                    • Keep your profile information accurate and up-to-date
                  </li>
                  <li>• Respect others' privacy and intellectual property</li>
                  <li>• Report inappropriate behavior or content</li>
                  <li>
                    • Use the platform primarily for professional networking and
                    alumni activities
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              5. Privacy and Data Protection
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="text-green-800 font-medium mb-2">
                    Your Privacy Matters
                  </p>
                  <p className="text-green-700 text-sm">
                    We are committed to protecting your personal information and
                    privacy.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-gray-600">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              6. Intellectual Property
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Platform Content:</strong> The Service and its original
                content, features, and functionality are owned by the IIT JU
                Alumni Association and are protected by international copyright,
                trademark, and other intellectual property laws.
              </p>
              <p>
                <strong>User Content:</strong> You retain ownership of content
                you post on the platform. By posting content, you grant us a
                non-exclusive, royalty-free license to use, display, and
                distribute your content on the platform.
              </p>
              <p>
                <strong>Respect Others' Rights:</strong> You must not post
                content that infringes on others' intellectual property rights.
              </p>
            </div>
          </section>



          {/* Termination */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              8. Account Termination
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Voluntary Termination:</strong> You may delete your
                account at any time through your account settings. Upon
                deletion, your profile and associated data will be permanently
                removed.
              </p>
              <p>
                <strong>Involuntary Termination:</strong> We reserve the right
                to suspend or terminate accounts that violate these Terms or
                engage in inappropriate behavior.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination, your
                right to use the Service will cease immediately, and we may
                delete your account and associated data.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              9. Disclaimers and Limitations
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Service Availability:</strong> We strive to maintain
                high availability but cannot guarantee uninterrupted service.
                The platform may be temporarily unavailable for maintenance or
                technical issues.
              </p>
              <p>
                <strong>User-Generated Content:</strong> We are not responsible
                for content posted by users. Users are solely responsible for
                their posts and interactions.
              </p>
              <p>
                <strong>Third-Party Links:</strong> Our Service may contain
                links to third-party websites. We are not responsible for the
                content or practices of these external sites.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              10. Contact Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 mb-3">
                If you have any questions about these Terms and Conditions,
                please contact us:
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Email:</strong> legal@iitju-alumni.org
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

export default TermsAndConditions;
