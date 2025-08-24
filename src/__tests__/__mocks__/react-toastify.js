// Mock for react-toastify
export const toast = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  dismiss: jest.fn(),
  isActive: jest.fn(),
  update: jest.fn(),
  done: jest.fn(),
  onChange: jest.fn(),
  configure: jest.fn(),
  POSITION: {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    TOP_CENTER: 'top-center',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center'
  },
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
};

export const ToastContainer = () => null;
