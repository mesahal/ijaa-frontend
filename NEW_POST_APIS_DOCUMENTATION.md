# IJAA Post Feature - New APIs Documentation

## Overview
This document outlines the new APIs for the post feature in the IJAA (IIT JU Alumni Association) system. The post feature allows event creators to create discussion posts within their events, with support for **simultaneous text, images, and videos**. Comments are now associated with posts rather than directly with events.

**Key Features:**
- **Mixed Content Posts**: Posts can contain text, multiple images, and multiple videos simultaneously
- **Media Ordering**: Media files are properly ordered and displayed in sequence
- **Real-time Integration**: Media files are automatically included in post responses
- **Public Media Access**: Media files can be accessed without authentication for display

## Access Control
- **Event Posts**: Only the event creator can create, update, and delete posts on their events
- **Comments**: Any authenticated user can comment on any post
- **Post Viewing**: Any authenticated user can view posts and comments

## Base URLs
- **Event Service**: `http://localhost:8082`
- **File Service**: `http://localhost:8083`
- **Gateway Service**: `http://localhost:8000` (recommended for frontend)

## Authentication
All APIs require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

**Important:** Some endpoints (like media upload) also require the `X-Username` header:
```
X-Username: <username>
```

The username is typically extracted from the JWT token, but some file operations require it explicitly.

## Feature Flags
The following feature flags control access to post functionality:
- `events.posts` - Main post feature flag
- `events.posts.create` - Create posts
- `events.posts.update` - Update posts
- `events.posts.delete` - Delete posts
- `events.posts.like` - Like posts
- `events.posts.media` - Upload media for posts
- `events.comments` - Comment functionality (now post-based)

---

## 1. Event Posts APIs

### 1.1 Create a Post
**POST** `/ijaa/api/v1/events/posts`

Create a new post in an event's discussion section. **Only the event creator can create posts on their events.** This endpoint accepts both text content and media files simultaneously.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Form Parameters:**
- `eventId` (required): The ID of the event to post in
- `content` (optional): Text content of the post
- `files` (optional): Media files to attach (images and/or videos)

**Note:** At least one of `content` or `files` must be provided.

**Example with text only:**
```
POST /ijaa/api/v1/events/posts
Content-Type: multipart/form-data

eventId: 123
content: "This is an amazing event! Looking forward to meeting everyone."
```

**Example with text and media:**
```
POST /ijaa/api/v1/events/posts
Content-Type: multipart/form-data

eventId: 123
content: "Check out these amazing photos from the event!"
files: [image1.jpg, image2.jpg, video1.mp4]
```

**Response (201 Created):**
```json
{
  "id": 456,
  "eventId": 123,
  "username": "john_doe",
  "userId": "123",
  "content": "This is an amazing event! Looking forward to meeting everyone.",
  "postType": "TEXT",
  "isEdited": false,
  "isDeleted": false,
  "likes": 0,
  "commentsCount": 0,
  "createdAt": "2025-01-04T08:30:00Z",
  "updatedAt": "2025-01-04T08:30:00Z",
  "mediaFiles": [],
  "isLikedByUser": false,
  "recentComments": [],
  "creatorName": "John Doe"
}
```

### 1.2 Get Event Posts (Paginated)
**GET** `/ijaa/api/v1/events/posts/event/{eventId}`

Get all posts for a specific event with pagination.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Example:**
```
GET /ijaa/api/v1/events/posts/event/123?page=0&size=10
```

### 1.3 Get All Event Posts (Non-Paginated)
**GET** `/ijaa/api/v1/events/posts/event/{eventId}/all`

