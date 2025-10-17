# Event Comments API Documentation

## Overview
This document provides comprehensive API documentation for the Event Comments functionality, designed for frontend integration. The API supports threaded comments, likes, and various comment retrieval methods.

## Base Information
- **Base URL**: `http://localhost:8082/api/v1/events/comments`
- **Authentication**: Bearer Token (JWT) required for all endpoints
- **Content-Type**: `application/json`
- **Required Role**: USER
- **Required Feature**: `events.comments`

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### EventCommentRequest
```json
{
  "postId": 1,                    // Required: ID of the post to comment on
  "content": "This is a comment", // Required: Comment text (1-1000 characters)
  "parentCommentId": null         // Optional: For replies, null for top-level comments
}
```

### EventCommentResponse
```json
{
  "id": 1,                        // Comment ID
  "postId": 1,                    // Post ID
  "username": "john.doe",         // Commenter's username
  "authorName": "John Doe",       // Commenter's full name
  "content": "This is a comment", // Comment content
  "isEdited": false,              // Whether comment was edited
  "isDeleted": false,             // Whether comment was deleted
  "parentCommentId": null,        // Parent comment ID (null for top-level)
  "likes": 5,                     // Number of likes
  "replyCount": 2,                // Number of replies
  "isLikedByCurrentUser": false,  // Whether current user liked this comment
  "createdAt": "2024-12-01T10:00:00", // Creation timestamp
  "updatedAt": "2024-12-01T10:00:00", // Last update timestamp
  "replies": []                   // Array of reply comments (for threaded display)
}
```

### ApiResponse Wrapper
All responses are wrapped in a standard format:
```json
{
  "message": "Success message",
  "code": "200",
  "data": { /* actual response data */ }
}
```

## API Endpoints

### 1. Create Comment
**POST** `/api/v1/events/comments`

Creates a new comment on a post or replies to an existing comment.

#### Request Body
```json
{
  "postId": 1,
  "content": "This event looks amazing! Looking forward to attending.",
  "parentCommentId": null
}
```

#### Response Examples

**Success (201)**
```json
{
  "message": "Comment created successfully",
  "code": "201",
  "data": {
    "id": 1,
    "postId": 1,
    "username": "john.doe",
    "authorName": "John Doe",
    "content": "This event looks amazing! Looking forward to attending.",
    "isEdited": false,
    "isDeleted": false,
    "parentCommentId": null,
    "likes": 0,
    "replyCount": 0,
    "isLikedByCurrentUser": false,
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00",
    "replies": []
  }
}
```

**Error (400)**
```json
{
  "message": "Invalid comment data provided",
  "code": "400",
  "data": null
}
```

**Error (404)**
```json
{
  "message": "Event not found",
  "code": "404",
  "data": null
}
```

### 2. Get Post Comments
**GET** `/api/v1/events/comments/post/{postId}`

Retrieves all comments for a specific post with threaded replies.

#### Path Parameters
- `postId` (Long, required): ID of the post

#### Response Example
```json
{
  "message": "Post comments retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "username": "john.doe",
      "authorName": "John Doe",
      "content": "Great event!",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 5,
      "replyCount": 2,
      "isLikedByCurrentUser": true,
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00",
      "replies": [
        {
          "id": 2,
          "postId": 1,
          "username": "jane.smith",
          "authorName": "Jane Smith",
          "content": "I agree!",
          "isEdited": false,
          "isDeleted": false,
          "parentCommentId": 1,
          "likes": 2,
          "replyCount": 0,
          "isLikedByCurrentUser": false,
          "createdAt": "2024-12-01T10:05:00",
          "updatedAt": "2024-12-01T10:05:00",
          "replies": []
        }
      ]
    }
  ]
}
```

### 3. Get Comment by ID
**GET** `/api/v1/events/comments/{commentId}`

Retrieves a specific comment by its ID.

#### Path Parameters
- `commentId` (Long, required): ID of the comment

#### Response Example
```json
{
  "message": "Comment retrieved successfully",
  "code": "200",
  "data": {
    "id": 1,
    "postId": 1,
    "username": "john.doe",
    "authorName": "John Doe",
    "content": "Great event!",
    "isEdited": false,
    "isDeleted": false,
    "parentCommentId": null,
    "likes": 5,
    "replyCount": 2,
    "isLikedByCurrentUser": true,
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00",
    "replies": []
  }
}
```

### 4. Update Comment
**PUT** `/api/v1/events/comments/{commentId}`

Updates an existing comment. Only the comment author can update their comment.

#### Path Parameters
- `commentId` (Long, required): ID of the comment to update

#### Request Body
```json
{
  "postId": 1,
  "content": "Updated comment content",
  "parentCommentId": null
}
```

#### Response Examples

**Success (200)**
```json
{
  "message": "Comment updated successfully",
  "code": "200",
  "data": {
    "id": 1,
    "postId": 1,
    "username": "john.doe",
    "authorName": "John Doe",
    "content": "Updated comment content",
    "isEdited": true,
    "isDeleted": false,
    "parentCommentId": null,
    "likes": 5,
    "replyCount": 2,
    "isLikedByCurrentUser": true,
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:15:00",
    "replies": []
  }
}
```

**Error (403)**
```json
{
  "message": "You can only update your own comments",
  "code": "403",
  "data": null
}
```

