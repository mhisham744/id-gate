import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'contact_request',
    title: 'New Contact Request',
    body: 'Ahmed Mohamed wants to connect with you',
    isRead: false,
    createdAt: '2026-05-02T10:30:00Z',
  },
  {
    id: '2',
    type: 'position_link_request',
    title: 'Position Link Request',
    body: 'Blink Egypt wants to link you as CFO',
    isRead: false,
    createdAt: '2026-05-01T14:00:00Z',
  },
  {
    id: '3',
    type: 'meeting_request',
    title: 'Meeting Request',
    body: 'Q2 Budget Review - May 5, 2026 at 10:00 AM',
    isRead: true,
    createdAt: '2026-05-01T09:00:00Z',
  },
];

const typeConfig: Record<string, { icon: IoniconsName; color: string; bg: string }> = {
  contact_request: { icon: 'person-add', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  position_link_request: { icon: 'link', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  meeting_request: { icon: 'calendar', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  task_assigned: { icon: 'clipboard', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  new_message: { icon: 'chatbubble', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
};

export default function NotificationsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const config = typeConfig[item.type] || typeConfig.new_message;
          return (
            <View style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}>
              <View style={[styles.notifIcon, { backgroundColor: config.bg }]}>
                <Ionicons name={config.icon} size={20} color={config.color} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              {(item.type === 'contact_request' || item.type === 'position_link_request') && (
                <View style={styles.notifActions}>
                  <TouchableOpacity style={styles.acceptBtn}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn}>
                    <Ionicons name="close" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>No new notifications</Text>
          </View>
        }
      />
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
  markAllBtn: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  markAllText: { ...typography.buttonSmall, color: colors.primary },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: 100 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.xs,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: { flex: 1 },
  notifTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.text },
  notifBody: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  notifTime: { ...typography.caption, color: colors.textTertiary, marginTop: 4 },
  notifActions: { flexDirection: 'row', gap: spacing.xs },
  acceptBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100, gap: spacing.md },
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
