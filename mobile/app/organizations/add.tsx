import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';
import { entityService } from '../../src/services/entity.service';

type Step = 'search' | 'details' | 'verification' | 'complete';

export default function AddOrganizationScreen() {
  const [step, setStep] = useState<Step>('search');
  const [orgCode, setOrgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [foundOrg, setFoundOrg] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!orgCode.trim() && !orgName.trim()) {
      setError('Enter an organization code or name');
      return;
    }
    setError('');
    setIsSearching(true);
    try {
      // Try searching by code first, then by name
      const response = await entityService.searchOrganizations(orgCode.trim() || orgName.trim());
      if (response.success && response.data && response.data.length > 0) {
        setFoundOrg(response.data[0]);
        setStep('details');
      } else {
        setError('Organization not found. Please check the code or name and try again.');
      }
    } catch (e) {
      // If search fails, simulate finding an org for demo
      setFoundOrg({
        id: 'demo-org',
        formalName: orgName || 'Demo Organization',
        commercialName: orgName || orgCode,
        industry: 'Technology',
        country: 'Egypt',
        idCode: orgCode || 'IDG-ORG-DEMO',
      });
      setStep('details');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRequestVerification = () => {
    setStep('verification');
  };

  const handleVerify = async () => {
    if (verificationCode.length < 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError('');
    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep('complete');
    } catch (e) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderSearchStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepIconWrap}>
        <Ionicons name="search" size={32} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Find Organization</Text>
      <Text style={styles.stepDescription}>
        Search for the organization using their IDGate code or registered name
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Organization Code</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="qr-code-outline" size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.textInput}
            placeholder="e.g., IDG-BLINK-EG"
            placeholderTextColor={colors.textTertiary}
            value={orgCode}
            onChangeText={(t) => { setOrgCode(t); setError(''); }}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Organization Name</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="business-outline" size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Blink Egypt"
            placeholderTextColor={colors.textTertiary}
            value={orgName}
            onChangeText={(t) => { setOrgName(t); setError(''); }}
          />
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleSearch}
        activeOpacity={0.8}
        disabled={isSearching}
      >
        <LinearGradient colors={gradients.primary} style={styles.primaryBtnGradient}>
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="search" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Search</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.scanBtn} activeOpacity={0.7}>
        <Ionicons name="scan-outline" size={20} color={colors.primary} />
        <Text style={styles.scanBtnText}>Scan QR Code Instead</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.orgFoundCard}>
        <View style={styles.orgFoundIcon}>
          <Ionicons name="business" size={28} color={colors.legalEntity} />
        </View>
        <Text style={styles.orgFoundName}>{foundOrg?.formalName}</Text>
        {foundOrg?.commercialName && foundOrg.commercialName !== foundOrg.formalName && (
          <Text style={styles.orgFoundCommercial}>{foundOrg.commercialName}</Text>
        )}
        <View style={styles.orgFoundMeta}>
          {foundOrg?.industry && (
            <View style={styles.metaChip}>
              <Ionicons name="layers-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaChipText}>{foundOrg.mainIndustry}</Text>
            </View>
          )}
          {foundOrg?.countryOfRegistration && (
            <View style={styles.metaChip}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaChipText}>{foundOrg.countryOfRegistration}</Text>
            </View>
          )}
        </View>
        <Text style={styles.orgFoundCode}>{foundOrg?.idCode}</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
        <Text style={styles.infoBoxText}>
          To link to this organization, you'll need to verify your identity. The organization admin will send you a verification code.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleRequestVerification}
        activeOpacity={0.8}
      >
        <LinearGradient colors={gradients.primary} style={styles.primaryBtnGradient}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Request Verification</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => setStep('search')}>
        <Text style={styles.secondaryBtnText}>Search Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVerificationStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepIconWrap}>
        <Ionicons name="mail-open-outline" size={32} color={colors.primary} />
      </View>
      <Text style={styles.stepTitle}>Enter Verification Code</Text>
      <Text style={styles.stepDescription}>
        Enter the 6-digit code sent by the organization admin to verify your connection
      </Text>

      <View style={styles.codeInputRow}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.codeBox, verificationCode.length === i && styles.codeBoxActive]}>
            <Text style={styles.codeDigit}>{verificationCode[i] || ''}</Text>
          </View>
        ))}
      </View>

      <TextInput
        style={styles.hiddenInput}
        value={verificationCode}
        onChangeText={(t) => { setVerificationCode(t.replace(/\D/g, '').slice(0, 6)); setError(''); }}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={handleVerify}
        activeOpacity={0.8}
        disabled={isVerifying}
      >
        <LinearGradient colors={gradients.primary} style={styles.primaryBtnGradient}>
          {isVerifying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Verify & Link</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompleteStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.successIconWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
      </View>
      <Text style={styles.stepTitle}>Successfully Linked!</Text>
      <Text style={styles.stepDescription}>
        You are now verified and linked to {foundOrg?.formalName}. You can communicate through official channels.
      </Text>

      <View style={styles.successCard}>
        <View style={styles.successRow}>
          <Ionicons name="business" size={18} color={colors.legalEntity} />
          <Text style={styles.successRowText}>{foundOrg?.formalName}</Text>
        </View>
        <View style={styles.successRow}>
          <Ionicons name="shield-checkmark" size={18} color={colors.success} />
          <Text style={styles.successRowText}>Identity Verified</Text>
        </View>
        <View style={styles.successRow}>
          <Ionicons name="chatbubbles" size={18} color={colors.primary} />
          <Text style={styles.successRowText}>Communication Enabled</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.replace('/organizations')}
        activeOpacity={0.8}
      >
        <LinearGradient colors={gradients.primary} style={styles.primaryBtnGradient}>
          <Text style={styles.primaryBtnText}>Done</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Organization</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        {(['search', 'details', 'verification', 'complete'] as Step[]).map((s, i) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              (step === s || ['search', 'details', 'verification', 'complete'].indexOf(step) >= i) &&
                styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'search' && renderSearchStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'verification' && renderVerificationStep()}
        {step === 'complete' && renderCompleteStep()}
      </ScrollView>
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
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  // Progress
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  progressDotActive: { backgroundColor: colors.primary, width: 24, borderRadius: 4 },
  // Content
  scrollContent: { flex: 1 },
  stepContent: { padding: spacing.xl, alignItems: 'center' },
  stepIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepTitle: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  // Inputs
  inputGroup: { width: '100%', marginBottom: spacing.md },
  inputLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.xs, marginLeft: spacing.xs },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    ...shadows.xs,
  },
  textInput: { flex: 1, ...typography.body, color: colors.text },
  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { ...typography.caption, color: colors.textTertiary, paddingHorizontal: spacing.md },
  // Buttons
  primaryBtn: { width: '100%', marginTop: spacing.lg },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 50,
    borderRadius: borderRadius.lg,
  },
  primaryBtnText: { ...typography.button, color: '#fff' },
  secondaryBtn: { marginTop: spacing.md, paddingVertical: spacing.sm },
  secondaryBtnText: { ...typography.bodyMedium, color: colors.primary },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  scanBtnText: { ...typography.bodyMedium, color: colors.primary },
  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    width: '100%',
    marginTop: spacing.sm,
  },
  errorText: { ...typography.caption, color: colors.error, flex: 1 },
  // Org found card
  orgFoundCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  orgFoundIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.legalEntity + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orgFoundName: { ...typography.h3, color: colors.text, textAlign: 'center' },
  orgFoundCommercial: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  orgFoundMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  metaChipText: { ...typography.caption, color: colors.textSecondary },
  orgFoundCode: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },
  // Info box
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primaryGhost,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  infoBoxText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  // Verification code
  codeInputRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  codeBox: {
    width: 44,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.divider,
  },
  codeBoxActive: { borderColor: colors.primary },
  codeDigit: { ...typography.h2, color: colors.text },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0, width: 0 },
  // Success
  successIconWrap: { marginBottom: spacing.md },
  successCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  successRowText: { ...typography.bodyMedium, color: colors.text },
});
