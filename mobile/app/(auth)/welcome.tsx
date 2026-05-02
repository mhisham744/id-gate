import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4f46e5', '#6366f1', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.heroContent}>
            {/* Animated logo */}
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Ionicons name="shield-checkmark" size={44} color="#fff" />
              </View>
            </View>
            <Text style={styles.appName}>IDGate</Text>
            <Text style={styles.tagline}>{t('auth.tagline')}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomHeading}>Create your account as</Text>

        {/* Account type selection */}
        <View style={styles.accountTypes}>
          <TouchableOpacity
            style={styles.accountTypeCard}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(auth)/register', params: { type: 'personal' } })}
          >
            <View style={[styles.accountTypeIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="person" size={24} color={colors.naturalCharacter} />
            </View>
            <Text style={styles.accountTypeTitle}>Personal</Text>
            <Text style={styles.accountTypeDesc}>Individual verified identity</Text>
            <Ionicons name="arrow-forward-circle" size={22} color={colors.primary} style={styles.accountTypeArrow} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountTypeCard}
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/(auth)/register', params: { type: 'organization' } })}
          >
            <View style={[styles.accountTypeIcon, { backgroundColor: 'rgba(6, 182, 212, 0.1)' }]}>
              <Ionicons name="business" size={24} color={colors.legalEntity} />
            </View>
            <Text style={styles.accountTypeTitle}>Organization</Text>
            <Text style={styles.accountTypeDesc}>Company or institution</Text>
            <Ionicons name="arrow-forward-circle" size={22} color={colors.legalEntity} style={styles.accountTypeArrow} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? {t('auth.login')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroGradient: {
    flex: 0.5,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: { flex: 1 },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoOuter: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    ...typography.hero,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  bottomCard: {
    flex: 0.5,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    justifyContent: 'center',
  },
  bottomHeading: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  accountTypes: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  accountTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  accountTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountTypeTitle: { ...typography.bodyMedium, color: colors.text, fontWeight: '600' },
  accountTypeDesc: { ...typography.caption, color: colors.textTertiary },
  accountTypeArrow: { marginLeft: 'auto' },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
  },
});
