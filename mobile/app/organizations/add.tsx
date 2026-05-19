import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';

export default function AddOrganizationScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await entityService.searchOrganizations(text.trim());
      if (Array.isArray(response)) {
        setResults(response);
      } else if (response?.data) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (e) {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleOrgPress = (org: any) => {
    router.push({ pathname: '/organizations/join/[id]', params: { id: org.id } });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Organization</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or IDGate code..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false); }}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.searchHint}>
          Enter organization name, commercial name, or IDGate code (e.g. IDG-ORG-GEZIRA01)
        </Text>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.resultsList}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isSearching && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <View style={styles.emptyWrap}>
            <Ionicons name="business-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No organizations found</Text>
            <Text style={styles.emptyDesc}>
              Try a different name or check the IDGate code
            </Text>
          </View>
        )}

        {!isSearching && results.map((org) => (
          <TouchableOpacity
            key={org.id}
            style={styles.orgCard}
            onPress={() => handleOrgPress(org)}
            activeOpacity={0.7}
          >
            <View style={styles.orgIconWrap}>
              <Ionicons name="business" size={24} color={colors.legalEntity} />
            </View>
            <View style={styles.orgInfo}>
              <Text style={styles.orgName} numberOfLines={1}>
                {org.commercialName || org.formalName}
              </Text>
              {org.commercialName && org.formalName !== org.commercialName && (
                <Text style={styles.orgFormal} numberOfLines={1}>{org.formalName}</Text>
              )}
              <View style={styles.orgMeta}>
                {org.mainIndustry && (
                  <View style={styles.metaChip}>
                    <Ionicons name="layers-outline" size={11} color={colors.textTertiary} />
                    <Text style={styles.metaText}>{org.mainIndustry}</Text>
                  </View>
                )}
                {org.countryOfRegistration && (
                  <View style={styles.metaChip}>
                    <Ionicons name="location-outline" size={11} color={colors.textTertiary} />
                    <Text style={styles.metaText}>{org.countryOfRegistration}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.orgCode}>{org.idCode}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        {!hasSearched && !isSearching && (
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>Search for an organization</Text>
            <Text style={styles.emptyDesc}>
              Find the organization you want to join by name or code
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  // Search
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, ...typography.body, color: colors.text },
  searchHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  // Results
  resultsList: { flex: 1 },
  resultsContent: { padding: spacing.md, gap: spacing.sm },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  loadingText: { ...typography.body, color: colors.textSecondary },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.h3, color: colors.textSecondary },
  emptyDesc: { ...typography.body, color: colors.textTertiary, textAlign: 'center', maxWidth: 260 },
  // Org Card
  orgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
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
  orgName: { ...typography.bodyMedium, color: colors.text },
  orgFormal: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  orgMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  orgCode: { ...typography.caption, color: colors.textTertiary, marginTop: 3, fontSize: 10 },
});