Get all posts for a specific event without pagination.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Example:**
```
GET /ijaa/api/v1/events/posts/event/123/all
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 456,
      "eventId": 123,
      "username": "john_doe",
      "userId": "123",
      "content": "This is an amazing event!",
      "postType": "MIXED",
      "isEdited": false,
      "isDeleted": false,
      "likes": 5,
      "commentsCount": 3,
      "createdAt": "2025-01-04T08:30:00Z",
      "updatedAt": "2025-01-04T08:30:00Z",
      "mediaFiles": [
        {
          "id": 1,
          "fileName": "event_photo_1234567890.jpg",
          "fileUrl": "/ijaa/api/v1/files/posts/456/media/event_photo_1234567890.jpg",
          "fileType": "image/jpeg",
          "mediaType": "IMAGE",
          "fileSize": 2048576,
          "fileOrder": 0,
          "createdAt": "2025-01-04T08:30:00Z"
        },
        {
          "id": 2,
          "fileName": "event_video_1234567890.mp4",
          "fileUrl": "/ijaa/api/v1/files/posts/456/media/event_video_1234567890.mp4",
          "fileType": "video/mp4",
          "mediaType": "VIDEO",
          "fileSize": 10485760,
          "fileOrder": 1,
          "createdAt": "2025-01-04T08:30:00Z"
        }
      ],
      "isLikedByUser": true,
      "recentComments": [],
      "creatorName": "John Doe"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### 1.4 Get Single Post
**GET** `/ijaa/api/v1/events/posts/{postId}`

Get details of a specific post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 456,
  "eventId": 123,
  "username": "john_doe",
  "userId": "123",
  "content": "This is an amazing event!",
  "postType": "MIXED",
  "isEdited": false,
  "isDeleted": false,
  "likes": 5,
  "commentsCount": 3,
  "createdAt": "2025-01-04T08:30:00Z",
  "updatedAt": "2025-01-04T08:30:00Z",
  "mediaFiles": [
    {
      "id": 1,
      "fileName": "event_photo_1234567890.jpg",
      "fileUrl": "/ijaa/api/v1/files/posts/456/media/event_photo_1234567890.jpg",
      "fileType": "image/jpeg",
      "mediaType": "IMAGE",
      "fileSize": 2048576,
      "fileOrder": 0,
      "createdAt": "2025-01-04T08:30:00Z"
    },
    {
      "id": 2,
      "fileName": "event_video_1234567890.mp4",
      "fileUrl": "/ijaa/api/v1/files/posts/456/media/event_video_1234567890.mp4",
      "fileType": "video/mp4",
      "mediaType": "VIDEO",
      "fileSize": 10485760,
      "fileOrder": 1,
      "createdAt": "2025-01-04T08:30:00Z"
    }
  ],
  "isLikedByUser": true,
  "recentComments": [],
  "creatorName": "John Doe"
}
```

### 1.5 Update Post
**PUT** `/ijaa/api/v1/events/posts/{postId}`

Update the content of a post (only by the author).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated post content here"
}
```

**Response (200 OK):**
```json
{
  "id": 456,
  "eventId": 123,
  "username": "john_doe",
  "content": "Updated post content here",
  "postType": "MIXED",
  "isEdited": true,
  "isDeleted": false,
  "likes": 5,
  "commentsCount": 3,
  "createdAt": "2025-01-04T08:30:00Z",
  "updatedAt": "2025-01-04T09:15:00Z",
  "isLikedByUser": true,
  "mediaFiles": [
    {
      "id": 1,
      "fileName": "event_photo_1234567890.jpg",
      "fileUrl": "/ijaa/api/v1/files/posts/456/media/file/event_photo_1234567890.jpg",
      "fileType": "image/jpeg",
      "mediaType": "IMAGE",
      "fileSize": 2048576,
      "fileOrder": 0,
      "createdAt": "2025-01-04T08:30:00Z"
    }
  ],
  "recentComments": []
}
```

### 1.6 Delete Post
**DELETE** `/ijaa/api/v1/events/posts/{postId}`

Delete a post (only by the author).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Post deleted successfully",
  "status": "200",
  "data": null
}
```

### 1.7 Like/Unlike Post
**POST** `/ijaa/api/v1/events/posts/{postId}/like`

