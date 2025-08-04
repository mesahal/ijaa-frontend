import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  ArrowLeft,
  GraduationCap,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

const ContactSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Issue" },
    { value: "account", label: "Account Problem" },


    { value: "privacy", label: "Privacy & Security" },
    { value: "billing", label: "Billing & Payments" },
    { value: "feedback", label: "Feedback & Suggestions" },
  ];

  const priorities = [
    {
      value: "low",
      label: "Low",
      description: "General questions, non-urgent",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Standard support request",
    },
    {
      value: "high",
      label: "High",
      description: "Urgent issue affecting usage",
    },
    {
      value: "critical",
      label: "Critical",
      description: "System down, security issue",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        'Go to the sign-in page and click "Forgot Password". Enter your email address and follow the instructions sent to your email.',
    },
    {
      question: "How can I update my profile information?",
      answer:
        'Navigate to your profile page and click the "Edit Profile" button. You can update your personal information, professional details, and privacy settings.',
    },

    {
      
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We've received your message and will
            get back to you within 24 hours.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Ticket ID:</strong> #SUP-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Save this ID for future reference
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  subject: "",
                  category: "general",
                  message: "",
                  priority: "medium",
                });
              }}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Send Another Message
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
          <p className="text-gray-600 mt-2">
            Get help with your account or technical issues
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label} - {priority.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Please provide detailed information about your issue or question..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Other Ways to Reach Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    support@iitju-alumni.org
                  </p>
                  <p className="text-xs text-gray-500">
                    Response within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+880 1712-345678</p>
                  <p className="text-xs text-gray-500">
                    Mon-Fri, 9 AM - 6 PM (GMT+6)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Live Chat</p>
                  <p className="text-sm text-gray-600">Available on website</p>
                  <p className="text-xs text-gray-500">
                    Mon-Fri, 10 AM - 5 PM (GMT+6)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Times */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Expected Response Times
              </h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Critical:</span>
                <span className="font-medium text-blue-900">2-4 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">High:</span>
                <span className="font-medium text-blue-900">4-8 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Medium:</span>
                <span className="font-medium text-blue-900">24 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Low:</span>
                <span className="font-medium text-blue-900">48 hours</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
