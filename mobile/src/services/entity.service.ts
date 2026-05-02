import api from './api';
import type {
  NaturalCharacter,
  VirtualCharacter,
  LegalEntity,
  ApiResponse,
  PaginationQuery,
  SearchRequest,
  SearchResult,
} from '@idgate/shared';

export const entityService = {
  // --- Natural Character (Profile) ---
  getMyProfile: async (): Promise<ApiResponse<NaturalCharacter>> => {
    const response = await api.get('/entities/me');
    return response.data;
  },

  updateProfile: async (data: Partial<NaturalCharacter>): Promise<ApiResponse<NaturalCharacter>> => {
    const response = await api.patch('/entities/me', data);
    return response.data;
  },

  getProfile: async (id: string): Promise<ApiResponse<NaturalCharacter>> => {
    const response = await api.get(`/entities/persons/${id}`);
    return response.data;
  },

  // --- Virtual Character (Position) ---
  getMyPositions: async (): Promise<ApiResponse<VirtualCharacter[]>> => {
    const response = await api.get('/entities/me/positions');
    return response.data;
  },

  getPosition: async (id: string): Promise<ApiResponse<VirtualCharacter>> => {
    const response = await api.get(`/entities/positions/${id}`);
    return response.data;
  },

  acceptPositionLink: async (positionId: string): Promise<ApiResponse<VirtualCharacter>> => {
    const response = await api.post(`/entities/positions/${positionId}/accept-link`);
    return response.data;
  },

  declinePositionLink: async (positionId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/entities/positions/${positionId}/decline-link`);
    return response.data;
  },

  // --- Legal Entity (Organization) ---
  createOrganization: async (data: Partial<LegalEntity>): Promise<ApiResponse<LegalEntity>> => {
    const response = await api.post('/entities/organizations', data);
    return response.data;
  },

  getOrganization: async (id: string): Promise<ApiResponse<LegalEntity>> => {
    const response = await api.get(`/entities/organizations/${id}`);
    return response.data;
  },

  getMyOrganizations: async (): Promise<ApiResponse<LegalEntity[]>> => {
    const response = await api.get('/entities/me/organizations');
    return response.data;
  },

  createPosition: async (
    orgId: string,
    data: Partial<VirtualCharacter>,
  ): Promise<ApiResponse<VirtualCharacter>> => {
    const response = await api.post(`/entities/organizations/${orgId}/positions`, data);
    return response.data;
  },

  linkPositionToPerson: async (
    positionId: string,
    personId: string,
  ): Promise<ApiResponse<VirtualCharacter>> => {
    const response = await api.post(`/entities/positions/${positionId}/link`, { personId });
    return response.data;
  },

  unlinkPosition: async (positionId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/entities/positions/${positionId}/unlink`);
    return response.data;
  },

  // --- Org Structure ---
  getOrgStructure: async (orgId: string): Promise<ApiResponse<LegalEntity['orgStructure']>> => {
    const response = await api.get(`/entities/organizations/${orgId}/structure`);
    return response.data;
  },

  // --- Search ---
  search: async (request: SearchRequest): Promise<ApiResponse<SearchResult[]>> => {
    const response = await api.post('/search', request);
    return response.data;
  },
};