Toggle like status for a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 456,
  "eventId": 123,
  "username": "john_doe",
  "content": "This is an amazing event!",
  "postType": "MIXED",
  "isEdited": false,
  "isDeleted": false,
  "likes": 6,
  "commentsCount": 3,
  "createdAt": "2025-01-04T08:30:00Z",
  "updatedAt": "2025-01-04T08:30:00Z",
  "isLikedByUser": true,
  "mediaFiles": [
    {
      "id": 1,
      "fileName": "event_photo_1234567890.jpg",
      "fileUrl": "/ijaa/api/v1/files/posts/456/media/file/event_photo_1234567890.jpg",
      "fileType": "image/jpeg",
      "mediaType": "IMAGE",
      "fileSize": 2048576,
      "fileOrder": 0,
      "createdAt": "2025-01-04T08:30:00Z"
    }
  ],
  "recentComments": []
}
```

### 1.8 Get User's Posts
**GET** `/ijaa/api/v1/events/posts/user/{username}`

Get paginated posts created by a specific user across all events.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Example:**
```
GET /ijaa/api/v1/events/posts/user/john_doe?page=0&size=10
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 456,
      "eventId": 123,
      "username": "john_doe",
      "content": "This is an amazing event!",
      "isEdited": false,
      "isDeleted": false,
      "likes": 5,
      "commentsCount": 3,
      "createdAt": "2025-01-04T08:30:00Z",
      "updatedAt": "2025-01-04T08:30:00Z",
      "isLikedByUser": true,
      "mediaFiles": [],
      "recentComments": []
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### 1.9 Get User's Posts for Specific Event
**GET** `/ijaa/api/v1/events/posts/user/{username}/event/{eventId}`

Get paginated posts created by a specific user for a specific event.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Example:**
```
GET /ijaa/api/v1/events/posts/user/john_doe/event/123?page=0&size=10
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 456,
      "eventId": 123,
      "username": "john_doe",
      "content": "This is an amazing event!",
      "isEdited": false,
      "isDeleted": false,
      "likes": 5,
      "commentsCount": 3,
      "createdAt": "2025-01-04T08:30:00Z",
      "updatedAt": "2025-01-04T08:30:00Z",
      "isLikedByUser": true,
      "mediaFiles": [],
      "recentComments": []
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

---

## 2. Post Comments APIs

### 2.1 Create Comment
**POST** `/ijaa/api/v1/events/comments/`

Create a new comment on a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "postId": 456,
  "content": "Great post! I totally agree.",
  "parentCommentId": null
}
```

**For replies, include parentCommentId:**
```json
{
  "postId": 456,
  "content": "Thanks for the reply!",
  "parentCommentId": 789
}
```

**Response (201 Created):**
```json
{
  "message": "Comment created successfully",
  "code": "201",
  "data": {
    "id": 789,
    "postId": 456,
    "username": "jane_smith",
    "authorName": "Jane Smith",
    "content": "Great post! I totally agree.",
    "isEdited": false,
    "isDeleted": false,
    "parentCommentId": null,
    "likesCount": 0,
    "repliesCount": 0,
    "isLikedByUser": false,
    "createdAt": "2025-01-04T09:00:00Z",
    "updatedAt": "2025-01-04T09:00:00Z"
  }
}
```

### 2.2 Get Post Comments
**GET** `/ijaa/api/v1/events/comments/post/{postId}`

Get all comments for a specific post with nested replies.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Post comments retrieved successfully",
  "status": "200",
  "data": [
    {
      "id": 789,
      "postId": 456,
      "username": "jane_smith",
      "authorName": "Jane Smith",
      "content": "Great post! I totally agree.",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 2,
      "replyCount": 1,
      "isLikedByCurrentUser": true,
      "createdAt": "2025-01-04T09:00:00Z",
      "updatedAt": "2025-01-04T09:00:00Z",
      "replies": [
        {
          "id": 790,
          "postId": 456,
          "username": "john_doe",
          "authorName": "John Doe",
          "content": "Thanks for the reply!",
          "isEdited": false,
          "isDeleted": false,
          "parentCommentId": 789,
          "likes": 0,
          "replyCount": 0,
          "isLikedByCurrentUser": false,
          "createdAt": "2025-01-04T09:15:00Z",
          "updatedAt": "2025-01-04T09:15:00Z",
          "replies": null
        }
      ]
    }
  ]
}
```

### 2.3 Get Single Comment
**GET** `/ijaa/api/v1/events/comments/{commentId}`

Get details of a specific comment.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 789,
  "postId": 456,
  "username": "jane_smith",
  "authorName": "Jane Smith",
  "content": "Great post! I totally agree.",
  "isEdited": false,
  "isDeleted": false,
  "parentCommentId": null,
  "likes": 2,
  "replyCount": 1,
  "isLikedByCurrentUser": true,
  "createdAt": "2025-01-04T09:00:00Z",
  "updatedAt": "2025-01-04T09:00:00Z",
  "replies": null
}
```

