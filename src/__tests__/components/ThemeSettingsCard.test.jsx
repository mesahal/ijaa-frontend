import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ThemeSettingsCard from '../../components/ThemeSettingsCard';

jest.mock('../../utils/themeApi', () => ({
  themeApi: {
    getAvailableThemes: jest.fn(),
    updateUserTheme: jest.fn(),
  },
  THEME_OPTIONS: { DARK: 'DARK', LIGHT: 'LIGHT', DEVICE: 'DEVICE' },
  isValidTheme: (t) => ['DARK','LIGHT','DEVICE'].includes(t),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'LIGHT', setTheme: jest.fn(), isLoading: false }),
}));

describe('ThemeSettingsCard', () => {
  const { themeApi } = require('../../utils/themeApi');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders theme selection card', () => {
    render(<ThemeSettingsCard />);
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme selection')).toBeInTheDocument();
  });

  test('loads themes from API', async () => {
    themeApi.getAvailableThemes.mockResolvedValue({ code: '200', data: ['LIGHT','DARK','DEVICE'] });
    render(<ThemeSettingsCard />);
    await waitFor(() => expect(themeApi.getAvailableThemes).toHaveBeenCalled());
  });

  test('uses fallback themes when API fails', async () => {
    themeApi.getAvailableThemes.mockRejectedValue(new Error('network'));
    render(<ThemeSettingsCard />);
    await waitFor(() => expect(themeApi.getAvailableThemes).toHaveBeenCalled());
    // Component should still render without crashing
    expect(screen.getByLabelText('Theme selection')).toBeInTheDocument();
  });
});