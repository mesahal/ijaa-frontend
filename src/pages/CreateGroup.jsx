import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ArrowLeft,
  Save,
  Image,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "department",
    privacy: "public",
    tags: [""],
    rules: ["Be respectful to all members"],
    requireApproval: false,
    allowInvites: true,
  });
  const [errors, setErrors] = useState({});

  const groupTypes = [
    {
      value: "department",
      label: "Department",
      description: "Groups based on academic departments",
    },
    {
      value: "batch",
      label: "Batch",
      description: "Groups for specific graduation years",
    },
    {
      value: "interest",
      label: "Interest",
      description: "Groups based on common interests or hobbies",
    },
    {
      value: "location",
      label: "Location",
      description: "Groups for alumni in specific locations",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Groups for specific professions or industries",
    },
    {
      value: "project",
      label: "Project",
      description: "Groups for collaborative projects",
    },
  ];

  const privacyOptions = [
    {
      value: "public",
      label: "Public",
      icon: Globe,
      description: "Anyone can see the group and join without approval",
    },
    {
      value: "private",
      label: "Private",
      icon: Lock,
      description: "Only members can see the group content",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({
      ...formData,
      tags: newTags,
    });
  };

  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""],
    });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tags: newTags,
    });
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({
      ...formData,
      rules: newRules,
    });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, ""],
    });
  };

  const removeRule = (index) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      rules: newRules,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Group name is required";
    if (!formData.description.trim())
      newErrors.description = "Group description is required";
    if (formData.name.length < 3)
      newErrors.name = "Group name must be at least 3 characters";
    if (formData.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/groups");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Group
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Start a new community for alumni
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.name
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter group name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Type *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {groupTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div>
                      <h3
                        className={`font-medium ${
                          formData.type === type.value
                            ? "text-blue-900 dark:text-blue-100"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.description
                    ? "border-red-300"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe your group's purpose and what members can expect..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Privacy Settings
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Group Privacy *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {privacyOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.privacy === option.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={option.value}
                      checked={formData.privacy === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <option.icon
                        className={`h-5 w-5 ${
                          formData.privacy === option.value
                            ? "text-blue-600"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-medium ${
                            formData.privacy === option.value
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {option.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Require Approval to Join
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    New members need admin approval before joining
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      requireApproval: !formData.requireApproval,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.requireApproval ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.requireApproval
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Allow Member Invites
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Members can invite others to join the group
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      allowInvites: !formData.allowInvites,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.allowInvites ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.allowInvites ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tags
            </h2>
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tag</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="Enter tag (e.g., Technology, Sports, Career)"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tags help members find your group more easily
          </p>
        </div>

        {/* Group Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Group Rules
            </h2>
            <button
              type="button"
              onClick={addRule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.rules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder="Enter group rule"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Clear rules help maintain a positive community environment
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Creating..." : "Create Group"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