### 2.4 Update Comment
**PUT** `/ijaa/api/v1/events/comments/{commentId}`

Update a comment (only by the author).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response (200 OK):**
```json
{
  "id": 789,
  "postId": 456,
  "username": "jane_smith",
  "authorName": "Jane Smith",
  "content": "Updated comment content",
  "isEdited": true,
  "isDeleted": false,
  "parentCommentId": null,
  "likes": 2,
  "replyCount": 1,
  "isLikedByCurrentUser": true,
  "createdAt": "2025-01-04T09:00:00Z",
  "updatedAt": "2025-01-04T09:30:00Z",
  "replies": null
}
```

### 2.5 Delete Comment
**DELETE** `/ijaa/api/v1/events/comments/{commentId}`

Delete a comment (only by the author).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Comment deleted successfully",
  "status": "200",
  "data": null
}
```

### 2.6 Like/Unlike Comment
**POST** `/ijaa/api/v1/events/comments/{commentId}/like`

Toggle like status for a comment.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 789,
  "postId": 456,
  "username": "jane_smith",
  "authorName": "Jane Smith",
  "content": "Great post! I totally agree.",
  "isEdited": false,
  "isDeleted": false,
  "parentCommentId": null,
  "likes": 3,
  "replyCount": 1,
  "isLikedByCurrentUser": true,
  "createdAt": "2025-01-04T09:00:00Z",
  "updatedAt": "2025-01-04T09:00:00Z",
  "replies": null
}
```

### 2.7 Get Recent Comments for Post
**GET** `/ijaa/api/v1/events/comments/recent/post/{postId}`

Get recent comments for a specific post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Recent comments retrieved successfully",
  "status": "200",
  "data": [
    {
      "id": 789,
      "postId": 456,
      "username": "jane_smith",
      "authorName": "Jane Smith",
      "content": "Great post! I totally agree.",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 2,
      "replyCount": 1,
      "isLikedByCurrentUser": true,
      "createdAt": "2025-01-04T09:00:00Z",
      "updatedAt": "2025-01-04T09:00:00Z",
      "replies": null
    }
  ]
}
```

### 2.8 Get Popular Comments for Post
**GET** `/ijaa/api/v1/events/comments/popular/post/{postId}`

Get popular comments (most liked) for a specific post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Popular comments retrieved successfully",
  "status": "200",
  "data": [
    {
      "id": 789,
      "postId": 456,
      "username": "jane_smith",
      "authorName": "Jane Smith",
      "content": "Great post! I totally agree.",
      "isEdited": false,
      "isDeleted": false,
      "parentCommentId": null,
      "likes": 10,
      "replyCount": 1,
      "isLikedByCurrentUser": true,
      "createdAt": "2025-01-04T09:00:00Z",
      "updatedAt": "2025-01-04T09:00:00Z",
      "replies": null
    }
  ]
}
```

---

## 3. Post Media APIs

### 3.1 Get All Post Media
**GET** `/ijaa/api/v1/files/posts/{postId}/media`

Get all media files for a specific post (public endpoint, no authentication required).

