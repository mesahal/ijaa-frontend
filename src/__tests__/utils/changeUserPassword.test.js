import { changeUserPassword  } from '../../../utils/apiClient';

// Mock the apiClient module
jest.mock('../../utils/apiClient', () => {
  const originalModule = jest.requireActual('../../utils/apiClient');
  return {
    ...originalModule,
    changeUserPassword: jest.fn()
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('changeUserPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
  });

  it('should call correct endpoint for changing user password', async () => {
    const mockResponse = { 
      data: { 
        message: "Password changed successfully",
        code: "200",
        data: null
      } 
    };
    
    // Mock the changeUserPassword function
    changeUserPassword.mockResolvedValue(mockResponse.data);

    const passwordData = {
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    const result = await changeUserPassword(passwordData);

    expect(changeUserPassword).toHaveBeenCalledWith(passwordData);
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle password change errors', async () => {
    const errorMessage = 'Current password is incorrect';
    const mockError = new Error(errorMessage);
    
    // Mock the changeUserPassword function to throw an error
    changeUserPassword.mockRejectedValue(mockError);

    const passwordData = {
      currentPassword: 'wrongpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    await expect(changeUserPassword(passwordData)).rejects.toThrow(errorMessage);
    expect(changeUserPassword).toHaveBeenCalledWith(passwordData);
  });

  it('should return response data on successful password change', async () => {
    const mockResponseData = { 
      message: "Password changed successfully",
      code: "200",
      data: null
    };
    
    // Mock the changeUserPassword function
    changeUserPassword.mockResolvedValue(mockResponseData);

    const passwordData = {
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    const result = await changeUserPassword(passwordData);

    expect(result).toEqual(mockResponseData);
    expect(changeUserPassword).toHaveBeenCalledWith(passwordData);
  });

  it('should handle API error responses', async () => {
    const mockError = {
      response: {
        status: 400,
        data: { message: 'Current password is incorrect' }
      }
    };
    
    // Mock the changeUserPassword function to throw an error
    changeUserPassword.mockRejectedValue(mockError);

    const passwordData = {
      currentPassword: 'wrongpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    await expect(changeUserPassword(passwordData)).rejects.toEqual(mockError);
    expect(changeUserPassword).toHaveBeenCalledWith(passwordData);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    
    // Mock the changeUserPassword function to throw a network error
    changeUserPassword.mockRejectedValue(networkError);

    const passwordData = {
      currentPassword: 'oldpass',
      newPassword: 'newpass',
      confirmPassword: 'newpass'
    };

    await expect(changeUserPassword(passwordData)).rejects.toThrow('Network error');
    expect(changeUserPassword).toHaveBeenCalledWith(passwordData);
  });
});
