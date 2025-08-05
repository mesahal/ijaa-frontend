# Testing Guide - IIT JU Alumni Frontend

## 🧪 **Testing Overview**

This project implements comprehensive testing following industry standards to ensure code quality, reliability, and maintainability. The testing strategy covers unit tests, integration tests, and end-to-end testing patterns.

## 📋 **Testing Stack**

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for testing

## 🏗️ **Test Structure**

```
src/
├── __tests__/
│   ├── setup.js                    # Global test setup
│   ├── utils/
│   │   └── test-utils.jsx         # Common test utilities
│   ├── components/
│   │   └── Navbar.test.jsx        # Component tests
│   ├── pages/
│   │   └── Events.test.jsx        # Page tests
│   ├── context/
│   │   └── AuthContext.test.jsx   # Context tests
│   ├── integration/
│   │   └── App.test.jsx           # Integration tests
│   └── __mocks__/
│       └── fileMock.js            # File mocks
```

## 🚀 **Running Tests**

### **Basic Commands**

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- Navbar.test.jsx

# Run tests matching pattern
npm test -- --testNamePattern="Navbar"
```

### **Coverage Reports**

```bash
# Generate coverage report
npm run test:coverage

# Coverage thresholds
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%
```

## 📝 **Writing Tests**

### **Component Testing**

```javascript
import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interactions', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### **Context Testing**

```javascript
import React from 'react';
import { render, screen } from '../utils/test-utils';
import { MyContext, useMyContext } from '../../context/MyContext';

const TestComponent = () => {
  const { value } = useMyContext();
  return <div>{value}</div>;
};

describe('MyContext', () => {
  test('provides context value', () => {
    render(
      <MyContext>
        <TestComponent />
      </MyContext>
    );
    expect(screen.getByText('Expected Value')).toBeInTheDocument();
  });
});
```

### **API Testing**

```javascript
import { mockApiClient } from '../utils/test-utils';

describe('API Integration', () => {
  test('fetches data successfully', async () => {
    mockApiClient.get.mockResolvedValue({
      data: { success: true, data: [] }
    });
    
    // Test component that uses API
  });
});
```

## 🎯 **Testing Best Practices**

### **1. Test Organization**

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **Context Tests**: Test React Context providers
- **API Tests**: Test API integration and error handling

### **2. Test Naming**

```javascript
describe('ComponentName', () => {
  test('should render correctly', () => {});
  test('should handle user interaction', () => {});
  test('should display error state', () => {});
  test('should call API when submitted', () => {});
});
```

### **3. Test Structure (AAA Pattern)**

```javascript
test('should handle form submission', () => {
  // Arrange
  render(<FormComponent />);
  const submitButton = screen.getByRole('button');
  
  // Act
  fireEvent.click(submitButton);
  
  // Assert
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### **4. Mocking Strategy**

```javascript
// Mock external dependencies
jest.mock('../../utils/apiClient');

// Mock React hooks
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser })
}));

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

## 🔧 **Test Utilities**

### **Custom Render Function**

```javascript
// src/__tests__/utils/test-utils.jsx
const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });
```

### **Mock Data**

```javascript
export const mockUser = {
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token',
  userId: 'USER_123'
};
```

### **API Response Mocks**

```javascript
export const mockApiResponses = {
  events: {
    success: {
      message: "Events retrieved successfully",
      code: "200",
      data: [/* event data */]
    }
  }
};
```

## 📊 **Coverage Requirements**

### **Minimum Coverage Thresholds**

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Critical Paths to Test**

1. **Authentication Flow**
   - Login/Logout functionality
   - Session management
   - Error handling

2. **Events Management**
   - CRUD operations
   - Form validation
   - API integration

3. **Navigation**
   - Route protection
   - Page transitions
   - Error boundaries

4. **User Interactions**
   - Form submissions
   - Button clicks
   - Modal interactions

## 🚨 **Error Testing**

### **API Error Handling**

```javascript
test('handles API errors gracefully', async () => {
  mockApiClient.get.mockRejectedValue(new Error('Network error'));
  
  render(<Events />);
  
  await waitFor(() => {
    expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
  });
});
```

### **Form Validation**

```javascript
test('validates required fields', async () => {
  render(<EventForm />);
  
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  
  expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
});
```

## 🔍 **Accessibility Testing**

### **ARIA Labels**

```javascript
test('has proper accessibility attributes', () => {
  render(<MyComponent />);
  
  expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});
```

### **Keyboard Navigation**

```javascript
test('supports keyboard navigation', () => {
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  button.focus();
  
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(screen.getByText('Activated')).toBeInTheDocument();
});
```

## 🧪 **Integration Testing**

### **User Journey Tests**

```javascript
test('complete user registration flow', async () => {
  render(<App />);
  
  // Navigate to sign up
  fireEvent.click(screen.getByText(/join now/i));
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'newuser' }
  });
  
  // Submit form
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  
  // Verify success
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
```

## 📈 **Performance Testing**

### **Component Rendering**

```javascript
test('renders without performance issues', () => {
  const startTime = performance.now();
  
  render(<LargeComponent />);
  
  const endTime = performance.now();
  expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
});
```

## 🔄 **Continuous Integration**

### **CI/CD Pipeline**

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### **Pre-commit Hooks**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:coverage"
    }
  }
}
```

## 📚 **Additional Resources**

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 **Testing Checklist**

### **Before Committing**

- [ ] All tests pass
- [ ] Coverage meets thresholds
- [ ] New features have tests
- [ ] Error cases are tested
- [ ] Accessibility is verified
- [ ] Performance is acceptable

### **For New Features**

- [ ] Unit tests for components
- [ ] Integration tests for flows
- [ ] API integration tests
- [ ] Error handling tests
- [ ] Accessibility tests
- [ ] Performance tests (if applicable)

This comprehensive testing setup ensures the application maintains high quality standards and prevents regressions when implementing new features. 