**Example:**
```
GET /ijaa/api/v1/files/posts/456/media
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "fileName": "event_photo_1234567890.jpg",
    "fileUrl": "/ijaa/api/v1/files/posts/456/media/file/event_photo_1234567890.jpg",
    "fileType": "image/jpeg",
    "mediaType": "IMAGE",
    "fileSize": 2048576,
    "fileOrder": 0,
    "createdAt": "2025-01-04T08:30:00Z"
  },
  {
    "id": 2,
    "fileName": "event_video_1234567890.mp4",
    "fileUrl": "/ijaa/api/v1/files/posts/456/media/file/event_video_1234567890.mp4",
    "fileType": "video/mp4",
    "mediaType": "VIDEO",
    "fileSize": 10485760,
    "fileOrder": 1,
    "createdAt": "2025-01-04T08:30:00Z"
  }
]
```

### 3.2 Upload Post Media
**POST** `/ijaa/api/v1/files/posts/{postId}/media`

Upload an image or video file for a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
X-Username: <username>
```

**Form Data:**
- `file`: The media file (image or video)
- `mediaType`: Either "IMAGE" or "VIDEO"

**Supported Image Types:** jpg, jpeg, png, webp
**Supported Video Types:** mp4, avi, mov, wmv, flv, webm
**Max Image Size:** 5MB
**Max Video Size:** 50MB

**Response (200 OK):**
```json
{
  "message": "Post media uploaded successfully",
  "fileUrl": "/ijaa/api/v1/files/posts/456/media/image_1234567890.jpg",
  "fileName": "image_1234567890.jpg",
  "fileSize": 2048576
}
```

### 3.3 Get Post Media URL
**GET** `/ijaa/api/v1/files/posts/{postId}/media/{fileName}`

Get the URL for a specific media file.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "photoUrl": "http://localhost:8080/ijaa/api/v1/files/posts/456/media/file/image_1234567890.jpg",
  "message": "File retrieved successfully",
  "exists": true
}
```

### 3.4 Serve Post Media File
**GET** `/ijaa/api/v1/files/posts/{postId}/media/file/{fileName}`

Serve the actual media file (public endpoint, no authentication required).

**Example:**
```
GET http://localhost:8080/ijaa/api/v1/files/posts/456/media/file/image_1234567890.jpg
```

**Response:** The actual media file (image or video)

### 3.5 Delete Post Media
**DELETE** `/ijaa/api/v1/files/posts/{postId}/media/{fileName}`

