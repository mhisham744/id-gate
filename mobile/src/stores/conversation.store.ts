import { create } from 'zustand';
import type { Conversation, Message } from '@idgate/shared';
import { communicationService } from '../services/communication.service';

interface ConversationState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  isLoading: boolean;

  // Actions
  fetchConversations: () => Promise<void>;
  setActiveConversation: (conversation: Conversation | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  addMessage: (conversationId: string, message: Message) => void;
  sendMessage: (conversationId: string, type: string, content: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: {},
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await communicationService.getConversations();
      if (response.success && response.data) {
        set({ conversations: response.data });
      }
    } catch (error) {
      // Silently handle errors (e.g. 401 if not authenticated yet)
      console.warn('Failed to fetch conversations:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  fetchMessages: async (conversationId) => {
    const response = await communicationService.getMessages(conversationId);
    if (response.success && response.data) {
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: response.data!,
        },
      }));
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    }));
  },

  sendMessage: async (conversationId, type, content) => {
    const response = await communicationService.sendMessage(conversationId, { type, content });
    if (response.success && response.data) {
      get().addMessage(conversationId, response.data);
    }
  },
}));
