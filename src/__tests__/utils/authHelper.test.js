import { 
  saveUserToStorage, 
  getUserFromStorage, 
  removeUserFromStorage, 
  isTokenValid, 
  decodeToken 
} from '../../utils/authHelper';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('authHelper', () => {
  const mockUser = {
    username: 'testuser',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNDU3MTQ5MH0.mock-signature',
    userId: 'USER_123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveUserToStorage', () => {
    test('saves user data to localStorage', () => {
      saveUserToStorage(mockUser);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(mockUser)
      );
    });

    test('handles null user data', () => {
      saveUserToStorage(null);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(null)
      );
    });

    test('handles undefined user data', () => {
      saveUserToStorage(undefined);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(undefined)
      );
    });

    test('handles user data with special characters', () => {
      const userWithSpecialChars = {
        ...mockUser,
        name: 'Test User & Co.',
        email: 'test.user@domain.com'
      };

      saveUserToStorage(userWithSpecialChars);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(userWithSpecialChars)
      );
    });
  });

  describe('getUserFromStorage', () => {
    test('retrieves user data from localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = getUserFromStorage();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('alumni_user');
      expect(result).toEqual(mockUser);
    });

    test('returns null when no user data in storage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getUserFromStorage();

      expect(result).toBeNull();
    });

    test('returns null when storage contains invalid JSON', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const result = getUserFromStorage();

      expect(result).toBeNull();
    });

    test('returns null when storage is empty string', () => {
      localStorageMock.getItem.mockReturnValue('');

      const result = getUserFromStorage();

      expect(result).toBeNull();
    });

    test('handles JSON parsing errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('{"incomplete":');

      const result = getUserFromStorage();

      expect(result).toBeNull();
    });
  });

  describe('removeUserFromStorage', () => {
    test('removes user data from localStorage', () => {
      removeUserFromStorage();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('alumni_user');
    });

    test('calls removeItem even if no user data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      removeUserFromStorage();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('alumni_user');
    });
  });

  describe('isTokenValid', () => {
    test('returns true for valid token', () => {
      // Mock current time to be within token validity
      const mockDate = new Date('2021-10-20T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = isTokenValid(mockUser.token);

      expect(result).toBe(true);
    });

    test('returns false for expired token', () => {
      // Mock current time to be after token expiration
      const mockDate = new Date('2021-10-20T14:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = isTokenValid(mockUser.token);

      expect(result).toBe(false);
    });

    test('returns false for invalid token format', () => {
      const result = isTokenValid('invalid-token');

      expect(result).toBe(false);
    });

    test('returns false for null token', () => {
      const result = isTokenValid(null);

      expect(result).toBe(false);
    });

    test('returns false for undefined token', () => {
      const result = isTokenValid(undefined);

      expect(result).toBe(false);
    });

    test('returns false for empty string token', () => {
      const result = isTokenValid('');

      expect(result).toBe(false);
    });

    test('handles malformed JWT token', () => {
      const malformedToken = 'not.a.valid.jwt.token';

      const result = isTokenValid(malformedToken);

      expect(result).toBe(false);
    });

    test('handles token with invalid payload', () => {
      const invalidPayloadToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid-payload.mock-signature';

      const result = isTokenValid(invalidPayloadToken);

      expect(result).toBe(false);
    });
  });

  describe('decodeToken', () => {
    test('decodes valid JWT token', () => {
      const decoded = decodeToken(mockUser.token);

      expect(decoded).toEqual({
        username: 'testuser',
        role: 'USER',
        iat: 1634567890,
        exp: 1634571490
      });
    });

    test('returns null for invalid token format', () => {
      const result = decodeToken('invalid-token');

      expect(result).toBeNull();
    });

    test('returns null for null token', () => {
      const result = decodeToken(null);

      expect(result).toBeNull();
    });

    test('returns null for undefined token', () => {
      const result = decodeToken(undefined);

      expect(result).toBeNull();
    });

    test('returns null for empty string token', () => {
      const result = decodeToken('');

      expect(result).toBeNull();
    });

    test('handles token with missing payload', () => {
      const incompleteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-signature';

      const result = decodeToken(incompleteToken);

      expect(result).toBeNull();
    });

    test('handles token with invalid base64 payload', () => {
      const invalidBase64Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid-base64.mock-signature';

      const result = decodeToken(invalidBase64Token);

      expect(result).toBeNull();
    });

    test('handles token with non-JSON payload', () => {
      const nonJsonPayload = btoa('not-json-payload');
      const invalidToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${nonJsonPayload}.mock-signature`;

      const result = decodeToken(invalidToken);

      expect(result).toBeNull();
    });
  });

  describe('integration tests', () => {
    test('complete user session lifecycle', () => {
      // Save user
      saveUserToStorage(mockUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(mockUser)
      );

      // Retrieve user
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
      const retrievedUser = getUserFromStorage();
      expect(retrievedUser).toEqual(mockUser);

      // Check token validity
      const mockDate = new Date('2021-10-20T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
      const isValid = isTokenValid(mockUser.token);
      expect(isValid).toBe(true);

      // Remove user
      removeUserFromStorage();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('alumni_user');
    });

    test('handles user data with all possible fields', () => {
      const completeUser = {
        username: 'testuser',
        token: mockUser.token,
        userId: 'USER_123',
        name: 'Test User',
        email: 'test@example.com',
        profession: 'Software Engineer',
        location: 'Dhaka, Bangladesh',
        bio: 'Test bio',
        phone: '+880-1234567890',
        linkedIn: 'https://linkedin.com/in/testuser',
        website: 'https://testuser.com',
        batch: '2018',
        facebook: 'https://facebook.com/testuser',
        connections: 25,
        role: 'USER',
        avatar: 'https://example.com/avatar.jpg',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      };

      saveUserToStorage(completeUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'alumni_user',
        JSON.stringify(completeUser)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(completeUser));
      const retrievedUser = getUserFromStorage();
      expect(retrievedUser).toEqual(completeUser);
    });
  });
}); 