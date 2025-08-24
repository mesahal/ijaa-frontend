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
  AlertCircle,
  Info,
} from "lucide-react";
import { Button, Input, Card, Badge } from "../components/ui";

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
      color: "success"
    },
    {
      value: "medium",
      label: "Medium",
      description: "Standard support request",
      color: "warning"
    },
    {
      value: "high",
      label: "High",
      description: "Urgent issue affecting usage",
      color: "error"
    },
    {
      value: "critical",
      label: "Critical",
      description: "System down, security issue",
      color: "error"
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
      question: "How do I connect with other alumni?",
      answer:
        "Use the search feature to find alumni by name, location, or profession. You can send connection requests and message other alumni directly.",
    },
    {
      question: "What should I do if I can't access my account?",
      answer:
        "First, try resetting your password. If that doesn't work, contact our support team with your email address and we'll help you regain access.",
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <div className="bg-success-100 dark:bg-success-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success-600 dark:text-success-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for contacting us. We've received your message and will
              get back to you within 24 hours.
            </p>

            <Card className="mb-6 border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
              <div className="p-4">
                <p className="text-sm text-primary-800 dark:text-primary-200">
                  <strong>Ticket ID:</strong> #SUP-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
                  Save this ID for future reference
                </p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
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
              >
                Send Another Message
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="h-5 w-5" />}
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Support</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Get help with your account or technical issues
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Please provide detailed information about your issue or question..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    icon={<Send className="h-5 w-5" />}
                    iconPosition="left"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Other Ways to Reach Us
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      icon: Mail,
                      title: "Email",
                      value: "support@iitju-alumni.org",
                      subtitle: "Response within 24 hours"
                    },
                    {
                      icon: Phone,
                      title: "Phone",
                      value: "+880 1712-345678",
                      subtitle: "Mon-Fri, 9 AM - 6 PM (GMT+6)"
                    },
                    {
                      icon: MessageCircle,
                      title: "Live Chat",
                      value: "Available on website",
                      subtitle: "Mon-Fri, 10 AM - 5 PM (GMT+6)"
                    }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <contact.icon className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{contact.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{contact.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{contact.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Response Times */}
            <Card className="border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                    Expected Response Times
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { priority: "Critical", time: "2-4 hours", color: "error" },
                    { priority: "High", time: "4-8 hours", color: "error" },
                    { priority: "Medium", time: "24 hours", color: "warning" },
                    { priority: "Low", time: "48 hours", color: "success" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <Badge variant={item.color} size="sm">{item.priority}</Badge>
                      <span className="font-medium text-primary-900 dark:text-primary-100">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-2">
                        <Info className="h-4 w-4" />
                        <span>{faq.question}</span>
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
