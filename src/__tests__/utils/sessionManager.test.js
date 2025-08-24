import sessionManager from '../../utils/sessionManager';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('sessionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('User Session Management', () => {
    test('should set user session correctly', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User',
        userId: 'USER_123'
      };

      sessionManager.setUserSession(userData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(userData)
      );
    });

    test('should get user session correctly', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User',
        userId: 'USER_123'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      const result = sessionManager.getUserSession();

      expect(localStorage.getItem).toHaveBeenCalledWith('alumni_user');
      expect(result).toEqual({ data: userData });
    });

    test('should return null when no user session exists', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = sessionManager.getUserSession();

      expect(result).toBeNull();
    });

    test('should handle malformed user session data', () => {
      localStorage.getItem.mockReturnValue('invalid-json');

      const result = sessionManager.getUserSession();

      expect(result).toBeNull();
    });

    test('should clear user session', () => {
      sessionManager.clearUser();

      expect(localStorage.removeItem).toHaveBeenCalledWith('alumni_user');
    });

    test('should handle localStorage errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const userData = { email: 'test@example.com' };

      expect(() => {
        sessionManager.setUserSession(userData);
      }).not.toThrow();
    });

    test('should handle localStorage getItem errors', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = sessionManager.getUserSession();

      expect(result).toBeNull();
    });
  });

  describe('Admin Session Management', () => {
    test('should set admin session correctly', () => {
      const adminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };

      sessionManager.setAdminSession(adminData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'alumni_admin',
        JSON.stringify(adminData)
      );
    });

    test('should get admin session correctly', () => {
      const adminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(adminData));

      const result = sessionManager.getAdminSession();

      expect(localStorage.getItem).toHaveBeenCalledWith('alumni_admin');
      expect(result).toEqual({ data: adminData });
    });

    test('should return null when no admin session exists', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = sessionManager.getAdminSession();

      expect(result).toBeNull();
    });

    test('should handle malformed admin session data', () => {
      localStorage.getItem.mockReturnValue('invalid-json');

      const result = sessionManager.getAdminSession();

      expect(result).toBeNull();
    });

    test('should clear admin session', () => {
      sessionManager.clearAdmin();

      expect(localStorage.removeItem).toHaveBeenCalledWith('alumni_admin');
    });

    test('should handle admin session localStorage errors', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const adminData = { email: 'admin@ijaa.com' };

      expect(() => {
        sessionManager.setAdminSession(adminData);
      }).not.toThrow();
    });
  });

  describe('Session Validation', () => {
    test('should validate user session with required fields', () => {
      const validUserData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User',
        userId: 'USER_123'
      };

      const isValid = sessionManager.validateUserSession(validUserData);

      expect(isValid).toBe(true);
    });

    test('should invalidate user session without required fields', () => {
      const invalidUserData = {
        email: 'test@example.com',
        // Missing token
        name: 'Test User'
      };

      const isValid = sessionManager.validateUserSession(invalidUserData);

      expect(isValid).toBe(false);
    });

    test('should validate admin session with required fields', () => {
      const validAdminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };

      const isValid = sessionManager.validateAdminSession(validAdminData);

      expect(isValid).toBe(true);
    });

    test('should invalidate admin session without required fields', () => {
      const invalidAdminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        // Missing adminId and role
        name: 'Admin User'
      };

      const isValid = sessionManager.validateAdminSession(invalidAdminData);

      expect(isValid).toBe(false);
    });

    test('should handle null session data', () => {
      expect(sessionManager.validateUserSession(null)).toBe(false);
      expect(sessionManager.validateAdminSession(null)).toBe(false);
    });

    test('should handle undefined session data', () => {
      expect(sessionManager.validateUserSession(undefined)).toBe(false);
      expect(sessionManager.validateAdminSession(undefined)).toBe(false);
    });
  });

  describe('Cleanup Functions', () => {
    test('should cleanup old session variables', () => {
      sessionManager.cleanupOldVariables();

      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('admin');
      expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
    });

    test('should handle cleanup errors gracefully', () => {
      localStorage.removeItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      expect(() => {
        sessionManager.cleanupOldVariables();
      }).not.toThrow();
    });
  });

  describe('Storage Change Events', () => {
    test('should set up storage change listener', () => {
      const mockCallback = jest.fn();
      const unsubscribe = sessionManager.onStorageChange(mockCallback);

      expect(typeof unsubscribe).toBe('function');
    });

    test('should handle storage events', () => {
      const mockCallback = jest.fn();
      sessionManager.onStorageChange(mockCallback);

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'alumni_user',
        newValue: JSON.stringify({ email: 'test@example.com' }),
        oldValue: null
      });

      window.dispatchEvent(storageEvent);

      expect(mockCallback).toHaveBeenCalled();
    });

    test('should handle storage events for admin sessions', () => {
      const mockCallback = jest.fn();
      sessionManager.onStorageChange(mockCallback);

      // Simulate admin storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'alumni_admin',
        newValue: JSON.stringify({ email: 'admin@ijaa.com' }),
        oldValue: null
      });

      window.dispatchEvent(storageEvent);

      expect(mockCallback).toHaveBeenCalled();
    });

    test('should handle storage events with null values', () => {
      const mockCallback = jest.fn();
      sessionManager.onStorageChange(mockCallback);

      // Simulate storage event with null value (logout)
      const storageEvent = new StorageEvent('storage', {
        key: 'alumni_user',
        newValue: null,
        oldValue: JSON.stringify({ email: 'test@example.com' })
      });

      window.dispatchEvent(storageEvent);

      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Token Management', () => {
    test('should get user token', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      const token = sessionManager.getUserToken();

      expect(token).toBe('mock-jwt-token');
    });

    test('should get admin token', () => {
      const adminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(adminData));

      const token = sessionManager.getAdminToken();

      expect(token).toBe('mock-admin-jwt-token');
    });

    test('should return null for missing tokens', () => {
      localStorage.getItem.mockReturnValue(null);

      expect(sessionManager.getUserToken()).toBeNull();
      expect(sessionManager.getAdminToken()).toBeNull();
    });

    test('should handle malformed data when getting tokens', () => {
      localStorage.getItem.mockReturnValue('invalid-json');

      expect(sessionManager.getUserToken()).toBeNull();
      expect(sessionManager.getAdminToken()).toBeNull();
    });
  });

  describe('Session State Checks', () => {
    test('should check if user is logged in', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      expect(sessionManager.isUserLoggedIn()).toBe(true);
    });

    test('should check if admin is logged in', () => {
      const adminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(adminData));

      expect(sessionManager.isAdminLoggedIn()).toBe(true);
    });

    test('should return false for not logged in users', () => {
      localStorage.getItem.mockReturnValue(null);

      expect(sessionManager.isUserLoggedIn()).toBe(false);
      expect(sessionManager.isAdminLoggedIn()).toBe(false);
    });

    test('should return false for invalid session data', () => {
      localStorage.getItem.mockReturnValue('invalid-json');

      expect(sessionManager.isUserLoggedIn()).toBe(false);
      expect(sessionManager.isAdminLoggedIn()).toBe(false);
    });
  });

  describe('Session Data Retrieval', () => {
    test('should get user email', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      expect(sessionManager.getUserEmail()).toBe('test@example.com');
    });

    test('should get admin email', () => {
      const adminData = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-jwt-token',
        name: 'Admin User'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(adminData));

      expect(sessionManager.getAdminEmail()).toBe('admin@ijaa.com');
    });

    test('should return null for missing emails', () => {
      localStorage.getItem.mockReturnValue(null);

      expect(sessionManager.getUserEmail()).toBeNull();
      expect(sessionManager.getAdminEmail()).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle localStorage being undefined', () => {
      // Temporarily mock localStorage as undefined
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        sessionManager.setUserSession({ email: 'test@example.com' });
      }).not.toThrow();

      expect(() => {
        sessionManager.getUserSession();
      }).not.toThrow();

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
      });
    });

    test('should handle sessionStorage being undefined', () => {
      // Temporarily mock sessionStorage as undefined
      const originalSessionStorage = window.sessionStorage;
      Object.defineProperty(window, 'sessionStorage', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        sessionManager.setUserSession({ email: 'test@example.com' });
      }).not.toThrow();

      // Restore sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: originalSessionStorage,
        writable: true,
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string values', () => {
      localStorage.getItem.mockReturnValue('');

      expect(sessionManager.getUserSession()).toBeNull();
      expect(sessionManager.getAdminSession()).toBeNull();
    });

    test('should handle whitespace-only values', () => {
      localStorage.getItem.mockReturnValue('   ');

      expect(sessionManager.getUserSession()).toBeNull();
      expect(sessionManager.getAdminSession()).toBeNull();
    });

    test('should handle session data with extra fields', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token',
        name: 'Test User',
        extraField: 'should-be-ignored'
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      const result = sessionManager.getUserSession();

      expect(result).toEqual({ data: userData });
    });

    test('should handle session data with missing optional fields', () => {
      const userData = {
        email: 'test@example.com',
        token: 'mock-jwt-token'
        // Missing name and userId
      };

      localStorage.getItem.mockReturnValue(JSON.stringify(userData));

      const result = sessionManager.getUserSession();

      expect(result).toEqual({ data: userData });
    });
  });
});
