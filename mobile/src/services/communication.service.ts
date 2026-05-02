import api from './api';
import type {
  Conversation,
  Message,
  Contact,
  Team,
  Group,
  BroadcastList,
  ContactStatus,
  TeamVisibility,
  ApiResponse,
  PaginationQuery,
} from '@idgate/shared';

export const communicationService = {
  // --- Conversations ---
  getConversations: async (pagination?: PaginationQuery): Promise<ApiResponse<Conversation[]>> => {
    const response = await api.get('/conversations', { params: pagination });
    return response.data;
  },

  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },

  // --- Messages ---
  getMessages: async (
    conversationId: string,
    pagination?: PaginationQuery,
  ): Promise<ApiResponse<Message[]>> => {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params: pagination,
    });
    return response.data;
  },

  sendMessage: async (
    conversationId: string,
    data: { type: string; content: string; attachments?: string[] },
  ): Promise<ApiResponse<Message>> => {
    const response = await api.post(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  forwardMessage: async (
    messageId: string,
    targetIds: string[],
    comment?: string,
  ): Promise<ApiResponse<Message[]>> => {
    const response = await api.post(`/messages/${messageId}/forward`, { targetIds, comment });
    return response.data;
  },

  // --- Contacts (Address Book) ---
  getContacts: async (): Promise<ApiResponse<Contact[]>> => {
    const response = await api.get('/contacts');
    return response.data;
  },

  requestContact: async (contactId: string, contactType: string): Promise<ApiResponse<Contact>> => {
    const response = await api.post('/contacts/request', { contactId, contactType });
    return response.data;
  },

  respondToContactRequest: async (
    contactId: string,
    action: 'accept' | 'decline',
  ): Promise<ApiResponse<Contact>> => {
    const response = await api.post(`/contacts/${contactId}/respond`, { action });
    return response.data;
  },

  getPendingRequests: async (): Promise<ApiResponse<Contact[]>> => {
    const response = await api.get('/contacts/pending');
    return response.data;
  },

  getSentRequests: async (): Promise<ApiResponse<Contact[]>> => {
    const response = await api.get('/contacts/sent');
    return response.data;
  },

  getSuggested: async (): Promise<ApiResponse<Contact[]>> => {
    const response = await api.get('/contacts/suggested');
    return response.data;
  },

  removeContact: async (contactId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/contacts/${contactId}`);
    return response.data;
  },

  blockContact: async (contactId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/contacts/${contactId}/block`);
    return response.data;
  },

  // --- Teams ---
  getTeams: async (): Promise<ApiResponse<Team[]>> => {
    const response = await api.get('/teams');
    return response.data;
  },

  createTeam: async (data: {
    name: string;
    description?: string;
    visibility: TeamVisibility;
    memberIds: string[];
  }): Promise<ApiResponse<Team>> => {
    const response = await api.post('/teams', data);
    return response.data;
  },

  joinTeam: async (teamId: string): Promise<ApiResponse<Team>> => {
    const response = await api.post(`/teams/${teamId}/join`);
    return response.data;
  },

  leaveTeam: async (teamId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/teams/${teamId}/leave`);
    return response.data;
  },

  searchTeams: async (query: string): Promise<ApiResponse<Team[]>> => {
    const response = await api.get('/teams/search', { params: { query } });
    return response.data;
  },

  // --- Groups ---
  getGroups: async (): Promise<ApiResponse<Group[]>> => {
    const response = await api.get('/groups');
    return response.data;
  },

  createGroup: async (data: {
    name: string;
    description?: string;
    visibility: TeamVisibility;
    groupType: string;
    memberIds: string[];
    legalEntityId?: string;
  }): Promise<ApiResponse<Group>> => {
    const response = await api.post('/groups', data);
    return response.data;
  },

  // --- Broadcast ---
  getBroadcasts: async (): Promise<ApiResponse<BroadcastList[]>> => {
    const response = await api.get('/broadcasts');
    return response.data;
  },

  createBroadcast: async (data: {
    name: string;
    recipientIds: string[];
  }): Promise<ApiResponse<BroadcastList>> => {
    const response = await api.post('/broadcasts', data);
    return response.data;
  },

  sendBroadcast: async (
    broadcastId: string,
    message: { type: string; content: string },
  ): Promise<ApiResponse<void>> => {
    const response = await api.post(`/broadcasts/${broadcastId}/send`, message);
    return response.data;
  },
};
