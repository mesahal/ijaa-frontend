import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  Flag,
  Settings,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  ChevronDown,
  ChevronRight,
  Shield,
  Users,
  Calendar,
  Search,
  FileText,
  Upload,
  Download,
  MessageCircle,
  Bell,
  Palette,
  CreditCard,
  Share2,
  BookOpen,
  BarChart3,
  Repeat,
  RefreshCw,
  Activity,
} from "lucide-react";
import { adminApi  } from '../../services/api/adminApi';
import { Card, Button, Badge   } from '../../components/ui';

const AdminFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [createForm, setCreateForm] = useState({
    name: "",
    displayName: "",
    description: "",
    parentId: null,
    enabled: false
  });

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getFeatureFlags();
      setFeatureFlags(response.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (featureName, enabled, event) => {
    // Prevent any form submission or page reload
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      setSaving(true);
      const updateData = { enabled };
      await adminApi.updateFeatureFlag(featureName, updateData);
      
      // Update the state directly instead of refetching to avoid page scroll
      setFeatureFlags(prevFlags => 
        prevFlags.map(flag => {
          // Update parent flag
          if (flag.name === featureName) {
            return { ...flag, enabled };
          }
          // Update child flags
          if (flag.children && flag.children.length > 0) {
            return {
              ...flag,
              children: flag.children.map(child => 
                child.name === featureName ? { ...child, enabled } : child
              )
            };
          }
          return flag;
        })
      );
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFeatureFlag = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.createFeatureFlag(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        displayName: "",
        description: "",
        parentId: null,
        enabled: false
      });
      fetchFeatureFlags();
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFeatureFlag = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateFeatureFlag(selectedFlag.name, createForm);
      setShowEditModal(false);
      setSelectedFlag(null);
      setCreateForm({
        name: "",
        displayName: "",
        description: "",
        parentId: null,
        enabled: false
      });
      fetchFeatureFlags();
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeatureFlag = async (featureName) => {
    if (!window.confirm("Are you sure you want to delete this feature flag?")) {
      return;
    }

    try {
      setSaving(true);
      await adminApi.deleteFeatureFlag(featureName);
      fetchFeatureFlags();
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  const handleEditFeatureFlag = (flag) => {
    setSelectedFlag(flag);
    setCreateForm({
      name: flag.name,
      displayName: flag.displayName || flag.name,
      description: flag.description || "",
      parentId: flag.parentId,
      enabled: flag.enabled
    });
    setShowEditModal(true);
  };

  const getFeatureIcon = (featureName) => {
    const iconMap = {
      'user': <Users className="h-6 w-6 text-blue-500" />,
      'events': <Calendar className="h-6 w-6 text-green-500" />,
      'search': <Search className="h-6 w-6 text-purple-500" />,
      'file-upload': <Upload className="h-6 w-6 text-orange-500" />,
      'file-download': <Download className="h-6 w-6 text-indigo-500" />,
      'file-delete': <Trash2 className="h-6 w-6 text-red-500" />,
      'alumni': <Users className="h-6 w-6 text-teal-500" />,
      'admin': <Shield className="h-6 w-6 text-gray-700" />,
      'chat': <MessageCircle className="h-6 w-6 text-pink-500" />,
      'NEW_UI': <Palette className="h-6 w-6 text-yellow-500" />,
      'CHAT_FEATURE': <MessageCircle className="h-6 w-6 text-pink-500" />,
      'EVENT_REGISTRATION': <Calendar className="h-6 w-6 text-green-500" />,
      'PAYMENT_INTEGRATION': <CreditCard className="h-6 w-6 text-emerald-500" />,
      'SOCIAL_LOGIN': <Share2 className="h-6 w-6 text-blue-500" />,
      'DARK_MODE': <Palette className="h-6 w-6 text-gray-500" />,
      'NOTIFICATIONS': <Bell className="h-6 w-6 text-red-500" />,
      'ADVANCED_SEARCH': <Search className="h-6 w-6 text-purple-500" />,
      'ALUMNI_DIRECTORY': <BookOpen className="h-6 w-6 text-teal-500" />,
      'MENTORSHIP_PROGRAM': <Users className="h-6 w-6 text-indigo-500" />,
      'EVENT_ANALYTICS': <BarChart3 className="h-6 w-6 text-blue-500" />,
      'EVENT_TEMPLATES': <FileText className="h-6 w-6 text-green-500" />,
      'RECURRING_EVENTS': <Repeat className="h-6 w-6 text-orange-500" />,
      'EVENT_MEDIA': <Upload className="h-6 w-6 text-purple-500" />,
      'EVENT_COMMENTS': <MessageCircle className="h-6 w-6 text-pink-500" />,
    };

    const baseName = featureName.split('.')[0];
    return iconMap[baseName] || <Flag className="h-6 w-6 text-gray-500" />;
  };

  const getFeatureDescription = (featureName) => {
    const descriptions = {
      'user.registration': 'User registration functionality',
      'user.login': 'User authentication system',
      'user.password-change': 'Password change functionality',
      'user.profile': 'User profile management',
      'user.experiences': 'Work experience management',
      'user.interests': 'User interests management',
      'events': 'Event management system',
      'events.creation': 'Event creation functionality',
      'events.update': 'Event update functionality',
      'events.delete': 'Event deletion functionality',
      'events.participation': 'Event participation and RSVP',
      'events.invitations': 'Event invitation system',
      'events.comments': 'Event commenting system',
      'events.media': 'Event media attachment support',
      'events.templates': 'Reusable event templates',
      'events.recurring': 'Recurring event patterns',
      'events.reminders': 'Event reminder system',
      'search': 'Search functionality',
      'search.advanced-filters': 'Advanced search filters',
      'file-upload': 'File upload functionality',
      'file-upload.profile-photo': 'Profile photo upload',
      'file-upload.cover-photo': 'Cover photo upload',
      'file-download': 'File download functionality',
      'file-delete': 'File deletion functionality',
      'alumni.search': 'Alumni search functionality',
      'admin.features': 'Admin panel functionality',
      'admin.auth': 'Admin authentication',
      'admin.user-management': 'User management in admin panel',
    };

    return descriptions[featureName] || "Feature flag for system functionality";
  };

  // Process feature flags to handle the API response structure
  const processFeatureFlags = () => {
    const parentFlags = [];
    
    featureFlags.forEach(flag => {
      // Only add parent flags to the main list
      parentFlags.push({
        ...flag,
        isParent: flag.children && flag.children.length > 0,
        hasChildren: flag.children && flag.children.length > 0
      });
    });
    
    return parentFlags;
  };

  const toggleGroup = (parentName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(parentName)) {
      newExpanded.delete(parentName);
    } else {
      newExpanded.add(parentName);
    }
    setExpandedGroups(newExpanded);
  };

  const processedFlags = processFeatureFlags();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header - Consistent with AdminDashboard */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Feature Flags</h1>
              <p className="text-green-100 text-lg">
                Control system functionality with precision
              </p>
              <p className="text-green-200 text-sm mt-1">
                Manage feature availability across the platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-green-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchFeatureFlags}
                icon={<Activity className="h-4 w-4" />}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
                icon={<Plus className="h-4 w-4" />}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={saving}
              >
                Create Flag
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Feature Flags List */}
        <div className="space-y-4">
          {processedFlags.map((flag) => (
            <Card key={flag.id} className="overflow-hidden">
              <div className={`px-6 py-4 ${flag.hasChildren ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} transition-colors`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getFeatureIcon(flag.name)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {flag.displayName || flag.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {flag.description || getFeatureDescription(flag.name)}
                      </p>
                      <div className="flex items-center mt-1">
                        {flag.hasChildren ? (
                          <>
                            <Shield className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              Parent Feature
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">
                              {flag.children?.length || 0} child{flag.children?.length !== 1 ? 'ren' : ''}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs text-gray-500">
                              Standalone Feature
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={flag.enabled ? "success" : "secondary"}>
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleToggleFeature(flag.name, !flag.enabled, e)
                      }
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
                        flag.enabled
                          ? "bg-primary-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          flag.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFeatureFlag(flag)}
                      icon={<Edit className="h-4 w-4" />}
                      title="Edit Feature Flag"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFeatureFlag(flag.name)}
                      icon={<Trash2 className="h-4 w-4" />}
                      title="Delete Feature Flag"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                    {flag.hasChildren && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGroup(flag.name)}
                        icon={expandedGroups.has(flag.name) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        title={expandedGroups.has(flag.name) ? "Hide Children" : "Show Children"}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Show children if expanded */}
              {flag.hasChildren && expandedGroups.has(flag.name) && (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {flag.children?.map((child) => (
                    <div 
                      key={child.id} 
                      className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-xl ml-4">
                            {getFeatureIcon(child.name)}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-base font-medium text-gray-900 dark:text-white">
                              {child.displayName || child.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {child.description || getFeatureDescription(child.name)}
                            </p>
                            <div className="flex items-center mt-1">
                              <ChevronRight className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                Child of {flag.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={child.enabled ? "success" : "secondary"}>
                            {child.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <button
                            type="button"
                            onClick={(e) =>
                              handleToggleFeature(child.name, !child.enabled, e)
                            }
                            disabled={saving}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 ${
                              child.enabled
                                ? "bg-primary-600"
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                child.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFeatureFlag(child)}
                            icon={<Edit className="h-4 w-4" />}
                            title="Edit Feature Flag"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFeatureFlag(child.name)}
                            icon={<Trash2 className="h-4 w-4" />}
                            title="Delete Feature Flag"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {featureFlags.length === 0 && (
          <Card className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-900/30 rounded-full flex items-center justify-center mb-6">
              <Flag className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No feature flags configured
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Get started by creating your first feature flag to control system functionality.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="h-5 w-5" />}
            >
              Create Your First Flag
            </Button>
          </Card>
        )}

        {/* Information Card */}
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-2">
                About Feature Flags
              </h3>
              <p className="text-primary-800 dark:text-primary-200 text-sm leading-relaxed">
                Feature flags provide granular control over system functionality. Parent features control child features - 
                disabling a parent automatically disables all its children. Changes take effect immediately and affect all users.
              </p>
            </div>
          </div>
        </Card>

        {/* Create Feature Flag Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full transform transition-all">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Feature Flag
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                    icon={<X className="h-5 w-5" />}
                  />
                </div>
              </div>

              <form onSubmit={handleCreateFeatureFlag} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="e.g., user.registration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={createForm.displayName}
                    onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="e.g., User Registration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                    placeholder="Describe what this feature does..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.enabled}
                      onChange={(e) => setCreateForm({ ...createForm, enabled: e.target.checked })}
                      className="mr-3 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled by default</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    loading={saving}
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Create Flag
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Edit Feature Flag Modal */}
        {showEditModal && selectedFlag && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full transform transition-all">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Feature Flag
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedFlag(null);
                    }}
                    icon={<X className="h-5 w-5" />}
                  />
                </div>
              </div>

              <form onSubmit={handleUpdateFeatureFlag} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={createForm.displayName}
                    onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="e.g., User Registration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                    placeholder="Describe what this feature does..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.enabled}
                      onChange={(e) => setCreateForm({ ...createForm, enabled: e.target.checked })}
                      className="mr-3 w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedFlag(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    loading={saving}
                    icon={<Save className="h-4 w-4" />}
                  >
                    Update Flag
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeatureFlags; 