Delete a specific media file from a post.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "File deleted successfully",
  "status": "200",
  "data": null
}
```

---

## 4. Error Responses

### 4.1 Validation Errors (400 Bad Request)
```json
{
  "message": "Validation failed",
  "status": "400",
  "data": {
    "field": "content",
    "error": "Post content must be between 1 and 2000 characters"
  }
}
```

### 4.2 Unauthorized (401 Unauthorized)
```json
{
  "message": "Unauthorized access",
  "status": "401",
  "data": null
}
```

### 4.3 Forbidden (403 Forbidden)
```json
{
  "message": "Feature 'events.posts.create' is disabled",
  "status": "403",
  "data": null
}
```

### 4.4 Not Found (404 Not Found)
```json
{
  "message": "Post not found",
  "status": "404",
  "data": null
}
```

### 4.5 File Upload Errors (400 Bad Request)
```json
{
  "message": "Invalid file type. Only jpg, jpeg, png, webp are allowed for images",
  "status": "400",
  "data": null
}
```

```json
{
  "message": "File size exceeds maximum limit of 5MB",
  "status": "400",
  "data": null
}
```

### 4.6 Post Access Control Errors (400 Bad Request)
```json
{
  "message": "Event not found with id: 123",
  "status": "400",
  "data": null
}
```

```json
{
  "message": "Cannot post on inactive event",
  "status": "400",
  "data": null
}
```

```json
{
  "message": "Only the event creator can post on this event",
  "status": "400",
  "data": null
}
```

---

## 5. Frontend Integration Examples

### 5.1 Creating a Text Post
```javascript
const createTextPost = async (eventId, content) => {
  const formData = new FormData();
  formData.append('eventId', eventId);
  formData.append('content', content);
  
  const response = await fetch('/ijaa/api/v1/events/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};
```

### 5.2 Creating a Mixed Content Post (Text + Images + Videos)
```javascript
const createMixedContentPost = async (eventId, content, mediaFiles) => {
  const formData = new FormData();
  formData.append('eventId', eventId);
  formData.append('content', content);
  
  // Add all media files to the same request
  mediaFiles.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await fetch('/ijaa/api/v1/events/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
};

// Usage example
const mediaFiles = [imageFile1, imageFile2, videoFile1];
const result = await createMixedContentPost(123, "Check out these amazing photos and video from the event!", mediaFiles);
```

### 5.3 Creating a Simple Post with Single Media
```javascript
const createPostWithSingleMedia = async (eventId, content, file) => {
  const formData = new FormData();
  formData.append('eventId', eventId);
  formData.append('content', content);
  formData.append('files', file);
  
  const response = await fetch('/ijaa/api/v1/events/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return await response.json();
};
```

### 5.4 Loading Posts with Comments
```javascript
const loadEventPosts = async (eventId, page = 0, size = 10) => {
  const response = await fetch(`/ijaa/api/v1/events/posts/event/${eventId}?page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Username': username
    }
  });
  return await response.json();
};

const loadPostComments = async (postId) => {
  const response = await fetch(`/ijaa/api/v1/events/comments/post/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Username': username
    }
  });
  return await response.json();
};
```

---

## 6. Feature Flag Integration

Before using any post-related functionality, check if the feature is enabled:

```javascript
const checkFeatureFlag = async (featureName) => {
  const response = await fetch(`/ijaa/api/v1/admin/feature-flags/${featureName}/enabled`);
  const result = await response.json();
  return result.enabled;
};

// Usage
const canCreatePosts = await checkFeatureFlag('events.posts.create');
const canUploadMedia = await checkFeatureFlag('events.posts.media');
```

---

## 7. Media File Handling

### 7.1 Media File Structure
Each media file in a post response contains:
- `id`: Unique identifier for the media file
- `fileName`: Generated filename for storage
- `fileUrl`: Public URL to access the file
- `fileType`: MIME type (e.g., "image/jpeg", "video/mp4")
- `mediaType`: Either "IMAGE" or "VIDEO"
- `fileSize`: File size in bytes
- `fileOrder`: Order of display (0-based index)
- `createdAt`: Upload timestamp

### 7.2 Displaying Media Files
```javascript
const renderPostMedia = (mediaFiles) => {
  return mediaFiles
    .sort((a, b) => a.fileOrder - b.fileOrder) // Sort by fileOrder
    .map(media => {
      if (media.mediaType === 'IMAGE') {
        return `<img src="${media.fileUrl}" alt="${media.fileName}" />`;
      } else if (media.mediaType === 'VIDEO') {
        return `<video controls><source src="${media.fileUrl}" type="${media.fileType}" /></video>`;
      }
    });
};
```

### 7.3 Media File Validation
- **Images**: jpg, jpeg, png, webp (max 5MB)
- **Videos**: mp4, avi, mov, wmv, flv, webm (max 50MB)
- **Multiple Files**: Upload multiple files sequentially or in parallel

## 8. Notes for Frontend Development

1. **Authentication**: Always include the JWT token in the Authorization header (username is extracted from the token)
2. **X-Username Header**: Some file operations require the `X-Username` header explicitly
3. **Error Handling**: Implement proper error handling for all API calls
4. **File Uploads**: Use FormData for media uploads, not JSON
5. **Pagination**: Implement pagination for posts and comments
6. **Real-time Updates**: Consider implementing WebSocket connections for real-time updates
7. **Media Optimization**: Compress images before upload to reduce file sizes
8. **Feature Flags**: Always check feature flags before showing UI elements
9. **Loading States**: Show loading indicators during API calls
10. **Error Messages**: Display user-friendly error messages
11. **Responsive Design**: Ensure the UI works well on mobile devices
12. **Media Ordering**: Always sort media files by `fileOrder` before displaying
13. **Mixed Content**: Use `MIXED` post type for posts with both images and videos
14. **Public Media Access**: Media files can be accessed without authentication
15. **File Size Limits**: Implement client-side validation for file sizes
16. **Media Types**: Validate file types before upload to prevent errors
17. **Response Format**: Comments return wrapped in `{message, code, data}` format
18. **Media URLs**: Use `/media/` not `/media/file/` for file URLs in responses
19. **Post Fields**: Posts include `userId`, `postType`, and `creatorName` fields
20. **Comment Fields**: Comments use `likesCount` and `repliesCount` instead of `likes` and `replies`

---

## 9. Critical API Differences for Frontend Integration

### 9.1 Response Format Differences
- **Comments**: All comment responses are wrapped in `{message, code, data}` format
- **Posts**: Post responses are direct objects, not wrapped
- **Media**: Media responses use different field names than documented

### 9.2 Required Headers
- **X-Username**: Required for file upload operations
- **Authorization**: Required for all authenticated endpoints

### 9.3 Field Name Differences
- **Comments**: Use `likesCount` and `repliesCount` instead of `likes` and `replies`
- **Posts**: Include `userId`, `postType`, and `creatorName` fields
- **Media**: File URLs use `/media/` not `/media/file/` in responses

### 9.4 URL Structure
- **Media Serving**: Public URLs use `/media/file/` path
- **Media API**: API endpoints use `/media/` path
- **File Upload**: Returns `/media/` URLs in response

---

## 10. Testing Endpoints

You can test these APIs using tools like Postman or curl. Make sure to:
1. Start all services (Discovery, Config, Gateway, User, Event, File)
2. Register a user and get a JWT token
3. Create an event first
4. Then test the post functionality

For testing, you can use the Swagger UI at:
- Event Service: `http://localhost:8082/swagger-ui.html`
- File Service: `http://localhost:8083/swagger-ui.html`

---

## 11. Complete Example: Creating a Mixed Content Post

Here's a complete example of how to create a post with text, images, and videos:

### 11.1 Frontend Implementation
```javascript
class PostManager {
  constructor(baseUrl, token, username) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.username = username;
  }

  async createMixedPost(eventId, content, mediaFiles) {
    try {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('content', content);
      
      // Add all media files to the same request
      mediaFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch(`${this.baseUrl}/ijaa/api/v1/events/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }
      
      const post = await response.json();
      
      return {
        success: true,
        post: post
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPost(postId) {
    const response = await fetch(`${this.baseUrl}/ijaa/api/v1/events/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'X-Username': this.username
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get post: ${response.statusText}`);
    }
    
    return await response.json();
  }
}

