import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/theme';
import { useConversationStore } from '../../src/stores/conversation.store';
import { useAuthStore } from '../../src/stores/auth.store';
import type { Message } from '@idgate/shared';

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage } = useConversationStore();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const chatMessages = messages[id] || [];

  useEffect(() => {
    if (id) fetchMessages(id);
  }, [id, fetchMessages]);

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setText('');
    try {
      await sendMessage(id, 'text', content);
    } catch (e) {
      console.warn('Send failed:', e);
    } finally {
      setSending(false);
    }
  }, [text, sending, id, sendMessage]);

  const isMe = (msg: Message) => msg.senderId === user?.id;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateSeparator = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const getMessagesWithSeparators = () => {
    const items: { type: 'date' | 'message'; data: any; key: string }[] = [];
    let lastDate = '';

    for (const msg of chatMessages) {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== lastDate) {
        lastDate = msgDate;
        items.push({ type: 'date', data: msg.createdAt, key: `date-${msgDate}` });
      }
      items.push({ type: 'message', data: msg, key: msg.id });
    }
    return items;
  };

  const renderItem = ({ item }: { item: { type: string; data: any; key: string } }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <View style={styles.datePill}>
            <Text style={styles.dateText}>{formatDateSeparator(item.data)}</Text>
          </View>
        </View>
      );
    }

    const msg = item.data as Message;
    const mine = isMe(msg);

    return (
      <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
        {!mine && chatMessages.length > 0 && (
          <View style={styles.senderInfo}>
            {msg.senderDisplayName && msg.senderType !== 'natural' && (
              <Text style={styles.senderName}>{msg.senderDisplayName}</Text>
            )}
          </View>
        )}
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{msg.content}</Text>
          <View style={styles.bubbleMeta}>
            <Text style={[styles.timeText, mine && styles.timeTextMine]}>
              {formatTime(msg.createdAt)}
            </Text>
            {mine && (
              <Ionicons
                name={msg.status === 'read' ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={msg.status === 'read' ? '#34b7f1' : 'rgba(255,255,255,0.6)'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={18} color={colors.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{name || 'Chat'}</Text>
          <Text style={styles.headerStatus}>online</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={getMessagesWithSeparators()}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={26} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              placeholderTextColor={colors.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity style={styles.emojiBtn}>
              <Ionicons name="happy-outline" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
          {text.trim() ? (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic-outline" size={24} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.xs,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryGhost,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { flex: 1, marginLeft: spacing.xs },
  headerName: { ...typography.bodyMedium, color: colors.text, fontWeight: '600' },
  headerStatus: { ...typography.caption, color: colors.success, fontSize: 11 },
  headerAction: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Messages
  messagesList: { padding: spacing.sm, paddingBottom: spacing.md },
  dateSeparator: { alignItems: 'center', marginVertical: spacing.md },
  datePill: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  dateText: { ...typography.caption, color: colors.textTertiary, fontSize: 11 },
  // Bubbles
  bubbleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 3,
    maxWidth: '80%',
  },
  bubbleRowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  senderInfo: { marginBottom: 2, marginLeft: spacing.xs },
  senderName: { ...typography.caption, color: colors.primary, fontSize: 11, fontWeight: '600' },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    maxWidth: '100%',
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    ...shadows.xs,
  },
  bubbleText: { ...typography.body, color: colors.text, lineHeight: 20 },
  bubbleTextMine: { color: '#fff' },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 2,
  },
  timeText: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
  timeTextMine: { color: 'rgba(255,255,255,0.7)' },
  // Input
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: spacing.xs,
  },
  attachBtn: { paddingBottom: 6 },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 22,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    minHeight: 40,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingTop: 0,
    paddingBottom: 0,
  },
  emojiBtn: { paddingLeft: spacing.xs, paddingBottom: 2 },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtn: { paddingBottom: 6 },
});
