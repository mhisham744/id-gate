import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';
import { useAuthStore } from '../../src/stores/auth.store';
import { feedService, FeedPost } from '../../src/services/feed.service';

const { width } = Dimensions.get('window');

function Header() {
  const { user } = useAuthStore();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarWrap}>
          <LinearGradient colors={gradients.primary} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0] || 'U'}
            </Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </View>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.firstName || 'there'}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="search-outline" size={22} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FeedCard({
  item,
  onLike,
  onForward,
}: {
  item: FeedPost;
  onLike: () => void;
  onForward: () => void;
}) {
  const typeConfig: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap; bg: string }> = {
    news: { color: '#ef4444', icon: 'newspaper', bg: 'rgba(239, 68, 68, 0.08)' },
    event: { color: '#10b981', icon: 'calendar', bg: 'rgba(16, 185, 129, 0.08)' },
    report: { color: '#f59e0b', icon: 'bar-chart', bg: 'rgba(245, 158, 11, 0.08)' },
  };
  const config = typeConfig[item.type] || typeConfig.news;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardAuthorRow}>
            <View style={[styles.cardAvatar, { backgroundColor: config.bg }]}>
              <Ionicons name={config.icon} size={16} color={config.color} />
            </View>
            <View style={styles.cardAuthorInfo}>
              <Text style={styles.cardAuthorName} numberOfLines={1}>
                {item.organizationName || item.authorName}
              </Text>
            </View>
          </View>
          <Text style={styles.cardTimestamp}>{timeAgo(item.createdAt)}</Text>
        </View>

        {/* Content */}
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardContent} numberOfLines={2}>
          {item.content}
        </Text>

        {/* Event info */}
        {item.type === 'event' && item.eventDate && (
          <View style={styles.eventChip}>
            <Ionicons name="calendar-outline" size={12} color={colors.success} />
            <Text style={styles.eventChipText}>{item.eventDate}</Text>
            {item.eventLocation && (
              <>
                <Ionicons name="location-outline" size={12} color={colors.success} />
                <Text style={styles.eventChipText}>{item.eventLocation}</Text>
              </>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
            <Ionicons name="heart-outline" size={16} color={colors.textTertiary} />
            {item.likesCount > 0 && (
              <Text style={styles.actionCount}>{item.likesCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={16} color={colors.textTertiary} />
            {item.commentsCount > 0 && (
              <Text style={styles.actionCount}>{item.commentsCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onForward}>
            <Ionicons name="share-outline" size={16} color={colors.textTertiary} />
            {item.forwardsCount > 0 && (
              <Text style={styles.actionCount}>{item.forwardsCount}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="bookmark-outline" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchFeed = useCallback(async () => {
    try {
      const response = await feedService.getFeed({});
      if (response.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.warn('Failed to fetch feed:', error);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchFeed().finally(() => setIsLoading(false));
  }, [fetchFeed]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchFeed();
    setIsRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    try {
      await feedService.likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p))
      );
    } catch (error) {
      console.warn('Like failed:', error);
    }
  };

  const handleForward = async (postId: string) => {
    try {
      await feedService.forwardPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, forwardsCount: p.forwardsCount + 1 } : p))
      );
    } catch (error) {
      console.warn('Forward failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FeedCard
              item={item}
              onLike={() => handleLike(item.id)}
              onForward={() => handleForward(item.id)}
            />
          )}
          contentContainerStyle={styles.feedList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="telescope-outline" size={48} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptySubtitle}>
                Content from your verified connections will appear here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { ...typography.h3, color: '#fff' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  greeting: { ...typography.caption, color: colors.textTertiary },
  userName: { ...typography.h3, color: colors.text },
  headerRight: { flexDirection: 'row', gap: spacing.sm },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  // Feed
  feedList: { padding: spacing.sm, gap: spacing.sm, paddingBottom: 120 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.xs,
  },
  cardInner: { padding: spacing.sm },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  cardAvatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAuthorInfo: { flex: 1 },
  cardAuthorName: { ...typography.caption, fontWeight: '600', color: colors.text },
  cardTimestamp: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.text, marginBottom: 2 },
  cardContent: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, lineHeight: 18 },
  eventChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  eventChipText: { ...typography.caption, color: colors.success, fontSize: 11 },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.xs,
    gap: spacing.md,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  actionCount: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  // Loading
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Empty
  emptyWrap: { alignItems: 'center', paddingTop: 100, gap: spacing.md },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtitle: { ...typography.body, color: colors.textTertiary, textAlign: 'center', maxWidth: 260 },
});
