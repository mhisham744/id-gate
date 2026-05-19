import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';

type Position = {
  id: string;
  idCode: string;
  positionName: string;
  positionName1?: string;
  positionDescription?: string;
  linkStatus: string;
  linkedNaturalId?: string;
  organization?: { id: string; commercialName?: string; formalName: string };
};

export default function PositionsListScreen() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPositions = useCallback(async () => {
    try {
      const data = await entityService.getAdminPositions();
      if (Array.isArray(data)) setPositions(data);
      else if (data?.data) setPositions(data.data);
      else setPositions([]);
    } catch (e) {
      console.warn('Failed to load positions:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadPositions(); }, [loadPositions]);

  const onRefresh = () => { setRefreshing(true); loadPositions(); };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'pending': return colors.warning;
      case 'vacant': return colors.textTertiary;
      default: return colors.textTertiary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Linked';
      case 'pending': return 'Pending';
      case 'vacant': return 'Vacant';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {positions.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="briefcase-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Positions</Text>
            <Text style={styles.emptyDesc}>Create positions to assign users to roles in your organizations</Text>
          </View>
        ) : (
          positions.map((pos) => (
            <TouchableOpacity
              key={pos.id}
              style={styles.posCard}
              activeOpacity={0.7}
              onPress={() => router.push({ pathname: '/positions/[id]', params: { id: pos.id } })}
            >
              <View style={styles.posIconWrap}>
                <Ionicons name="briefcase" size={22} color={colors.virtualCharacter} />
              </View>
              <View style={styles.posInfo}>
                <Text style={styles.posName} numberOfLines={1}>{pos.positionName}</Text>
                {pos.organization && (
                  <Text style={styles.posOrg} numberOfLines={1}>
                    {pos.organization.commercialName || pos.organization.formalName}
                  </Text>
                )}
                <View style={styles.posMetaRow}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(pos.linkStatus) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(pos.linkStatus) }]}>
                    {getStatusLabel(pos.linkStatus)}
                  </Text>
                  <Text style={styles.posCode}>{pos.idCode}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create Position FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/positions/create')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Positions</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: 100 },
  // Empty
  emptyWrap: { alignItems: 'center', paddingVertical: spacing.xl * 2, gap: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptyDesc: { ...typography.body, color: colors.textTertiary, textAlign: 'center', maxWidth: 260 },
  // Position Card
  posCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.xs,
  },
  posIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.virtualCharacter + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posInfo: { flex: 1 },
  posName: { ...typography.bodyMedium, color: colors.text },
  posOrg: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  posMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { ...typography.caption, fontSize: 11, fontWeight: '600' },
  posCode: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});
