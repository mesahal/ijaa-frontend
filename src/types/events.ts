// Event-related TypeScript interfaces and types

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  endDate: string;
  location: string;
  eventType: EventType;
  privacy: EventPrivacy;
  maxParticipants: number;
  currentParticipants: number;
  registrationDeadline: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: string;
  templateId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isOnline?: boolean;
  meetingLink?: string;
  organizerName?: string;
  organizerEmail?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  eventType: EventType;
  isOnline: boolean;
  meetingLink: string;
  maxParticipants: number;
  organizerName: string;
  organizerEmail: string;
  privacy: EventPrivacy;
  inviteMessage: string;
}

export interface EventParticipation {
  id: string;
  eventId: string;
  userId: string;
  status: ParticipationStatus;
  message?: string;
  registeredAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
}

export interface EventInvitation {
  id: string;
  eventId: string;
  inviteeEmail: string;
  message: string;
  status: 'SENT' | 'ACCEPTED' | 'DECLINED';
  sentAt: string;
  isRead: boolean;
  isResponded: boolean;
  eventTitle?: string;
  invitedByUsername?: string;
  personalMessage?: string;
}

// Enhanced invitation interface for Phase 5
export interface EnhancedEventInvitation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventType: EventType;
  inviteeEmail: string;
  inviteeUsername: string;
  personalMessage: string;
  status: InvitationStatus;
  sentAt: string;
  isRead: boolean;
  isResponded: boolean;
  respondedAt?: string;
  invitedByUsername: string;
  invitedByEmail: string;
}

// Event template interfaces for Phase 5
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  eventType: EventType;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  templateData: {
    title: string;
    description: string;
    location: string;
    maxParticipants: number;
    privacy: EventPrivacy;
    inviteMessage: string;
    tags: string[];
    isOnline: boolean;
    meetingLink?: string;
    organizerName: string;
    organizerEmail: string;
  };
  tags: string[];
  thumbnailUrl?: string;
}

export interface TemplateFormData {
  name: string;
  description: string;
  category: TemplateCategory;
  eventType: EventType;
  isPublic: boolean;
  templateData: {
    title: string;
    description: string;
    location: string;
    maxParticipants: number;
    privacy: EventPrivacy;
    inviteMessage: string;
    tags: string[];
    isOnline: boolean;
    meetingLink: string;
    organizerName: string;
    organizerEmail: string;
  };
  tags: string[];
  thumbnailUrl?: string;
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  replies?: EventComment[];
}

export interface EventMedia {
  id: string;
  eventId: string;
  fileUrl: string;
  caption: string;
  type: MediaType;
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  isLiked: boolean;
}

export type EventType = 
  | 'NETWORKING'
  | 'WORKSHOP'
  | 'CONFERENCE'
  | 'SOCIAL'
  | 'CAREER'
  | 'MENTORSHIP';

export type EventPrivacy = 
  | 'PUBLIC'
  | 'PRIVATE'
  | 'ALUMNI_ONLY';

export type ParticipationStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'DECLINED'
  | 'MAYBE'
  | 'CANCELLED';

export type InvitationStatus = 
  | 'SENT'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED';

export type MediaType = 
  | 'IMAGE'
  | 'VIDEO'
  | 'DOCUMENT';

export type TemplateCategory = 
  | 'NETWORKING'
  | 'WORKSHOP'
  | 'CONFERENCE'
  | 'SOCIAL'
  | 'CAREER'
  | 'MENTORSHIP'
  | 'GENERAL'
  | 'CUSTOM';

export interface EventSearchCriteria {
  location?: string;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
  isOnline?: boolean;
  organizerName?: string;
  title?: string;
  description?: string;
  privacy?: EventPrivacy;
  tags?: string[];
}

export interface TemplateSearchCriteria {
  name?: string;
  eventType?: EventType;
  category?: TemplateCategory;
  isPublic?: boolean;
  tags?: string[];
}

export interface InvitationCounts {
  totalCount: number;
  unreadCount: number;
  unrespondedCount: number;
  acceptedCount: number;
  declinedCount: number;
}

export interface EventAnalytics {
  eventId: string;
  totalViews: number;
  totalRegistrations: number;
  totalAttendees: number;
  totalInvitations: number;
  totalComments: number;
  totalMedia: number;
  engagementRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string | number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}
