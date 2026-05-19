import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../../src/theme';
import { entityService } from '../../../src/services/entity.service';

type StructureNode = {
  id: string;
  name: string;
  description?: string;
  level: number;
  code: string;
  structureType: string;
  parentId?: string;
};

type SelectedStructure = {
  organizational?: string;
  management?: string;
  function?: string;
  geographical?: string;
};

const STRUCTURE_TYPES = [
  { key: 'organizational', label: 'Organizational', icon: 'people-outline' as const, description: 'Membership / stakeholder category' },
  { key: 'management', label: 'Management', icon: 'git-branch-outline' as const, description: 'Management hierarchy' },
  { key: 'function', label: 'Function', icon: 'grid-outline' as const, description: 'Department / functional area' },
  { key: 'geographical', label: 'Geographical', icon: 'globe-outline' as const, description: 'Location / region' },
];

export default function JoinOrganizationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [org, setOrg] = useState<any>(null);
  const [structure, setStructure] = useState<StructureNode[]>([]);
  const [selected, setSelected] = useState<SelectedStructure>({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orgRes, structRes] = await Promise.all([
        entityService.getOrganization(id),
        entityService.getOrgStructure(id),
      ]);
      
      if (orgRes?.data) setOrg(orgRes.data);
      else if (orgRes && !orgRes.data) setOrg(orgRes);

      if (Array.isArray(structRes)) setStructure(structRes);
      else if (structRes?.data) setStructure(structRes.data);
      else setStructure([]);
    } catch (error) {
      console.warn('Failed to load org data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNodesByType = (type: string) => {
    return structure.filter((n) => n.structureType === type);
  };

  const handleSelect = (type: string, nodeId: string) => {
    setSelected((prev) => ({
      ...prev,
      [type]: prev[type as keyof SelectedStructure] === nodeId ? undefined : nodeId,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await entityService.createJoinRequest(id, {
        message: message.trim() || undefined,
        selectedStructure: selected,
      });
      setSubmitted(true);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to submit request';
      Alert.alert('Error', msg);
    } finally {
      setIsSubmitting(false);
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

  if (!org) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
          <Text style={styles.errorText}>Organization not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          </View>
          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={styles.successDesc}>
            Your join request has been sent to {org.commercialName || org.formalName}. You'll be notified when an admin reviews it.
          </Text>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace('/organizations')}
            activeOpacity={0.8}
          >
            <LinearGradient colors={gradients.primary} style={styles.doneBtnGradient}>
              <Text style={styles.doneBtnText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Organization Hero */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#06b6d4', '#0891b2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconWrap}>
              <Ionicons name="business" size={28} color="#fff" />
            </View>
            <Text style={styles.heroName}>{org.commercialName || org.formalName}</Text>
            {org.formalName !== org.commercialName && (
              <Text style={styles.heroFormal}>{org.formalName}</Text>
            )}
            <View style={styles.heroMeta}>
              {org.mainIndustry && (
                <View style={styles.heroBadge}>
                  <Ionicons name="layers-outline" size={12} color="#fff" />
                  <Text style={styles.heroBadgeText}>{org.mainIndustry}</Text>
                </View>
              )}
              {org.countryOfRegistration && (
                <View style={styles.heroBadge}>
                  <Ionicons name="location-outline" size={12} color="#fff" />
                  <Text style={styles.heroBadgeText}>{org.countryOfRegistration}</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroCode}>{org.idCode}</Text>
          </LinearGradient>
        </View>

        {/* Quick Info */}
        {(org.email || org.website || org.phoneNumber) && (
          <View style={styles.section}>
            <View style={styles.infoCard}>
              {org.email && (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={16} color={colors.textTertiary} />
                  <Text style={styles.infoText}>{org.email}</Text>
                </View>
              )}
              {org.phoneNumber && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color={colors.textTertiary} />
                  <Text style={styles.infoText}>{org.phoneNumber}</Text>
                </View>
              )}
              {org.website && (
                <View style={styles.infoRow}>
                  <Ionicons name="globe-outline" size={16} color={colors.textTertiary} />
                  <Text style={styles.infoText}>{org.website}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Structure Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT YOUR PLACEMENT</Text>
          <Text style={styles.sectionDesc}>
            Choose where you belong in the organization structure (optional)
          </Text>

          {STRUCTURE_TYPES.map(({ key, label, icon, description }) => {
            const nodes = getNodesByType(key);
            if (nodes.length === 0) return null;

            const selectedNode = nodes.find((n) => n.id === selected[key as keyof SelectedStructure]);

            return (
              <View key={key} style={styles.structureGroup}>
                <View style={styles.structureHeader}>
                  <Ionicons name={icon} size={18} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.structureLabel}>{label}</Text>
                    <Text style={styles.structureDesc}>{description}</Text>
                  </View>
                  {selectedNode && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={12} color={colors.success} />
                    </View>
                  )}
                </View>

                <View style={styles.nodesList}>
                  {nodes.map((node) => {
                    const isSelected = selected[key as keyof SelectedStructure] === node.id;
                    return (
                      <TouchableOpacity
                        key={node.id}
                        style={[
                          styles.nodeItem,
                          { marginLeft: (node.level - 1) * 16 },
                          isSelected && styles.nodeItemSelected,
                        ]}
                        onPress={() => handleSelect(key, node.id)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.nodeRadio, isSelected && styles.nodeRadioSelected]}>
                          {isSelected && <View style={styles.nodeRadioDot} />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.nodeName, isSelected && styles.nodeNameSelected]}>
                            {node.name}
                          </Text>
                          {node.description && (
                            <Text style={styles.nodeDescription}>{node.description}</Text>
                          )}
                        </View>
                        {node.level > 1 && (
                          <Text style={styles.nodeLevel}>L{node.level}</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MESSAGE (OPTIONAL)</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Add a message to the organization admin..."
            placeholderTextColor={colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <LinearGradient colors={gradients.primary} style={styles.submitBtnGradient}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                <Text style={styles.submitBtnText}>Submit Join Request</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Join Organization</Text>
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
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
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
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroName: { ...typography.h2, color: '#fff', textAlign: 'center' },
  heroFormal: { ...typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  heroMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  heroBadgeText: { ...typography.caption, color: '#fff' },
  heroCode: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: spacing.sm },
  // Info
  section: { marginBottom: spacing.lg },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.xs,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.textSecondary },
  // Structure sections
  sectionTitle: {
    ...typography.overline,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  sectionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  structureGroup: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  structureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  structureLabel: { ...typography.bodyMedium, color: colors.text },
  structureDesc: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodesList: { gap: 4 },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  nodeItemSelected: { backgroundColor: colors.primaryGhost },
  nodeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeRadioSelected: { borderColor: colors.primary },
  nodeRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  nodeName: { ...typography.body, color: colors.text },
  nodeNameSelected: { color: colors.primary, fontWeight: '600' },
  nodeDescription: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  nodeLevel: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
  // Message
  messageInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    ...shadows.xs,
  },
  // Submit
  submitBtn: { marginTop: spacing.sm },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: borderRadius.lg,
  },
  submitBtnText: { ...typography.button, color: '#fff' },
  // Success
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  successIcon: { marginBottom: spacing.md },
  successTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  successDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', maxWidth: 300, marginBottom: spacing.xl },
  doneBtn: { width: '100%' },
  doneBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: borderRadius.lg,
  },
  doneBtnText: { ...typography.button, color: '#fff' },
});
