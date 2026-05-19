import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';

type User = { id: string; idCode: string; firstName: string; lastName: string; fullName: string; profilePhotoUrl?: string; accountType?: string };

export default function PositionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [position, setPosition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    if (id) loadPosition();
  }, [id]);

  const loadPosition = async () => {
    setIsLoading(true);
    try {
      const data = await entityService.getPosition(id);
      if (data?.data) setPosition(data.data);
      else setPosition(data);
    } catch (e) {
      console.warn('Failed to load position:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(async (text: string) => {
    setSearchQuery(text);
    if (text.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await entityService.searchPersonalUsers(text.trim());
      if (Array.isArray(data)) setSearchResults(data);
      else if (data?.data) setSearchResults(data.data);
      else setSearchResults([]);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleLinkUser = async (user: User) => {
    Alert.alert(
      'Link Position',
      `Send a position link request to ${user.fullName} for "${position.positionName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            setIsLinking(true);
            try {
              await entityService.linkPositionToPerson(id, user.id);
              setShowLinkModal(false);
              setSearchQuery('');
              setSearchResults([]);
              loadPosition();
              Alert.alert('Success', `Link request sent to ${user.fullName}. They will be notified.`);
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.message || 'Failed to send link request');
            } finally {
              setIsLinking(false);
            }
          },
        },
      ],
    );
  };

  const handleUnlink = () => {
    Alert.alert(
      'Unlink Position',
      'Remove the current person from this position?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            try {
              await entityService.unlinkPosition(id);
              loadPosition();
            } catch (e: any) {
              Alert.alert('Error', e?.response?.data?.message || 'Failed to unlink');
            }
          },
        },
      ],
    );
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

  if (!position) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>Position not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = position.linkStatus === 'active' ? colors.success
    : position.linkStatus === 'pending' ? colors.warning : colors.textTertiary;

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Position Hero */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconWrap}>
              <Ionicons name="briefcase" size={28} color="#fff" />
            </View>
            <Text style={styles.heroName}>{position.positionName}</Text>
            {position.positionName1 && (
              <Text style={styles.heroArabic}>{position.positionName1}</Text>
            )}
            <View style={styles.heroBadge}>
              <View style={[styles.heroStatusDot, { backgroundColor: statusColor }]} />
              <Text style={styles.heroBadgeText}>
                {position.linkStatus === 'active' ? 'Linked' : position.linkStatus === 'pending' ? 'Pending' : 'Vacant'}
              </Text>
            </View>
            <Text style={styles.heroCode}>{position.idCode}</Text>
          </LinearGradient>
        </View>

        {/* Organization */}
        {position.organization && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ORGANIZATION</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="business-outline" size={16} color={colors.textTertiary} />
                <Text style={styles.infoText}>
                  {position.organization.commercialName || position.organization.formalName}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Details */}
        {position.positionDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            <View style={styles.infoCard}>
              <Text style={styles.descText}>{position.positionDescription}</Text>
            </View>
          </View>
        )}

        {/* Contact */}
        {(position.emailAddress || position.telephoneNumber) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT</Text>
            <View style={styles.infoCard}>
              {position.emailAddress && (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={16} color={colors.textTertiary} />
                  <Text style={styles.infoText}>{position.emailAddress}</Text>
                </View>
              )}
              {position.telephoneNumber && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color={colors.textTertiary} />
                  <Text style={styles.infoText}>{position.telephoneNumber}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Authorization */}
        {(position.positionProfile?.length > 0 || position.delegationSubjects?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AUTHORIZATION</Text>
            <View style={styles.infoCard}>
              {position.positionProfile?.length > 0 && (
                <View style={styles.chipsSection}>
                  <Text style={styles.chipsLabel}>Profile</Text>
                  <View style={styles.chipsRow}>
                    {position.positionProfile.map((p: string) => (
                      <View key={p} style={styles.chip}>
                        <Text style={styles.chipText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {position.delegationSubjects?.length > 0 && (
                <View style={[styles.chipsSection, { marginTop: spacing.sm }]}>
                  <Text style={styles.chipsLabel}>Delegation</Text>
                  <View style={styles.chipsRow}>
                    {position.delegationSubjects.map((d: string) => (
                      <View key={d} style={[styles.chip, styles.chipDelegation]}>
                        <Text style={[styles.chipText, { color: colors.warning }]}>{d}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {position.canDelegateOthers && (
                <View style={[styles.infoRow, { marginTop: spacing.sm }]}>
                  <Ionicons name="shield-checkmark" size={16} color={colors.success} />
                  <Text style={styles.infoText}>Can delegate to others</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Link Action */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSON ASSIGNMENT</Text>
          {position.linkStatus === 'vacant' ? (
            <TouchableOpacity
              style={styles.assignBtn}
              onPress={() => setShowLinkModal(true)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={gradients.primary} style={styles.assignBtnGradient}>
                <Ionicons name="person-add-outline" size={18} color="#fff" />
                <Text style={styles.assignBtnText}>Assign User to Position</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.linkedCard}>
              <View style={styles.linkedInfo}>
                <Ionicons name="person-circle" size={32} color={statusColor} />
                <View>
                  <Text style={styles.linkedLabel}>
                    {position.linkStatus === 'pending' ? 'Pending acceptance from:' : 'Linked to:'}
                  </Text>
                  <Text style={styles.linkedId}>{position.linkedNaturalId}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.unlinkBtn} onPress={handleUnlink}>
                <Ionicons name="close-circle-outline" size={20} color={colors.error} />
                <Text style={styles.unlinkText}>Unlink</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Link User Modal */}
      <Modal visible={showLinkModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowLinkModal(false); setSearchQuery(''); setSearchResults([]); }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Assign User</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalSearch}>
            <Ionicons name="search" size={18} color={colors.textTertiary} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search by name, phone, or IDGate code..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>

          <Text style={styles.modalHint}>
            Only personal accounts (non-organization) are shown
          </Text>

          <ScrollView style={styles.modalResults} keyboardShouldPersistTaps="handled">
            {isSearching && (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: spacing.lg }} />
            )}

            {!isSearching && searchResults.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userRow}
                onPress={() => handleLinkUser(user)}
                activeOpacity={0.7}
                disabled={isLinking}
              >
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.fullName}</Text>
                  <Text style={styles.userCode}>{user.idCode}</Text>
                </View>
                <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              </TouchableOpacity>
            ))}

            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <View style={styles.noResults}>
                <Ionicons name="person-outline" size={36} color={colors.textTertiary} />
                <Text style={styles.noResultsText}>No users found</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Position</Text>
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
  errorText: { ...typography.body, color: colors.textTertiary },
  content: { padding: spacing.md },
  // Hero
  heroCard: { borderRadius: borderRadius.xxl, overflow: 'hidden', ...shadows.md, marginBottom: spacing.lg },
  heroGradient: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md },
  heroIconWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm,
  },
  heroName: { ...typography.h2, color: '#fff', textAlign: 'center' },
  heroArabic: { ...typography.body, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full, marginTop: spacing.md,
  },
  heroStatusDot: { width: 8, height: 8, borderRadius: 4 },
  heroBadgeText: { ...typography.caption, color: '#fff' },
  heroCode: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: spacing.xs },
  // Sections
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.overline, color: colors.textTertiary, marginBottom: spacing.sm, marginLeft: spacing.xs },
  infoCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.md, ...shadows.xs },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 3 },
  infoText: { ...typography.body, color: colors.text },
  descText: { ...typography.body, color: colors.textSecondary, lineHeight: 20 },
  // Chips
  chipsSection: {},
  chipsLabel: { ...typography.caption, color: colors.textTertiary, marginBottom: 4 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { backgroundColor: colors.background, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  chipDelegation: { backgroundColor: 'rgba(245, 158, 11, 0.08)' },
  chipText: { ...typography.caption, color: colors.textSecondary },
  // Assign
  assignBtn: { marginTop: spacing.xs },
  assignBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, height: 50, borderRadius: borderRadius.lg,
  },
  assignBtnText: { ...typography.button, color: '#fff' },
  // Linked
  linkedCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    padding: spacing.md, ...shadows.xs,
  },
  linkedInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  linkedLabel: { ...typography.caption, color: colors.textSecondary },
  linkedId: { ...typography.bodySmall, color: colors.text, marginTop: 1 },
  unlinkBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  unlinkText: { ...typography.bodySmall, color: colors.error },
  // Modal
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalSearch: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, margin: spacing.md,
    paddingHorizontal: spacing.md, height: 44, borderRadius: borderRadius.lg,
    ...shadows.xs,
  },
  modalSearchInput: { flex: 1, ...typography.body, color: colors.text },
  modalHint: { ...typography.caption, color: colors.textTertiary, marginHorizontal: spacing.md, marginBottom: spacing.sm },
  modalResults: { flex: 1, paddingHorizontal: spacing.md },
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.xl,
    padding: spacing.md, marginBottom: spacing.sm, ...shadows.xs,
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primaryGhost, justifyContent: 'center', alignItems: 'center',
  },
  userAvatarText: { ...typography.bodyMedium, color: colors.primary },
  userInfo: { flex: 1 },
  userName: { ...typography.bodyMedium, color: colors.text },
  userCode: { ...typography.caption, color: colors.textTertiary, marginTop: 1 },
  noResults: { alignItems: 'center', paddingTop: spacing.xl, gap: spacing.sm },
  noResultsText: { ...typography.body, color: colors.textTertiary },
});
