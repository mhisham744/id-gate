import api from './api';

export interface FeedPost {
  id: string;
  type: 'news' | 'event' | 'report';
  title: string;
  content: string;
  summary: string | null;
  authorId: string;
  authorName: string;
  authorType: string;
  organizationName: string | null;
  imageUrl: string | null;
  eventDate: string | null;
  eventLocation: string | null;
  attachmentUrl: string | null;
  likesCount: number;
  forwardsCount: number;
  commentsCount: number;
  createdAt: string;
}

export const feedService = {
  getFeed: async (filters?: { type?: string; page?: number; limit?: number }) => {
    const response = await api.get('/feed', { params: filters });
    return response.data;
  },

  createPost: async (data: {
    type: string;
    title: string;
    content: string;
    summary?: string;
    organizationId?: string;
    organizationName?: string;
    eventDate?: string;
    eventLocation?: string;
    audience?: string[];
  }) => {
    const response = await api.post('/feed', data);
    return response.data;
  },

  likePost: async (postId: string) => {
    const response = await api.post(`/feed/${postId}/like`);
    return response.data;
  },

  forwardPost: async (postId: string) => {
    const response = await api.post(`/feed/${postId}/forward`);
    return response.data;
  },
};
