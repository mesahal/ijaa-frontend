import { adminApi, adminApiCall } from '../../utils/adminApi';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  removeItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('adminApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('adminApiCall', () => {
    it('should make API call with correct headers when token exists', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch.mockResolvedValue(mockResponse);

      await adminApiCall('/test-endpoint', { method: 'POST', body: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          body: 'test',
          headers: {
            'Authorization': `Bearer ${mockToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('should throw error when no admin token found', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('No admin token found');
    });

    it('should handle 401 unauthorized response', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { 
        ok: false, 
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('Session expired. Please login again.');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('admin_user');
      expect(window.location.href).toBe('/admin/login');
    });

    it('should handle 403 forbidden response', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { 
        ok: false, 
        status: 403,
        json: () => Promise.resolve({ message: 'Access denied' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('Insufficient privileges');
    });

    it('should handle 404 not found response', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { 
        ok: false, 
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('Resource not found.');
    });

    it('should handle 409 conflict response', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { 
        ok: false, 
        status: 409,
        json: () => Promise.resolve({ message: 'Conflict occurred' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('Conflict occurred');
    });

    it('should handle other error responses', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockResponse = { 
        ok: false, 
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApiCall('/test-endpoint')).rejects.toThrow('Server error');
    });

    it('should return data on successful response', async () => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);

      const mockData = { data: 'test data' };
      const mockResponse = { 
        ok: true, 
        json: () => Promise.resolve(mockData)
      };
      global.fetch.mockResolvedValue(mockResponse);

      const result = await adminApiCall('/test-endpoint');
      expect(result).toEqual(mockData);
    });
  });

  describe('Admin Profile & Password Management', () => {
    beforeEach(() => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
    });

    describe('getAdminProfile', () => {
      it('should call correct endpoint for getting admin profile', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'profile' }) };
        global.fetch.mockResolvedValue(mockResponse);

        await adminApi.getAdminProfile();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/profile'),
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    describe('changeAdminPassword', () => {
      it('should call correct endpoint for changing admin password', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'success' }) };
        global.fetch.mockResolvedValue(mockResponse);

        const passwordData = {
          currentPassword: 'oldpass',
          newPassword: 'newpass',
          confirmPassword: 'newpass'
        };

        await adminApi.changeAdminPassword(passwordData);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/change-password'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(passwordData),
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });
  });

  describe('Admin Management', () => {
    beforeEach(() => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
    });

    describe('getAllAdmins', () => {
      it('should call correct endpoint for getting all admins', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'admins' }) };
        global.fetch.mockResolvedValue(mockResponse);

        await adminApi.getAllAdmins();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admins'),
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    describe('createAdmin', () => {
      it('should call correct endpoint for creating admin', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'created' }) };
        global.fetch.mockResolvedValue(mockResponse);

        const adminData = {
          name: 'New Admin',
          email: 'new@example.com',
          password: 'password123',
          role: 'ADMIN'
        };

        await adminApi.createAdmin(adminData);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/signup'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(adminData),
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    describe('activateAdmin', () => {
      it('should call correct endpoint for activating admin', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'activated' }) };
        global.fetch.mockResolvedValue(mockResponse);

        const adminId = 123;

        await adminApi.activateAdmin(adminId);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admins/123/activate'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });

    describe('deactivateAdmin', () => {
      it('should call correct endpoint for deactivating admin', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'deactivated' }) };
        global.fetch.mockResolvedValue(mockResponse);

        const adminId = 123;

        await adminApi.deactivateAdmin(adminId);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admins/123/deactivate'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            })
          })
        );
      });
    });
  });

  describe('Existing API Methods', () => {
    beforeEach(() => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
    });

    describe('getDashboardStats', () => {
      it('should call dashboard endpoint', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'stats' }) };
        global.fetch.mockResolvedValue(mockResponse);

        await adminApi.getDashboardStats();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/dashboard'),
          expect.any(Object)
        );
      });
    });

    describe('getUsers', () => {
      it('should call users endpoint', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'users' }) };
        global.fetch.mockResolvedValue(mockResponse);

        await adminApi.getUsers();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/users'),
          expect.any(Object)
        );
      });
    });

    describe('getFeatureFlags', () => {
      it('should call feature flags endpoint', async () => {
        const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'flags' }) };
        global.fetch.mockResolvedValue(mockResponse);

        await adminApi.getFeatureFlags();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/feature-flags'),
          expect.any(Object)
        );
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
    });

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      await expect(adminApi.getAdminProfile()).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON responses', async () => {
      const mockResponse = { 
        ok: true, 
        json: () => Promise.reject(new Error('Invalid JSON'))
      };
      global.fetch.mockResolvedValue(mockResponse);

      await expect(adminApi.getAdminProfile()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('API Base URL Configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should use default API base URL when environment variable is not set', () => {
      delete process.env.REACT_APP_API_ADMIN_URL;
      
      // Re-import to get fresh module with updated env
      jest.resetModules();
      const { adminApi } = require('../../utils/adminApi');
      
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
      
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch.mockResolvedValue(mockResponse);

      adminApi.getAdminProfile();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8000/ijaa/api/v1/admin/profile'),
        expect.any(Object)
      );
    });

    it('should use custom API base URL when environment variable is set', () => {
      process.env.REACT_APP_API_ADMIN_URL = 'https://custom-api.com/admin';
      
      // Re-import to get fresh module with updated env
      jest.resetModules();
      const { adminApi } = require('../../utils/adminApi');
      
      const mockToken = 'test-token';
      const mockAdminUser = JSON.stringify({ token: mockToken });
      localStorageMock.getItem.mockReturnValue(mockAdminUser);
      
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch.mockResolvedValue(mockResponse);

      adminApi.getAdminProfile();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom-api.com/admin/profile'),
        expect.any(Object)
      );
    });
  });
});
