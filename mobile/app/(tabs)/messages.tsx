import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useConversationStore } from '../../src/stores/conversation.store';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';
import type { Conversation } from '@idgate/shared';

const typeIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  direct: 'person',
  team: 'people',
  group: 'business',
  broadcast: 'megaphone',
};

function ConversationItem({ conversation }: { conversation: Conversation }) {
  const handlePress = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: conversation.id, name: conversation.name || 'Chat' },
    });
  };

  return (
    <TouchableOpacity style={styles.conversationItem} activeOpacity={0.6} onPress={handlePress}>
      <View style={styles.avatar}>
        <Ionicons
          name={typeIcons[conversation.type] || 'chatbubble'}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {conversation.name || 'Direct Message'}
          </Text>
          <Text style={styles.conversationTime}>
            {conversation.lastMessageAt
              ? new Date(conversation.lastMessageAt).toLocaleDateString()
              : ''}
          </Text>
        </View>
        <Text style={styles.conversationPreview} numberOfLines={1}>
          {conversation.lastMessagePreview || 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { conversations, isLoading, fetchConversations } = useConversationStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = conversations.filter(
    (c) =>
      !searchQuery ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessagePreview?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Messages</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationItem conversation={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>No conversations</Text>
          <Text style={styles.emptySubtitle}>Start messaging your verified contacts</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  screenTitle: { ...typography.h1, color: colors.text },
  composeBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: borderRadius.lg,
    ...shadows.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    height: '100%',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContent: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  conversationName: { ...typography.bodyMedium, color: colors.text, flex: 1, marginRight: spacing.sm },
  conversationTime: { ...typography.caption, color: colors.textTertiary },
  conversationPreview: { ...typography.bodySmall, color: colors.textTertiary },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtitle: { ...typography.body, color: colors.textTertiary },
});
