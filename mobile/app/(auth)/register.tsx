import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { authService } from '../../src/services/auth.service';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality1: '',
    residenceCountry: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!form.firstName || !form.lastName) {
        setError('Please enter your name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.phoneNumber || !form.email) {
        setError('Phone and email are required');
        return;
      }
      setStep(3);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestOtp(form.phoneNumber);
    } catch (err) {
      console.warn('OTP request failed, proceeding:', err);
    } finally {
      setIsLoading(false);
    }

    router.push({
      pathname: '/(auth)/verify-otp',
      params: { ...form, type: type || 'personal' },
    });
  };

  const renderInput = (
    icon: keyof typeof Ionicons.glyphMap,
    placeholder: string,
    field: string,
    options: { keyboard?: any; secure?: boolean; autoComplete?: any } = {}
  ) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color={colors.textTertiary} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        value={(form as any)[field]}
        onChangeText={(v) => updateField(field, v)}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={options.keyboard}
        secureTextEntry={options.secure}
        autoComplete={options.autoComplete}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>

            {/* Step indicators */}
            <View style={styles.stepRow}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.stepDot,
                    s === step && styles.stepDotActive,
                    s < step && styles.stepDotDone,
                  ]}
                />
              ))}
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.stepLabel}>Step {step} of 3</Text>
            <Text style={styles.title}>
              {step === 1
                ? 'Personal details'
                : step === 2
                ? 'Contact info'
                : 'Secure your account'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Tell us your name and origin'
                : step === 2
                ? 'How can we reach you?'
                : 'Create a strong password'}
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Form steps */}
          <View style={styles.form}>
            {step === 1 && (
              <>
                {renderInput('person-outline', 'First name', 'firstName', { autoComplete: 'given-name' })}
                {renderInput('person-outline', 'Last name', 'lastName', { autoComplete: 'family-name' })}
                {renderInput('flag-outline', 'Nationality', 'nationality1')}
                {renderInput('globe-outline', 'Country of residence', 'residenceCountry')}
              </>
            )}
            {step === 2 && (
              <>
                {renderInput('call-outline', 'Phone number', 'phoneNumber', { keyboard: 'phone-pad', autoComplete: 'tel' })}
                {renderInput('mail-outline', 'Email address', 'email', { keyboard: 'email-address', autoComplete: 'email' })}
              </>
            )}
            {step === 3 && (
              <>
                {renderInput('lock-closed-outline', 'Password (min 8 chars)', 'password', { secure: true, autoComplete: 'new-password' })}
                {renderInput('lock-closed-outline', 'Confirm password', 'confirmPassword', { secure: true })}
              </>
            )}
          </View>

          {/* Action */}
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.buttonDisabled]}
            onPress={step < 3 ? handleNext : handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.nextButtonText}>
                {isLoading ? 'Creating account...' : step < 3 ? 'Continue' : 'Create Account'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  stepRow: { flexDirection: 'row', gap: spacing.sm },
  stepDot: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  stepDotActive: { backgroundColor: colors.primary, width: 48 },
  stepDotDone: { backgroundColor: colors.success },
  header: { marginBottom: spacing.lg },
  stepLabel: { ...typography.overline, color: colors.primary, marginBottom: spacing.xs },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },
  form: { gap: spacing.md, marginBottom: spacing.xl },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    height: 56,
    ...shadows.xs,
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    height: '100%',
  },
  nextButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: spacing.sm,
  },
  nextButtonText: { ...typography.button, color: '#fff' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  footerLink: { ...typography.body, color: colors.primary, fontWeight: '700' },
});
