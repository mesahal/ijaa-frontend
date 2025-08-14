import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchModal from '../../../components/events/SearchModal';

describe('SearchModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    formData: {
      location: '',
      eventType: '',
      startDate: '',
      endDate: '',
      isOnline: '',
      organizerName: '',
      title: '',
      description: ''
    },
    setFormData: jest.fn(),
    loading: false,
    eventTypeOptions: [
      { value: 'MEETING', label: 'Meeting' },
      { value: 'WORKSHOP', label: 'Workshop' },
      { value: 'CONFERENCE', label: 'Conference' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group 3: Event Search and Discovery', () => {
    describe('Rendering', () => {
      it('should render when isOpen is true', () => {
        render(<SearchModal {...defaultProps} />);
        
        expect(screen.getByText('Advanced Event Search')).toBeInTheDocument();
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/online status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/organizer name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      });

      it('should not render when isOpen is false', () => {
        render(<SearchModal {...defaultProps} isOpen={false} />);
        
        expect(screen.queryByText('Advanced Event Search')).not.toBeInTheDocument();
      });

      it('should display all search form fields', () => {
        render(<SearchModal {...defaultProps} />);
        
        // Check all form fields are present
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/online status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/organizer name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      });

      it('should display event type options', () => {
        render(<SearchModal {...defaultProps} />);
        
        const eventTypeSelect = screen.getByLabelText(/event type/i);
        expect(eventTypeSelect).toBeInTheDocument();
        
        // Check options are rendered
        expect(screen.getByText('All Types')).toBeInTheDocument();
        expect(screen.getByText('Meeting')).toBeInTheDocument();
        expect(screen.getByText('Workshop')).toBeInTheDocument();
        expect(screen.getByText('Conference')).toBeInTheDocument();
      });
    });

    describe('Form interactions', () => {
      it('should handle location input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const locationInput = screen.getByLabelText(/location/i);
        fireEvent.change(locationInput, { target: { value: 'IIT Campus' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: 'IIT Campus',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        });
      });

      it('should handle event type selection', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const eventTypeSelect = screen.getByLabelText(/event type/i);
        fireEvent.change(eventTypeSelect, { target: { value: 'MEETING' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: 'MEETING',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        });
      });

      it('should handle start date input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const startDateInput = screen.getByLabelText(/start date/i);
        fireEvent.change(startDateInput, { target: { value: '2024-12-01' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '2024-12-01',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        });
      });

      it('should handle end date input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const endDateInput = screen.getByLabelText(/end date/i);
        fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '2024-12-31',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        });
      });

      it('should handle online status selection', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const onlineStatusSelect = screen.getByLabelText(/online status/i);
        fireEvent.change(onlineStatusSelect, { target: { value: 'true' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: 'true',
          organizerName: '',
          title: '',
          description: ''
        });
      });

      it('should handle organizer name input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const organizerInput = screen.getByLabelText(/organizer name/i);
        fireEvent.change(organizerInput, { target: { value: 'John Doe' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: 'John Doe',
          title: '',
          description: ''
        });
      });

      it('should handle title input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const titleInput = screen.getByLabelText(/title/i);
        fireEvent.change(titleInput, { target: { value: 'Alumni Meet' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: 'Alumni Meet',
          description: ''
        });
      });

      it('should handle description input changes', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: 'Annual gathering' } });
        
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
        // Test the function call
        const updateFunction = setFormData.mock.calls[0][0];
        const result = updateFunction({ location: '', eventType: '', startDate: '', endDate: '', isOnline: '', organizerName: '', title: '', description: '' });
        expect(result).toEqual({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: 'Annual gathering'
        });
      });
    });

    describe('Form submission', () => {
      it('should handle form submission', async () => {
        const onSubmit = jest.fn();
        
        render(<SearchModal {...defaultProps} onSubmit={onSubmit} />);
        
        const searchButton = screen.getByRole('button', { name: /search events/i });
        fireEvent.click(searchButton);
        
        expect(onSubmit).toHaveBeenCalled();
      });

      it('should prevent default form submission', async () => {
        const onSubmit = jest.fn((e) => {
          expect(e.defaultPrevented).toBe(true);
        });
        
        render(<SearchModal {...defaultProps} onSubmit={onSubmit} />);
        
        const searchButton = screen.getByRole('button', { name: /search events/i });
        fireEvent.click(searchButton);
        
        expect(onSubmit).toHaveBeenCalled();
      });

      it('should disable search button when loading', () => {
        render(<SearchModal {...defaultProps} loading={true} />);
        
        const searchButton = screen.getByRole('button', { name: /search events/i });
        expect(searchButton).toBeDisabled();
      });

      it('should show loading spinner when loading', () => {
        render(<SearchModal {...defaultProps} loading={true} />);
        
        expect(screen.getByRole('button', { name: /search events/i })).toBeDisabled();
        // Check for loading spinner (Loader2 icon)
        expect(screen.getByRole('button', { name: /search events/i }).querySelector('.animate-spin')).toBeInTheDocument();
      });
    });

    describe('Form clearing', () => {
      it('should clear form when clear button is clicked', async () => {
        const setFormData = jest.fn();
        
        render(<SearchModal {...defaultProps} setFormData={setFormData} />);
        
        const clearButton = screen.getByRole('button', { name: /clear form/i });
        fireEvent.click(clearButton);
        
        expect(setFormData).toHaveBeenCalledWith({
          location: '',
          eventType: '',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        });
      });
    });

    describe('Modal interactions', () => {
      it('should call onClose when close button is clicked', async () => {
        const onClose = jest.fn();
        
        render(<SearchModal {...defaultProps} onClose={onClose} />);
        
        const closeButton = screen.getByRole('button', { name: /close modal/i });
        fireEvent.click(closeButton);
        
        expect(onClose).toHaveBeenCalled();
      });

      it('should call onClose when cancel button is clicked', async () => {
        const onClose = jest.fn();
        
        render(<SearchModal {...defaultProps} onClose={onClose} />);
        
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);
        
        expect(onClose).toHaveBeenCalled();
      });
    });

    describe('Accessibility', () => {
      it('should have proper ARIA labels', () => {
        render(<SearchModal {...defaultProps} />);
        
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/event type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/online status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/organizer name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      });

      it('should have proper button roles', () => {
        render(<SearchModal {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /clear form/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search events/i })).toBeInTheDocument();
      });
    });

    describe('Form validation', () => {
      it('should handle empty form submission', async () => {
        const onSubmit = jest.fn();
        
        render(<SearchModal {...defaultProps} onSubmit={onSubmit} />);
        
        const searchButton = screen.getByRole('button', { name: /search events/i });
        fireEvent.click(searchButton);
        
        expect(onSubmit).toHaveBeenCalled();
      });

      it('should handle form with partial data', async () => {
        const onSubmit = jest.fn();
        const formDataWithPartialData = {
          location: 'IIT Campus',
          eventType: 'MEETING',
          startDate: '',
          endDate: '',
          isOnline: '',
          organizerName: '',
          title: '',
          description: ''
        };
        
        render(<SearchModal {...defaultProps} onSubmit={onSubmit} formData={formDataWithPartialData} />);
        
        const searchButton = screen.getByRole('button', { name: /search events/i });
        fireEvent.click(searchButton);
        
        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });
});
