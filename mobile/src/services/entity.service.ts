import api from './api';

export const entityService = {
  // --- Profile ---
  getMyProfile: async () => {
    const response = await api.get('/entities/profile/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/entities/profile/me', data);
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await api.get(`/entities/profile/${id}`);
    return response.data;
  },

  searchUsers: async (query: string) => {
    const response = await api.get('/entities/search/users', { params: { q: query } });
    return response.data;
  },

  // --- Positions ---
  getMyPositions: async () => {
    const response = await api.get('/entities/positions/me');
    return response.data;
  },

  getPendingPositionLinks: async () => {
    const response = await api.get('/entities/positions/pending');
    return response.data;
  },

  getPosition: async (id: string) => {
    const response = await api.get(`/entities/positions/${id}`);
    return response.data;
  },

  updatePosition: async (id: string, data: any) => {
    const response = await api.put(`/entities/positions/${id}`, data);
    return response.data;
  },

  acceptPositionLink: async (positionId: string) => {
    const response = await api.post(`/entities/positions/${positionId}/accept-link`);
    return response.data;
  },

  declinePositionLink: async (positionId: string) => {
    const response = await api.post(`/entities/positions/${positionId}/decline-link`);
    return response.data;
  },

  linkPositionToPerson: async (positionId: string, personId: string) => {
    const response = await api.post(`/entities/positions/${positionId}/link`, { personId });
    return response.data;
  },

  unlinkPosition: async (positionId: string) => {
    const response = await api.post(`/entities/positions/${positionId}/unlink`);
    return response.data;
  },

  // --- Organizations ---
  getMyOrganizations: async () => {
    const response = await api.get('/entities/organizations/me');
    return response.data;
  },

  createOrganization: async (data: any) => {
    const response = await api.post('/entities/organizations', data);
    return response.data;
  },

  getOrganization: async (id: string) => {
    const response = await api.get(`/entities/organizations/${id}`);
    return response.data;
  },

  updateOrganization: async (id: string, data: any) => {
    const response = await api.put(`/entities/organizations/${id}`, data);
    return response.data;
  },

  searchOrganizations: async (query: string) => {
    const response = await api.get('/entities/organizations/search', { params: { q: query } });
    return response.data;
  },

  // --- Org Positions ---
  getOrgPositions: async (orgId: string) => {
    const response = await api.get(`/entities/organizations/${orgId}/positions`);
    return response.data;
  },

  createPosition: async (orgId: string, data: any) => {
    const response = await api.post(`/entities/organizations/${orgId}/positions`, data);
    return response.data;
  },

  // --- Org Structure ---
  getOrgStructure: async (orgId: string, type?: string) => {
    const response = await api.get(`/entities/organizations/${orgId}/structure`, {
      params: type ? { type } : undefined,
    });
    return response.data;
  },

  createStructureNode: async (orgId: string, data: any) => {
    const response = await api.post(`/entities/organizations/${orgId}/structure`, data);
    return response.data;
  },

  updateStructureNode: async (nodeId: string, data: any) => {
    const response = await api.put(`/entities/structure/${nodeId}`, data);
    return response.data;
  },

  deleteStructureNode: async (nodeId: string) => {
    const response = await api.delete(`/entities/structure/${nodeId}`);
    return response.data;
  },

  // --- Notifications ---
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get('/notifications', { params: { page, limit } });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markNotificationRead: async (id: string) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },
};
