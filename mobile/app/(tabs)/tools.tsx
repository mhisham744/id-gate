import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface ToolItem {
  key: string;
  icon: IoniconsName;
  label: string;
  color: string;
  bg: string;
}

const TOOLS: ToolItem[] = [
  { key: 'meetings', icon: 'videocam', label: 'Meetings', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { key: 'conference', icon: 'mic', label: 'Conference', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { key: 'calendar', icon: 'calendar', label: 'Calendar', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
  { key: 'tasks', icon: 'checkbox', label: 'Tasks', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { key: 'projects', icon: 'rocket', label: 'Projects', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { key: 'reminders', icon: 'alarm', label: 'Reminders', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  { key: 'notes', icon: 'document-text', label: 'Notes', color: '#14b8a6', bg: 'rgba(20,184,166,0.08)' },
  { key: 'vacancy', icon: 'briefcase', label: 'Vacancy', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  { key: 'todoList', icon: 'list', label: 'To-Do', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
];

export default function ToolsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Tools</Text>
      </View>

      <View style={styles.list}>
        {TOOLS.map((tool) => (
          <TouchableOpacity key={tool.key} style={styles.toolRow} activeOpacity={0.6}>
            <View style={[styles.toolIcon, { backgroundColor: tool.bg }]}>
              <Ionicons name={tool.icon} size={18} color={tool.color} />
            </View>
            <Text style={styles.toolName}>{tool.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  screenHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  screenTitle: { ...typography.h1, color: colors.text },
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.xs,
  },
  toolIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolName: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
});
