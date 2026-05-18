import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';
import type { LegalEntity } from '@idgate/shared';

export default function OrganizationsScreen() {
  const [organizations, setOrganizations] = useState<LegalEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await entityService.getMyOrganizations();
      if (response.success && response.data) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.warn('Failed to load organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrganization = ({ item }: { item: LegalEntity }) => (
    <TouchableOpacity
      style={styles.orgCard}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/organizations/[id]', params: { id: item.id } })}
    >
      <View style={styles.orgIconWrap}>
        <Ionicons name="business" size={22} color={colors.legalEntity} />
      </View>
      <View style={styles.orgInfo}>
        <Text style={styles.orgName} numberOfLines={1}>{item.formalName}</Text>
        {item.commercialName && (
          <Text style={styles.orgCommercial} numberOfLines={1}>{item.commercialName}</Text>
        )}
        <View style={styles.orgMeta}>
          {item.mainIndustry && (
            <Text style={styles.orgMetaText}>{item.mainIndustry}</Text>
          )}
          {item.countryOfRegistration && (
            <Text style={styles.orgMetaText}>{item.countryOfRegistration}</Text>
          )}
        </View>
      </View>
      <View style={styles.verifiedBadge}>
        <Ionicons name="shield-checkmark" size={16} color={colors.success} />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Organizations</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={organizations}
          keyExtractor={(item) => item.id}
          renderItem={renderOrganization}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
              </View>
              <Text style={styles.emptyTitle}>No organizations yet</Text>
              <Text style={styles.emptySubtitle}>
                Link to an organization to access verified communication channels
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      {/* Add Organization FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/organizations/add')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Header
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
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { ...typography.h3, color: colors.text },
  // List
  list: { padding: spacing.md, gap: spacing.sm },
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.xs,
  },
  orgIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.legalEntity + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orgInfo: { flex: 1 },
  orgName: { ...typography.bodyMedium, color: colors.text, fontWeight: '600' },
  orgCommercial: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  orgMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: 4 },
  orgMetaText: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  verifiedText: { ...typography.caption, color: colors.success, fontSize: 11 },
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
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    maxWidth: 260,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
});
