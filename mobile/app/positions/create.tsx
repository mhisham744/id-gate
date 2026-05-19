import { useEffect, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';

type Org = { id: string; commercialName?: string; formalName: string };
type StructureNode = { id: string; name: string; description?: string; level: number; structureType: string };

const STRUCTURE_TYPES = [
  { key: 'organizational', label: 'Organizational', icon: 'people-outline' as const },
  { key: 'management', label: 'Management', icon: 'git-branch-outline' as const },
  { key: 'function', label: 'Function', icon: 'grid-outline' as const },
  { key: 'geographical', label: 'Geographical', icon: 'globe-outline' as const },
];

export default function CreatePositionScreen() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [structure, setStructure] = useState<StructureNode[]>([]);
  const [isLoadingStructure, setIsLoadingStructure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [positionName, setPositionName] = useState('');
  const [positionName1, setPositionName1] = useState('');
  const [positionDescription, setPositionDescription] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [selectedStructure, setSelectedStructure] = useState<{
    organizational?: string; management?: string; function?: string; geographical?: string;
  }>({});
  const [canDelegateOthers, setCanDelegateOthers] = useState(false);
  const [delegationSubjects, setDelegationSubjects] = useState('');
  const [positionProfile, setPositionProfile] = useState('');

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    if (selectedOrgId) loadStructure(selectedOrgId);
  }, [selectedOrgId]);

  const loadOrgs = async () => {
    try {
      const data = await entityService.getMyOrganizations();
      if (Array.isArray(data)) setOrgs(data);
      else if (data?.data) setOrgs(data.data);
    } catch (e) {
      console.warn('Failed to load orgs:', e);
    }
  };

  const loadStructure = async (orgId: string) => {
    setIsLoadingStructure(true);
    try {
      const data = await entityService.getOrgStructure(orgId);
      if (Array.isArray(data)) setStructure(data);
      else if (data?.data) setStructure(data.data);
      else setStructure([]);
    } catch (e) {
      setStructure([]);
    } finally {
      setIsLoadingStructure(false);
    }
  };

  const handleStructureSelect = (type: string, nodeId: string) => {
    setSelectedStructure((prev) => ({
      ...prev,
      [type]: prev[type as keyof typeof prev] === nodeId ? undefined : nodeId,
    }));
  };

  const getNodesByType = (type: string) => structure.filter((n) => n.structureType === type);

  const handleSubmit = async () => {
    if (!selectedOrgId) {
      Alert.alert('Error', 'Please select an organization');
      return;
    }
    if (!positionName.trim()) {
      Alert.alert('Error', 'Position name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await entityService.createPosition(selectedOrgId, {
        positionName: positionName.trim(),
        positionName1: positionName1.trim() || undefined,
        positionDescription: positionDescription.trim() || undefined,
        emailAddress: emailAddress.trim() || undefined,
        telephoneNumber: telephoneNumber.trim() || undefined,
        orgStructureNodeId: selectedStructure.organizational || undefined,
        managementStructureNodeId: selectedStructure.management || undefined,
        functionStructureNodeId: selectedStructure.function || undefined,
        geographicalStructureNodeId: selectedStructure.geographical || undefined,
        canDelegateOthers,
        delegationSubjects: delegationSubjects.trim() ? delegationSubjects.split(',').map((s) => s.trim()) : undefined,
        positionProfile: positionProfile.trim() ? positionProfile.split(',').map((s) => s.trim()) : undefined,
      });
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create position');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Position</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Organization Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORGANIZATION</Text>
          <View style={styles.orgList}>
            {orgs.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={[styles.orgChip, selectedOrgId === org.id && styles.orgChipSelected]}
                onPress={() => setSelectedOrgId(org.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="business"
                  size={14}
                  color={selectedOrgId === org.id ? colors.primary : colors.textTertiary}
                />
                <Text style={[styles.orgChipText, selectedOrgId === org.id && styles.orgChipTextSelected]}>
                  {org.commercialName || org.formalName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>POSITION DETAILS</Text>
          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Position Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Finance Director"
                placeholderTextColor={colors.textTertiary}
                value={positionName}
                onChangeText={setPositionName}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Arabic Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. المدير المالى"
                placeholderTextColor={colors.textTertiary}
                value={positionName1}
                onChangeText={setPositionName1}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                placeholder="Role responsibilities..."
                placeholderTextColor={colors.textTertiary}
                value={positionDescription}
                onChangeText={setPositionDescription}
                multiline
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="position@org.com"
                placeholderTextColor={colors.textTertiary}
                value={emailAddress}
                onChangeText={setEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+20..."
                placeholderTextColor={colors.textTertiary}
                value={telephoneNumber}
                onChangeText={setTelephoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Structure Assignment */}
        {selectedOrgId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>STRUCTURE ASSIGNMENT</Text>
            <Text style={styles.sectionDesc}>Assign this position to structure nodes</Text>

            {isLoadingStructure ? (
              <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: spacing.md }} />
            ) : (
              STRUCTURE_TYPES.map(({ key, label, icon }) => {
                const nodes = getNodesByType(key);
                if (nodes.length === 0) return null;

                return (
                  <View key={key} style={styles.structureGroup}>
                    <View style={styles.structureHeader}>
                      <Ionicons name={icon} size={16} color={colors.primary} />
                      <Text style={styles.structureLabel}>{label}</Text>
                    </View>
                    <View style={styles.nodesList}>
                      {nodes.map((node) => {
                        const isSelected = selectedStructure[key as keyof typeof selectedStructure] === node.id;
                        return (
                          <TouchableOpacity
                            key={node.id}
                            style={[styles.nodeItem, { marginLeft: (node.level - 1) * 14 }, isSelected && styles.nodeItemSelected]}
                            onPress={() => handleStructureSelect(key, node.id)}
                            activeOpacity={0.7}
                          >
                            <View style={[styles.nodeRadio, isSelected && styles.nodeRadioSelected]}>
                              {isSelected && <View style={styles.nodeRadioDot} />}
                            </View>
                            <Text style={[styles.nodeName, isSelected && styles.nodeNameSelected]} numberOfLines={1}>
                              {node.name}
                            </Text>
                            {node.description && (
                              <Text style={styles.nodeDesc} numberOfLines={1}>{node.description}</Text>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Authorization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUTHORIZATION & PROFILE</Text>
          <View style={styles.formCard}>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Position Profile (comma-separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. admin, finance, hr"
                placeholderTextColor={colors.textTertiary}
                value={positionProfile}
                onChangeText={setPositionProfile}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Delegation Subjects (comma-separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Payment Approvals, Staff Hiring"
                placeholderTextColor={colors.textTertiary}
                value={delegationSubjects}
                onChangeText={setDelegationSubjects}
              />
            </View>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setCanDelegateOthers(!canDelegateOthers)}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleLabel}>Can Delegate Others</Text>
              <View style={[styles.toggle, canDelegateOthers && styles.toggleActive]}>
                <View style={[styles.toggleDot, canDelegateOthers && styles.toggleDotActive]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
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
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.submitBtnText}>Create Position</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
  content: { padding: spacing.md },
  // Sections
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.overline, color: colors.textTertiary, marginBottom: spacing.sm, marginLeft: spacing.xs },
  sectionDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs },
  // Org picker
  orgList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  orgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  orgChipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryGhost },
  orgChipText: { ...typography.bodySmall, color: colors.textSecondary },
  orgChipTextSelected: { color: colors.primary, fontWeight: '600' },
  // Form
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.xs,
  },
  field: { marginBottom: spacing.md },
  fieldLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: 2 },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...typography.body,
    color: colors.text,
  },
  // Structure
  structureGroup: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  structureHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  structureLabel: { ...typography.bodyMedium, color: colors.text },
  nodesList: { gap: 3 },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  nodeItemSelected: { backgroundColor: colors.primaryGhost },
  nodeRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeRadioSelected: { borderColor: colors.primary },
  nodeRadioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary },
  nodeName: { ...typography.bodySmall, color: colors.text, flex: 1 },
  nodeNameSelected: { color: colors.primary, fontWeight: '600' },
  nodeDesc: { ...typography.caption, color: colors.textTertiary, fontSize: 10, maxWidth: 80 },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  toggleLabel: { ...typography.body, color: colors.text },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: { backgroundColor: colors.primary },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleDotActive: { alignSelf: 'flex-end' },
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
});