// Usage
const postManager = new PostManager('http://localhost:8000', 'your-jwt-token', 'username');

const mediaFiles = [imageFile1, imageFile2, videoFile1];

const result = await postManager.createMixedPost(
  123, 
  "Amazing event photos and video! Check out the highlights from our alumni meetup.", 
  mediaFiles
);

if (result.success) {
  console.log('Post created successfully:', result.post);
} else {
  console.error('Failed to create post:', result.error);
}
```

### 11.2 React Component Example
```jsx
import React, { useState } from 'react';

const CreateMixedPost = ({ eventId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const result = await postManager.createMixedPost(eventId, content, mediaFiles);
      
      if (result.success) {
        onPostCreated(result.post);
        setContent('');
        setMediaFiles([]);
      } else {
        alert('Failed to create post: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening at this event?"
        rows={4}
        required
      />
      
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />
      
      <div>
        {mediaFiles.map((file, index) => (
          <div key={index}>
            {file.type.startsWith('image/') ? '📷' : '🎥'} {file.name}
          </div>
        ))}
      </div>
      
      <button type="submit" disabled={uploading}>
        {uploading ? 'Creating Post...' : 'Create Post'}
      </button>
    </form>
  );
};
```

This complete example shows how to:
1. Create a post with text and multiple media files in a single request
2. Handle the complete post response with media files
3. Display media files in the correct order
4. Provide a user-friendly interface for mixed content posts
