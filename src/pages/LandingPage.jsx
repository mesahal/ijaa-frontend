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
  MapPin,
  Briefcase,
  Award,
  Star,
  CheckCircle,
  Play,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button, Card, Badge } from "../components/ui";
import FeatureFlagWrapper from "../components/FeatureFlagWrapper";

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Connect with Alumni",
      description:
        "Find and connect with fellow graduates from your batch and department",
      color: "primary",
    },
    {
      icon: Calendar,
      title: "Events & Meetups",
      description: "Join alumni events, reunions, and professional meetups",
      color: "success",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Stay connected with instant messaging and group chats",
      color: "warning",
    },
    {
      icon: Video,
      title: "Video Calls",
      description:
        "Connect face-to-face with alumni through integrated video calling",
      color: "error",
    },
    {
      icon: Network,
      title: "Professional Network",
      description:
        "Build your professional network and explore career opportunities",
      color: "secondary",
    },
    {
      icon: Search,
      title: "Advanced Search",
      description:
        "Find alumni by profession, location, batch year, and interests",
      color: "primary",
    },
  ];

  const stats = [
    { number: "5000+", label: "Active Alumni", icon: Users },
    { number: "50+", label: "Countries", icon: Globe },
    { number: "15+", label: "Years of Excellence", icon: Award },
    { number: "200+", label: "Events Hosted", icon: Calendar },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "Google",
      avatar: "/dp.png",
      content:
        "The IIT JU Alumni platform helped me connect with amazing professionals and find my dream job.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Microsoft",
      avatar: "/dp.png",
      content:
        "Great platform for networking and staying updated with university events and opportunities.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Data Scientist",
      company: "Amazon",
      avatar: "/dp.png",
      content:
        "The alumni network is incredibly supportive and the events are always well-organized.",
      rating: 5,
    },
  ];

  const recentEvents = [
    {
      title: "Annual Alumni Meet 2024",
      date: "March 15, 2024",
      location: "Dhaka, Bangladesh",
      attendees: 150,
      type: "NETWORKING",
    },
    {
      title: "Tech Career Workshop",
      date: "February 28, 2024",
      location: "Online",
      attendees: 75,
      type: "WORKSHOP",
    },
    {
      title: "Department Reunion",
      date: "January 20, 2024",
      location: "Jahangirnagar University",
      attendees: 200,
      type: "SOCIAL",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-1 bg-white transition-all duration-300 group-hover:scale-105 rounded-md shadow-sm">
                <img
                  src="/logo-2.png"
                  alt="IIT JU Alumni Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  IIT Alumni Association
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jahangirnagar University
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FeatureFlagWrapper
                featureName="user.login"
                showFallback={false}
                defaultValue={true}
              >
                <Link
                  to="/signin"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
              </FeatureFlagWrapper>
              <FeatureFlagWrapper
                featureName="user.registration"
                showFallback={false}
                defaultValue={true}
              >
                <Button asChild>
                  <Link to="/signup">Join Now</Link>
                </Button>
              </FeatureFlagWrapper>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  <Star className="h-3 w-3 mr-1" />
                  Trusted by 5000+ Alumni
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Connect with{" "}
                  <span className="gradient-text">IIT JU Alumni</span> Worldwide
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  Join the largest network of IIT JU graduates. Connect,
                  collaborate, and grow your professional network with fellow
                  alumni from around the world.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <FeatureFlagWrapper
                  featureName="user.registration"
                  showFallback={false}
                  defaultValue={true}
                >
                  <Button size="lg" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </FeatureFlagWrapper>
                <FeatureFlagWrapper
                  featureName="user.login"
                  showFallback={false}
                  defaultValue={true}
                >
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/signin">Sign In</Link>
                  </Button>
                </FeatureFlagWrapper>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5 text-primary-600 mr-2" />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.number}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/iit_building.webp"
                  alt="Alumni Network"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Active Network
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      5,000+ members
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-100 dark:bg-success-900/50 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Upcoming Event
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Alumni Meet 2024
                    </p>
                  </div>
                </div>
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
              Everything you need to stay connected
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform provides all the tools you need to build meaningful
              connections with your fellow alumni.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover-lift group">
                <div
                  className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to join the network?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Connect with thousands of IIT JU alumni and start building your
            professional network today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FeatureFlagWrapper
              featureName="user.registration"
              showFallback={false}
              defaultValue={true}
            >
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </FeatureFlagWrapper>
            <FeatureFlagWrapper
              featureName="user.login"
              showFallback={false}
              defaultValue={true}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-600"
                asChild
              >
                <Link to="/signin">Sign In</Link>
              </Button>
            </FeatureFlagWrapper>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-1 bg-white transition-all duration-300 group-hover:scale-105 rounded-md shadow-sm">
                  <img
                    src="/logo-2.png"
                    alt="IIT JU Alumni Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">IIT Alumni Association</h3>
                  <p className="text-sm text-gray-400">
                    Jahangirnagar University
                  </p>
                </div>
              </div>
              <p className="text-gray-400">
                Connecting alumni worldwide and fostering lifelong
                relationships.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <FeatureFlagWrapper
                    featureName="user.registration"
                    showFallback={false}
                    defaultValue={true}
                  >
                    <Link
                      to="/signup"
                      className="hover:text-white transition-colors"
                    >
                      Join Network
                    </Link>
                  </FeatureFlagWrapper>
                </li>
                <li>
                  <Link
                    to="/events"
                    className="hover:text-white transition-colors"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="hover:text-white transition-colors"
                  >
                    Find Alumni
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-support"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact-support"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IIT JU Alumni Association. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