### 5. Delete Comment
**DELETE** `/api/v1/events/comments/{commentId}`

Deletes a comment. Only the comment author or event organizer can delete comments.

#### Path Parameters
- `commentId` (Long, required): ID of the comment to delete

#### Response Examples

**Success (200)**
```json
{
  "message": "Comment deleted successfully",
  "code": "200",
  "data": null
}
```

**Error (403)**
```json
{
  "message": "You don't have permission to delete this comment",
  "code": "403",
  "data": null
}
```

### 6. Like/Unlike Comment
**POST** `/api/v1/events/comments/{commentId}/like`

Toggles the like status for a comment.

#### Path Parameters
- `commentId` (Long, required): ID of the comment to like/unlike

#### Response Example
```json
{
  "message": "Comment like status updated successfully",
  "code": "200",
  "data": {
    "id": 1,
    "postId": 1,
    "username": "john.doe",
    "authorName": "John Doe",
    "content": "Great event!",
    "isEdited": false,
    "isDeleted": false,
    "parentCommentId": null,
    "likes": 6,
    "replyCount": 2,
    "isLikedByCurrentUser": true,
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00",
    "replies": []
  }
}
```

### 7. Get Recent Comments
**GET** `/api/v1/events/comments/recent/post/{postId}`

Retrieves the most recent comments for a specific post (default: 10 comments).

#### Path Parameters
- `postId` (Long, required): ID of the post

#### Response Example
```json
{
  "message": "Recent comments retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 3,
      "postId": 1,
      "username": "alice.wilson",
      "authorName": "Alice Wilson",
      "content": "Just saw this, looks interesting!",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 1,
      "replyCount": 0,
      "isLikedByCurrentUser": false,
      "createdAt": "2024-12-01T11:00:00",
      "updatedAt": "2024-12-01T11:00:00",
      "replies": []
    }
  ]
}
```

### 8. Get Popular Comments
**GET** `/api/v1/events/comments/popular/post/{postId}`

Retrieves the most popular comments (most liked) for a specific post (default: 10 comments).

#### Path Parameters
- `postId` (Long, required): ID of the post

#### Response Example
```json
{
  "message": "Popular comments retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "username": "john.doe",
      "authorName": "John Doe",
      "content": "Great event!",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 15,
      "replyCount": 2,
      "isLikedByCurrentUser": true,
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00",
      "replies": []
    }
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |

## Frontend Integration Examples

### JavaScript/TypeScript Example

```typescript
// API Configuration
const API_BASE = 'http://localhost:8082/api/v1/events/comments';

// Helper function to make authenticated requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('jwt_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  return response.json();
}

// Create a comment
async function createComment(postId: number, content: string, parentCommentId?: number) {
  return apiRequest('', {
    method: 'POST',
    body: JSON.stringify({
      postId,
      content,
      parentCommentId: parentCommentId || null
    })
  });
}

// Get post comments
async function getPostComments(postId: number) {
  return apiRequest(`/post/${postId}`);
}

// Like/unlike a comment
async function toggleCommentLike(commentId: number) {
  return apiRequest(`/${commentId}/like`, {
    method: 'POST'
  });
}

// Update a comment
async function updateComment(commentId: number, content: string, postId: number) {
  return apiRequest(`/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({
      postId,
      content,
      parentCommentId: null
    })
  });
}

// Delete a comment
async function deleteComment(commentId: number) {
  return apiRequest(`/${commentId}`, {
    method: 'DELETE'
  });
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  postId: number;
  username: string;
  authorName: string;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  parentCommentId: number | null;
  likes: number;
  replyCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPostComments(postId);
      if (response.code === '200') {
        setComments(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, parentCommentId?: number) => {
    try {
      const response = await createComment(postId, content, parentCommentId);
      if (response.code === '201') {
        await fetchComments(); // Refresh comments
        return response.data;
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const toggleLike = async (commentId: number) => {
    try {
      const response = await toggleCommentLike(commentId);
      if (response.code === '200') {
        // Update the specific comment in the state
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, ...response.data }
              : comment
          )
        );
      }
    } catch (err) {
      setError('Failed to toggle like');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    loading,
    error,
    addComment,
    toggleLike,
    refetch: fetchComments
  };
}
```

## Notes for Frontend Developers

1. **Threaded Comments**: The API returns comments with nested replies in the `replies` array. You can build a threaded UI by recursively rendering these nested structures.

2. **Real-time Updates**: Consider implementing WebSocket connections or polling for real-time comment updates.

3. **Pagination**: The recent and popular comment endpoints return limited results. For full pagination, you may need to implement additional logic or request modifications.

4. **Error Handling**: Always check the `code` field in responses to determine success/failure status.

5. **Authentication**: Ensure the JWT token is included in all requests and handle token expiration gracefully.

6. **Optimistic Updates**: For better UX, consider implementing optimistic updates for likes and comment creation.

7. **Content Validation**: The API validates comment content length (1-1000 characters). Implement client-side validation for better user experience.

8. **Permissions**: Users can only edit/delete their own comments, except event organizers who can delete any comment.

## Testing

You can test the API using the Swagger UI at:
`http://localhost:8082/swagger-ui.html`

Or use tools like Postman with the provided examples above.
