import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import type { Socket } from "socket.io-client";

import {
  type ChatMessage,
  getChatMessages,
  markConversationAsRead,
  sendChatMessage,
} from "@/services/chat.service";

import { useAuth } from "@/context/AuthContext";

import {
  connectSocket,
  getSocket,
} from "@/services/socket.service";


export default function ChatDetailScreen() {
  const { user } = useAuth();

  const router = useRouter();

  const { id } = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const conversationId =
    typeof id === "string"
      ? id
      : id?.[0];

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [text, setText] =
    useState<string>("");

  const [loading, setLoading] =
    useState<boolean>(true);

  const [refreshing, setRefreshing] =
    useState<boolean>(false);

  const [sending, setSending] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  const flatListRef =
    useRef<FlatList<ChatMessage> | null>(null);


  const scrollToBottom = useCallback(
    (animated: boolean = true): void => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated,
        });
      }, 100);
    },
    []
  );


  const addMessageIfNew = useCallback(
    (newMessage: ChatMessage): void => {
      setMessages((currentMessages) => {
        const alreadyExists =
          currentMessages.some(
            (message) =>
              message.id === newMessage.id
          );

        if (alreadyExists) {
          return currentMessages;
        }

        return [
          ...currentMessages,
          newMessage,
        ];
      });
    },
    []
  );


  const loadMessages = useCallback(
    async (): Promise<void> => {
      if (!conversationId) {
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const response =
          await getChatMessages(conversationId);

        setMessages(response.data);

        await markConversationAsRead(conversationId);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Xabarlarni yuklashda xatolik yuz berdi.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [conversationId]
  );


  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);


  useEffect(() => {
    if (!conversationId) {
      return;
    }

    let isActive = true;

    let currentSocket: Socket | null =
      getSocket();


    const handleNewMessage = (
      newMessage: ChatMessage
    ): void => {
      if (
        newMessage.conversationId !==
        conversationId
      ) {
        return;
      }

      addMessageIfNew(newMessage);

      scrollToBottom(true);

      if (
        newMessage.senderId !== user?.id
      ) {
        void markConversationAsRead(
          conversationId
        );
      }
    };


    const setupSocket = async (): Promise<void> => {
      try {
        if (!currentSocket) {
          currentSocket =
            await connectSocket();
        }

        if (
          !currentSocket ||
          !isActive
        ) {
          return;
        }

        currentSocket.off(
          "message:new",
          handleNewMessage
        );

        currentSocket.on(
          "message:new",
          handleNewMessage
        );
      } catch (err: unknown) {
        console.log(
          "Socket listener ulanishida xatolik:",
          err
        );
      }
    };


    void setupSocket();


    return () => {
      isActive = false;

      currentSocket?.off(
        "message:new",
        handleNewMessage
      );
    };
  }, [
    conversationId,
    user?.id,
    addMessageIfNew,
    scrollToBottom,
  ]);


  const handleRefresh = (): void => {
    setRefreshing(true);

    void loadMessages();
  };


  const handleSend =
    async (): Promise<void> => {
      const messageText = text.trim();

      if (
        !messageText ||
        sending ||
        !conversationId
      ) {
        return;
      }

      try {
        setSending(true);
        setError(null);

        setText("");

        const response =
          await sendChatMessage(
            conversationId,
            messageText
          );

        addMessageIfNew(response.data);

        scrollToBottom(true);
      } catch (err: unknown) {
        setText(messageText);

        const message =
          err instanceof Error
            ? err.message
            : "Xabar yuborishda xatolik yuz berdi.";

        setError(message);
      } finally {
        setSending(false);
      }
    };


  const formatTime = (
    dateString: string
  ): string => {
    const date = new Date(dateString);

    return date.toLocaleTimeString(
      "uz-UZ",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  const renderMessage = ({
    item,
  }: {
    item: ChatMessage;
  }) => {
    const isMine =
      item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageRow,
          isMine
            ? styles.myMessageRow
            : styles.otherMessageRow,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine
              ? styles.myMessage
              : styles.otherMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine
                ? styles.myMessageText
                : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>

          <Text
            style={[
              styles.messageTime,
              isMine
                ? styles.myMessageTime
                : styles.otherMessageTime,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Suhbat yuklanmoqda...
        </Text>
      </View>
    );
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerInfo}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            Suhbat
          </Text>

          <Text style={styles.headerSubtitle}>
            Xabarlar
          </Text>
        </View>

        <View style={styles.headerSpace} />
      </View>

      {error ? (
        <View style={styles.errorBar}>
          <Text
            style={styles.errorText}
            numberOfLines={2}
          >
            {error}
          </Text>

          <Pressable
            onPress={() => {
              void loadMessages();
            }}
          >
            <Text style={styles.retryText}>
              Qayta
            </Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          messages.length === 0
            ? styles.emptyList
            : styles.messageList
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({
              animated: false,
            });
          }
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              💬
            </Text>

            <Text style={styles.emptyTitle}>
              Hali xabarlar yo‘q
            </Text>

            <Text style={styles.emptyText}>
              Birinchi xabarni yuboring.
            </Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Xabar yozing..."
          placeholderTextColor="#64748B"
          style={styles.input}
          multiline
          maxLength={2000}
          editable={!sending}
        />

        <Pressable
          style={[
            styles.sendButton,
            (!text.trim() || sending) &&
              styles.sendButtonDisabled,
          ]}
          onPress={() => {
            void handleSend();
          }}
          disabled={
            !text.trim() ||
            sending
          }
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.sendText}>
              ↑
            </Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#64748B",
    marginTop: 14,
  },

  header: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "300",
    marginTop: -5,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 6,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  headerSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  headerSpace: {
    width: 40,
  },

  errorBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#3F1D25",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  errorText: {
    flex: 1,
    color: "#FCA5A5",
    fontSize: 12,
    marginRight: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748B",
    marginTop: 6,
    fontSize: 14,
  },

  messageRow: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  myMessage: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },

  otherMessage: {
    backgroundColor: "#1E293B",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  myMessageText: {
    color: "#FFFFFF",
  },

  otherMessageText: {
    color: "#E2E8F0",
  },

  messageTime: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },

  myMessageTime: {
    color: "#BFDBFE",
  },

  otherMessageTime: {
    color: "#94A3B8",
  },

  inputContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#020617",
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: "#0F172A",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontSize: 15,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
});