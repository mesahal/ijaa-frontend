// Mock the UnifiedAuthContext first
const mockUser = {
  id: 'user1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'USER',
  token: 'mock-token'
};

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  loading: false,
  error: null
};

jest.mock('../../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => mockAuthContext,
  UnifiedAuthProvider: ({ children }) => children
}));

// Mock the eventService
jest.mock('../../../services/eventService');

import { renderHook, act } from '@testing-library/react';
import { useEventInteraction } from '../../../hooks/events/useEventInteraction';
import eventService from '../../../services/eventService';

describe('useEventInteraction', () => {
  const mockEventId = 123;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useEventInteraction(mockEventId));

      expect(result.current.comments).toEqual([]);
      expect(result.current.commentsLoading).toBe(false);
      expect(result.current.commentsError).toBeNull();
      expect(result.current.commentsPagination).toEqual({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false
      });
      expect(result.current.addCommentLoading).toBe(false);
      expect(result.current.updateCommentLoading).toBe(false);
      expect(result.current.deleteCommentLoading).toBe(false);
      expect(result.current.likeCommentLoading).toBe(false);
    });
  });

  describe('loadComments', () => {
    it('should load comments successfully', async () => {
      const mockComments = [
        { id: 1, content: 'Test comment 1', createdBy: 'user1' },
        { id: 2, content: 'Test comment 2', createdBy: 'user2' }
      ];
      
      eventService.getEventComments.mockResolvedValue({
        code: '200',
        data: mockComments,
        pagination: {
          currentPage: 0,
          totalPages: 1,
          totalElements: 2,
          hasNext: false,
          hasPrevious: false
        }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments();
      });

      expect(eventService.getEventComments).toHaveBeenCalledWith(mockEventId, 0, 10);
      expect(result.current.comments).toEqual(mockComments);
      expect(result.current.commentsLoading).toBe(false);
      expect(result.current.commentsError).toBeNull();
      expect(result.current.commentsPagination).toEqual({
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
        hasNext: false,
        hasPrevious: false
      });
    });

    it('should handle loading comments error', async () => {
      const errorMessage = 'Failed to load comments';
      eventService.getEventComments.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments();
      });

      expect(result.current.commentsError).toBe(errorMessage);
      expect(result.current.commentsLoading).toBe(false);
    });

    it('should load comments with custom page and size', async () => {
      eventService.getEventComments.mockResolvedValue({
        code: '200',
        data: [],
        pagination: { currentPage: 1, totalPages: 1, totalElements: 0, hasNext: false, hasPrevious: true }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments(1, 20);
      });

      expect(eventService.getEventComments).toHaveBeenCalledWith(mockEventId, 1, 20);
    });
  });

  describe('addComment', () => {
    it('should add comment successfully', async () => {
      const newComment = 'Test comment';
      const mockAddedComment = { id: 1, content: newComment, createdBy: 'user1' };
      
      eventService.addEventComment.mockResolvedValue({
        code: '201',
        data: mockAddedComment
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.addComment(newComment);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockAddedComment);
      });

      expect(eventService.addEventComment).toHaveBeenCalledWith(mockEventId, newComment, null);
      expect(result.current.addCommentLoading).toBe(false);
      expect(result.current.addCommentError).toBeNull();
    });

    it('should handle add comment error', async () => {
      const newComment = 'Test comment';
      const errorMessage = 'Failed to add comment';
      
      eventService.addEventComment.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.addComment(newComment);
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.addCommentError).toBe(errorMessage);
      expect(result.current.addCommentLoading).toBe(false);
    });

    it('should validate comment content', async () => {
      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.addComment('');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Comment content cannot be empty');
      });

      expect(eventService.addEventComment).not.toHaveBeenCalled();
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      const commentId = 1;
      const updatedContent = 'Updated comment';
      const mockUpdatedComment = { id: commentId, content: updatedContent, updatedAt: new Date().toISOString() };
      
      eventService.updateComment.mockResolvedValue({
        code: '200',
        data: mockUpdatedComment
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.updateComment(commentId, updatedContent);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockUpdatedComment);
      });

      expect(eventService.updateComment).toHaveBeenCalledWith(commentId, updatedContent);
      expect(result.current.updateCommentLoading).toBe(false);
      expect(result.current.updateCommentError).toBeNull();
    });

    it('should handle update comment error', async () => {
      const commentId = 1;
      const updatedContent = 'Updated comment';
      const errorMessage = 'Failed to update comment';
      
      eventService.updateComment.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.updateComment(commentId, updatedContent);
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.updateCommentError).toBe(errorMessage);
      expect(result.current.updateCommentLoading).toBe(false);
    });

    it('should validate update content', async () => {
      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.updateComment(1, '');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Comment content cannot be empty');
      });

      expect(eventService.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      const commentId = 1;
      
      eventService.deleteComment.mockResolvedValue({
        code: '200',
        data: { message: 'Comment deleted successfully' }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.deleteComment(commentId);
        expect(response.success).toBe(true);
      });

      expect(eventService.deleteComment).toHaveBeenCalledWith(commentId);
      expect(result.current.deleteCommentLoading).toBe(false);
      expect(result.current.deleteCommentError).toBeNull();
    });

    it('should handle delete comment error', async () => {
      const commentId = 1;
      const errorMessage = 'Failed to delete comment';
      
      eventService.deleteComment.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.deleteComment(commentId);
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.deleteCommentError).toBe(errorMessage);
      expect(result.current.deleteCommentLoading).toBe(false);
    });
  });

  describe('toggleCommentLike', () => {
    it('should toggle comment like successfully', async () => {
      const commentId = 1;
      const mockLikeResult = { isLiked: true, likeCount: 5 };
      
      eventService.toggleCommentLike.mockResolvedValue({
        code: '200',
        data: mockLikeResult
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.toggleCommentLike(commentId);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockLikeResult);
      });

      expect(eventService.toggleCommentLike).toHaveBeenCalledWith(commentId);
      expect(result.current.likeCommentLoading).toBe(false);
      expect(result.current.likeCommentError).toBeNull();
    });

    it('should handle toggle like error', async () => {
      const commentId = 1;
      const errorMessage = 'Failed to toggle like';
      
      eventService.toggleCommentLike.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        const response = await result.current.toggleCommentLike(commentId);
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.likeCommentError).toBe(errorMessage);
      expect(result.current.likeCommentLoading).toBe(false);
    });
  });

  describe('Pagination Methods', () => {
    it('should go to next page', async () => {
      // First call to set up initial pagination state
      eventService.getEventComments.mockResolvedValueOnce({
        code: '200',
        data: [],
        pagination: { currentPage: 0, totalPages: 2, totalElements: 0, hasNext: true, hasPrevious: false }
      });
      
      // Second call for the next page
      eventService.getEventComments.mockResolvedValueOnce({
        code: '200',
        data: [],
        pagination: { currentPage: 1, totalPages: 2, totalElements: 0, hasNext: false, hasPrevious: true }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments(0, 10);
      });

      // Wait for state to be updated
      await act(async () => {
        await result.current.goToNextPage();
      });

      expect(eventService.getEventComments).toHaveBeenCalledWith(mockEventId, 1, 10);
    });

    it('should go to previous page', async () => {
      // First call to set up initial pagination state
      eventService.getEventComments.mockResolvedValueOnce({
        code: '200',
        data: [],
        pagination: { currentPage: 1, totalPages: 2, totalElements: 0, hasNext: false, hasPrevious: true }
      });
      
      // Second call for the previous page
      eventService.getEventComments.mockResolvedValueOnce({
        code: '200',
        data: [],
        pagination: { currentPage: 0, totalPages: 2, totalElements: 0, hasNext: true, hasPrevious: false }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments(1, 10);
      });

      // Wait for state to be updated
      await act(async () => {
        await result.current.goToPreviousPage();
      });

      expect(eventService.getEventComments).toHaveBeenCalledWith(mockEventId, 0, 10);
    });

    it('should go to specific page', async () => {
      eventService.getEventComments.mockResolvedValue({
        code: '200',
        data: [],
        pagination: { currentPage: 2, totalPages: 3, totalElements: 0, hasNext: true, hasPrevious: true }
      });

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.goToPage(2);
      });

      expect(eventService.getEventComments).toHaveBeenCalledWith(mockEventId, 2, 10);
    });
  });

  describe('Error Clearing Methods', () => {
    it('should clear comments error', async () => {
      eventService.getEventComments.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.loadComments();
      });

      expect(result.current.commentsError).toBe('Test error');

      act(() => {
        result.current.clearCommentsError();
      });

      expect(result.current.commentsError).toBeNull();
    });

    it('should clear add comment error', async () => {
      eventService.addEventComment.mockRejectedValue(new Error('Add error'));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.addComment('test');
      });

      expect(result.current.addCommentError).toBe('Add error');

      act(() => {
        result.current.clearAddCommentError();
      });

      expect(result.current.addCommentError).toBeNull();
    });

    it('should clear update comment error', async () => {
      eventService.updateComment.mockRejectedValue(new Error('Update error'));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.updateComment(1, 'test');
      });

      expect(result.current.updateCommentError).toBe('Update error');

      act(() => {
        result.current.clearUpdateCommentError();
      });

      expect(result.current.updateCommentError).toBeNull();
    });

    it('should clear delete comment error', async () => {
      eventService.deleteComment.mockRejectedValue(new Error('Delete error'));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.deleteComment(1);
      });

      expect(result.current.deleteCommentError).toBe('Delete error');

      act(() => {
        result.current.clearDeleteCommentError();
      });

      expect(result.current.deleteCommentError).toBeNull();
    });

    it('should clear like comment error', async () => {
      eventService.toggleCommentLike.mockRejectedValue(new Error('Like error'));

      const { result } = renderHook(() => useEventInteraction(mockEventId));

      await act(async () => {
        await result.current.toggleCommentLike(1);
      });

      expect(result.current.likeCommentError).toBe('Like error');

      act(() => {
        result.current.clearLikeCommentError();
      });

      expect(result.current.likeCommentError).toBeNull();
    });
  });

  describe('Utility Methods', () => {
    it('should check if user can edit comment', () => {
      const { result } = renderHook(() => useEventInteraction(mockEventId));

      const comment = { createdBy: 'user1' };
      const currentUser = { id: 'user1' };

      expect(result.current.canEditComment(comment, currentUser)).toBe(true);
      expect(result.current.canEditComment(comment, { id: 'user2' })).toBe(false);
    });

    it('should check if user can delete comment', () => {
      const { result } = renderHook(() => useEventInteraction(mockEventId));

      const comment = { createdBy: 'user1' };
      const currentUser = { id: 'user1', role: 'USER' };
      const adminUser = { id: 'user2', role: 'ADMIN' };

      expect(result.current.canDeleteComment(comment, currentUser)).toBe(true);
      expect(result.current.canDeleteComment(comment, adminUser)).toBe(true);
      expect(result.current.canDeleteComment(comment, { id: 'user3', role: 'USER' })).toBe(false);
    });
  });
});
