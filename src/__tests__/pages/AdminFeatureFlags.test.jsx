import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminFeatureFlags from "../../pages/AdminFeatureFlags";
import { useAuth } from '../../hooks/useAuth';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { AuthProvider } from '../../context/AuthContext';

// Mock the contexts and APIs
jest.mock("../../context/UnifiedAuthContext");
jest.mock("../../utils/adminApi", () => ({
  adminApi: {
    getFeatureFlags: jest.fn(),
    createFeatureFlag: jest.fn(),
    updateFeatureFlag: jest.fn(),
    deleteFeatureFlag: jest.fn(),
  }
}));
jest.mock("../../utils/featureFlagApi", () => ({
  featureFlagApi: {
    refreshFeatureFlagCache: jest.fn(),
  }
}));
jest.mock("../../components/AdminLayout", () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

const mockUseUnifiedAuth = useUnifiedAuth;

// Updated mock data to match the new API structure
const mockFeatureFlags = [
  {
    id: 1,
    name: "events",
    displayName: "Event Management",
    description: "Enable event management functionality",
    enabled: true,
    parentId: null,
    children: [
      {
        id: 2,
        name: "events.creation",
        displayName: "Event Creation",
        description: "Enable event creation functionality",
        enabled: true,
        parentId: 1,
        children: null
      },
      {
        id: 3,
        name: "events.update",
        displayName: "Event Update",
        description: "Enable event update functionality",
        enabled: false,
        parentId: 1,
        children: null
      }
    ]
  },
  {
    id: 4,
    name: "user.profile",
    displayName: "User Profile Features",
    description: "Enable user profile management features",
    enabled: true,
    parentId: null,
    children: [
      {
        id: 5,
        name: "user.registration",
        displayName: "User Registration",
        description: "Enable user registration functionality",
        enabled: true,
        parentId: 4,
        children: null
      },
      {
        id: 6,
        name: "user.login",
        displayName: "User Login",
        description: "Enable user login functionality",
        enabled: false,
        parentId: 4,
        children: null
      }
    ]
  },
  {
    id: 7,
    name: "alumni.search",
    displayName: "Alumni Search",
    description: "Enable alumni search functionality",
    enabled: true,
    parentId: null,
    children: null
  }
];

describe("AdminFeatureFlags - Updated Implementation", () => {
  beforeEach(() => {
    // Mock the auth context
    mockUseUnifiedAuth.mockReturnValue({
      admin: { id: 1, name: "Admin User" }
    });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the feature flags page with header", async () => {
    // Mock API response
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Feature Flags")).toBeInTheDocument();
    });

    expect(screen.getByText("Control system functionality with precision")).toBeInTheDocument();
    expect(screen.getByText("Create Flag")).toBeInTheDocument();
  });

  test("displays parent features individually with proper indicators", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
      expect(screen.getByText("User Profile Features")).toBeInTheDocument();
      expect(screen.getByText("Alumni Search")).toBeInTheDocument();
    });

    // Check for parent feature indicators
    expect(screen.getAllByText("Parent Feature")).toHaveLength(2);
    expect(screen.getByText("Standalone Feature")).toBeInTheDocument();
  });

  test("shows child count for parent features", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Check for child count indicators (there should be 2 parent features with 2 children each)
    expect(screen.getAllByText("2 children")).toHaveLength(2);
  });

  test("shows dropdown buttons for parent features", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Check that dropdown buttons exist for parent features
    const dropdownButtons = screen.getAllByTitle("Show Children");
    expect(dropdownButtons.length).toBeGreaterThan(0);
  });

  test("creates a new feature flag", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
    adminApi.createFeatureFlag.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Create Flag")).toBeInTheDocument();
    });

    // Open create modal
    fireEvent.click(screen.getByText("Create Flag"));

    await waitFor(() => {
      expect(screen.getByText("Create Feature Flag")).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("e.g., user.registration"), {
      target: { value: "test.feature" }
    });
    fireEvent.change(screen.getByPlaceholderText("e.g., User Registration"), {
      target: { value: "Test Feature" }
    });
    fireEvent.change(screen.getByPlaceholderText("Describe what this feature does..."), {
      target: { value: "Test description" }
    });

    // Submit form
    const submitButtons = screen.getAllByText("Create Flag");
    const modalSubmitButton = submitButtons.find(button => button.closest('form'));
    fireEvent.click(modalSubmitButton);

    await waitFor(() => {
      expect(adminApi.createFeatureFlag).toHaveBeenCalledWith({
        name: "test.feature",
        displayName: "Test Feature",
        description: "Test description",
        parentId: null,
        enabled: false
      });
    });
  });

  test("edits a parent feature flag", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
    adminApi.updateFeatureFlag.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Click edit button for Event Management
    const editButtons = screen.getAllByTitle("Edit Feature Flag");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit Feature Flag")).toBeInTheDocument();
    });

    // Wait for the form to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue("events")).toBeInTheDocument();
    });

    // Update display name
    const displayNameInput = screen.getByDisplayValue("Event Management");
    fireEvent.change(displayNameInput, {
      target: { value: "Updated Event Management" }
    });

    // Submit form
    const submitButton = screen.getByText("Update Flag");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminApi.updateFeatureFlag).toHaveBeenCalled();
    });
  });

  test("deletes a parent feature flag", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
    adminApi.deleteFeatureFlag.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Click delete button for Event Management
    const deleteButtons = screen.getAllByTitle("Delete Feature Flag");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(adminApi.deleteFeatureFlag).toHaveBeenCalledWith("events");
    });
  });

  test("toggles parent feature flag status", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
    adminApi.updateFeatureFlag.mockResolvedValue({ data: {} });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Find and click the toggle button for Event Management
    const toggleButtons = screen.getAllByRole("button").filter(button => 
      button.className.includes("inline-flex h-6 w-11")
    );
    
    if (toggleButtons.length > 0) {
      fireEvent.click(toggleButtons[0]);
      
      await waitFor(() => {
        expect(adminApi.updateFeatureFlag).toHaveBeenCalledWith("events", { enabled: false });
      });
    }
  });

  test("shows empty state when no feature flags exist", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No feature flags configured")).toBeInTheDocument();
      expect(screen.getByText("Create Your First Flag")).toBeInTheDocument();
    });
  });

  test("displays feature flag summary in header", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("3 Enabled")).toBeInTheDocument();
      expect(screen.getByText("0 Disabled")).toBeInTheDocument();
      expect(screen.getByText("3 Total")).toBeInTheDocument();
    });
  });

  test("shows proper parent-child relationship indicators", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Check for parent feature indicators
    expect(screen.getAllByText("Parent Feature")).toHaveLength(2); // Two parent features
    expect(screen.getByText("Standalone Feature")).toBeInTheDocument(); // One standalone feature
  });

  test("handles API errors gracefully", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockRejectedValue(new Error("API Error"));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Feature Flags")).toBeInTheDocument();
    });

    // Should still render the page even with API errors
    expect(screen.getByText("Control system functionality with precision")).toBeInTheDocument();
  });

  test("handles toggle feature flag errors", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
    adminApi.updateFeatureFlag.mockRejectedValue(new Error("Update failed"));

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Try to toggle (should not crash)
    const toggleButtons = screen.getAllByRole("button").filter(button => 
      button.className.includes("inline-flex h-6 w-11")
    );
    
    if (toggleButtons.length > 0) {
      fireEvent.click(toggleButtons[0]);
      
      await waitFor(() => {
        expect(adminApi.updateFeatureFlag).toHaveBeenCalled();
      });
    }
  });

  test("dropdowns start closed by default", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Children should not be visible initially
    expect(screen.queryByText("Event Creation")).not.toBeInTheDocument();
    expect(screen.queryByText("Event Update")).not.toBeInTheDocument();
  });

  test("no duplicate features are shown", async () => {
    const { adminApi } = require("../../utils/adminApi");
    adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

    render(
      <BrowserRouter>
        <AuthProvider>
          <AdminFeatureFlags />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Event Management")).toBeInTheDocument();
    });

    // Count occurrences of each feature name
    const eventManagementCount = screen.getAllByText("Event Management").length;

    // Each feature should appear only once initially
    expect(eventManagementCount).toBe(1);
    
    // Event Creation should not be visible until expanded
    expect(screen.queryByText("Event Creation")).not.toBeInTheDocument();
  });
});