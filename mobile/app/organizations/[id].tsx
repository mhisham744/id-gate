import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';
import type { LegalEntity } from '@idgate/shared';

export default function OrganizationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [org, setOrg] = useState<LegalEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) loadOrganization();
  }, [id]);

  const loadOrganization = async () => {
    setIsLoading(true);
    try {
      const response = await entityService.getOrganization(id);
      if (response.success && response.data) {
        setOrg(response.data);
      }
    } catch (error) {
      console.warn('Failed to load organization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organization</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!org) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organization</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>Organization not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Organization</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#06b6d4', '#0891b2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconWrap}>
              <Ionicons name="business" size={32} color="#fff" />
            </View>
            <Text style={styles.heroName}>{org.commercialName || org.formalName}</Text>
            <Text style={styles.heroFormal}>{org.formalName}</Text>
            <View style={styles.heroBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#fff" />
              <Text style={styles.heroBadgeText}>Verified Organization</Text>
            </View>
            <Text style={styles.heroCode}>{org.idCode}</Text>
          </LinearGradient>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.sectionCard}>
            {org.industry && (
              <InfoRow icon="layers-outline" label="Industry" value={org.industry} />
            )}
            {org.country && (
              <InfoRow icon="globe-outline" label="Country" value={org.country} />
            )}
            {org.city && (
              <InfoRow icon="location-outline" label="City" value={org.city} />
            )}
            {org.address && (
              <InfoRow icon="map-outline" label="Address" value={org.address} last={!org.registrationNumber} />
            )}
            {org.registrationNumber && (
              <InfoRow icon="document-text-outline" label="Registration" value={org.registrationNumber} last />
            )}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT</Text>
          <View style={styles.sectionCard}>
            {org.email && (
              <InfoRow icon="mail-outline" label="Email" value={org.email} />
            )}
            {org.phoneNumber && (
              <InfoRow icon="call-outline" label="Phone" value={org.phoneNumber} />
            )}
            {org.website && (
              <InfoRow icon="link-outline" label="Website" value={org.website} last />
            )}
          </View>
        </View>

        {/* Products & Brands */}
        {((org as any).brands?.length > 0 || (org as any).products?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BRANDS & PRODUCTS</Text>
            <View style={styles.sectionCard}>
              {(org as any).brands?.length > 0 && (
                <View style={styles.chipsRow}>
                  <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
                  <View style={styles.chips}>
                    {(org as any).brands.map((b: string) => (
                      <View key={b} style={styles.chip}>
                        <Text style={styles.chipText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {(org as any).products?.length > 0 && (
                <View style={[styles.chipsRow, { marginTop: spacing.sm }]}>
                  <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
                  <View style={styles.chips}>
                    {(org as any).products.map((p: string) => (
                      <View key={p} style={[styles.chip, styles.chipProduct]}>
                        <Text style={[styles.chipText, { color: colors.primary }]}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONNECTION STATUS</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active & Verified</Text>
            </View>
            <Text style={styles.statusDesc}>
              You are linked to this organization as an admin. All communications are verified.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Ionicons name={icon} size={18} color={colors.textTertiary} />
      <View style={styles.infoRowContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
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
  errorText: { ...typography.body, color: colors.textTertiary },
  content: { padding: spacing.md },
  // Hero
  heroCard: {
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.md,
    marginBottom: spacing.lg,
  },
  heroGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroName: { ...typography.h2, color: '#fff', textAlign: 'center' },
  heroFormal: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  heroBadgeText: { ...typography.caption, color: '#fff' },
  heroCode: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: spacing.xs },
  // Sections
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.overline,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.xs,
  },
  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  infoRowContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  infoValue: { ...typography.bodyMedium, color: colors.text, marginTop: 1 },
  // Chips
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  chipProduct: { backgroundColor: colors.primaryGhost },
  chipText: { ...typography.caption, color: colors.textSecondary },
  // Status
  statusCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  statusText: { ...typography.bodyMedium, color: colors.success, fontWeight: '600' },
  statusDesc: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
});
