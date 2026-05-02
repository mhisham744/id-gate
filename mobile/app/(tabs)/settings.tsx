import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/stores/auth.store';
import { colors, spacing, typography, borderRadius, shadows, gradients } from '../../src/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface SettingsItem {
  key: string;
  icon: IoniconsName;
  label: string;
  color?: string;
}

const SETTINGS_SECTIONS: { title: string; items: SettingsItem[] }[] = [
  {
    title: 'IDENTITY',
    items: [
      { key: 'profile', icon: 'person-outline', label: 'Profile', color: colors.primary },
      { key: 'positions', icon: 'briefcase-outline', label: 'Positions', color: colors.virtualCharacter },
      { key: 'organizations', icon: 'business-outline', label: 'Organizations', color: colors.legalEntity },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { key: 'teams', icon: 'people-outline', label: 'Teams' },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { key: 'language', icon: 'globe-outline', label: 'Language' },
      { key: 'privacy', icon: 'eye-off-outline', label: 'Privacy' },
      { key: 'security', icon: 'shield-checkmark-outline', label: 'Security' },
      { key: 'about', icon: 'information-circle-outline', label: 'About' },
    ],
  },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, logout, accountType } = useAuthStore();
  const isPersonal = accountType === 'personal';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleSettingsPress = (key: string) => {
    if (key === 'positions' && isPersonal) return;
    if (key === 'organizations') {
      router.push('/organizations');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile card */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileGradient}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {user?.firstName?.[0] || 'U'}
              {user?.lastName?.[0] || ''}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </Text>
          <View style={styles.profileBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#fff" />
            <Text style={styles.profileBadgeText}>Verified Identity</Text>
          </View>
          <Text style={styles.profileCode}>{user?.idCode || 'IDG-XXXXXXXXXX'}</Text>
        </LinearGradient>
      </View>

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => {
              const disabled = item.key === 'positions' && isPersonal;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.settingsRow,
                    idx < section.items.length - 1 && styles.settingsRowBorder,
                    disabled && styles.settingsRowDisabled,
                  ]}
                  activeOpacity={disabled ? 1 : 0.6}
                  onPress={() => handleSettingsPress(item.key)}
                >
                  <View style={[styles.settingsIconWrap, { backgroundColor: (item.color || colors.textTertiary) + '12' }]}>
                    <Ionicons name={item.icon} size={20} color={disabled ? colors.textTertiary : (item.color || colors.textSecondary)} />
                  </View>
                  <Text style={[styles.settingsLabel, disabled && styles.settingsLabelDisabled]}>{item.label}</Text>
                  {disabled ? (
                    <Text style={styles.disabledBadge}>N/A</Text>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  profileCard: {
    margin: spacing.md,
    marginTop: spacing.xxl,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  profileGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileAvatarText: { ...typography.h1, color: '#fff' },
  profileName: { ...typography.h2, color: '#fff', marginBottom: spacing.xs },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
  },
  profileBadgeText: { ...typography.caption, color: '#fff' },
  profileCode: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  sectionTitle: {
    ...typography.overline,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsLabel: { ...typography.bodyMedium, color: colors.text, flex: 1 },
  settingsRowDisabled: { opacity: 0.5 },
  settingsLabelDisabled: { color: colors.textTertiary },
  disabledBadge: {
    ...typography.caption,
    color: colors.textTertiary,
    backgroundColor: colors.divider,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
  },
  logoutText: { ...typography.button, color: colors.error },
});
