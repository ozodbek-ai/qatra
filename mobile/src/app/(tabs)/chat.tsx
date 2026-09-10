import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import {
  ChatConversation,
  getChatConversations,
} from "@/services/chat.service";

import ChatAvatar from "@/components/chat/ChatAvatar";

import {
  connectSocket,
  getSocket,
} from "@/services/socket.service";


export default function ChatScreen() {
  const router = useRouter();

  const [conversations, setConversations] =
    useState<ChatConversation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadConversations =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await getChatConversations();

        setConversations(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Suhbatlarni yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);

    useEffect(() => {
  let isActive = true;

  const handleNewMessage = (): void => {
    if (!isActive) {
      return;
    }

    void loadConversations();
  };

  const setupSocket = async (): Promise<void> => {
    try {
      let socket = getSocket();

      if (!socket) {
        socket = await connectSocket();
      }

      if (!socket || !isActive) {
        return;
      }

      socket.off(
        "message:new",
        handleNewMessage
      );

      socket.on(
        "message:new",
        handleNewMessage
      );
    } catch (error: unknown) {
      console.log(
        "Chat socket listener xatoligi:",
        error
      );
    }
  };

  void setupSocket();

  return () => {
    isActive = false;

    const socket = getSocket();

    socket?.off(
      "message:new",
      handleNewMessage
    );
  };
}, [loadConversations]);


useFocusEffect(
  useCallback(() => {
    loadConversations();
  }, [loadConversations])
);


  const handleRefresh = () => {
    setRefreshing(true);

    loadConversations();
  };


  const formatLastMessage = (
    conversation: ChatConversation
  ) => {
    if (!conversation.lastMessage) {
      return "Hali xabar yo'q";
    }

    if (conversation.lastMessage.text) {
      return conversation.lastMessage.text;
    }

    if (conversation.lastMessage.reelId) {
      return "🎬 Reel yuborildi";
    }

    return "Yangi xabar";
  };


  const renderConversation = ({
    item,
  }: {
    item: ChatConversation;
  }) => {
    const user =
      item.otherUser;


    return (
      <Pressable
        style={styles.conversation}
        onPress={() =>
          router.push({
            pathname: "/chat/[id]",
            params: {
              id: item.id,
            },
          })
        }
      >
       <ChatAvatar
  fullName={user?.fullName}
  avatarUrl={user?.avatarUrl}
  size={54}
/>

        <View style={styles.conversationContent}>
          <View style={styles.topRow}>
            <Text
              style={styles.userName}
              numberOfLines={1}
            >
              {user?.fullName ||
                "Foydalanuvchi"}
            </Text>

            {item.unreadCount &&
            item.unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text
                  style={styles.unreadText}
                >
                  {item.unreadCount}
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={[
              styles.lastMessage,

              item.unreadCount &&
              item.unreadCount > 0
                ? styles.unreadMessage
                : null,
            ]}
            numberOfLines={1}
          >
            {formatLastMessage(item)}
          </Text>
        </View>
      </Pressable>
    );
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Suhbatlar yuklanmoqda...
        </Text>
      </View>
    );
  }


  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Xatolik yuz berdi
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            loadConversations();
          }}
        >
          <Text style={styles.retryText}>
            Qayta urinish
          </Text>
        </Pressable>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Chat
          </Text>

          <Text style={styles.subtitle}>
            Suhbatlaringiz
          </Text>
        </View>

        <Pressable
          style={styles.newChatButton}
          onPress={() =>
            router.push("/chat/new")
          }
        >
          <Text style={styles.newChatIcon}>
            +
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          conversations.length === 0
            ? styles.emptyList
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              💬
            </Text>

            <Text style={styles.emptyTitle}>
              Hali suhbatlar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Yangi foydalanuvchi bilan
              suhbat boshlang.
            </Text>

            <Pressable
              style={styles.startButton}
              onPress={() =>
                router.push("/chat/new")
              }
            >
              <Text style={styles.startButtonText}>
                Yangi suhbat
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 14,
    color: "#94A3B8",
    fontSize: 15,
  },

  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 3,
  },

  newChatButton: {
    width: 46,
    height: 46,
    borderRadius: 23,

    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",
  },

  newChatIcon: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "400",
    marginTop: -2,
  },

  list: {
    paddingBottom: 20,
  },

  conversation: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
  },

  conversationContent: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userName: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",

    marginRight: 10,
  },

  lastMessage: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 5,
  },

  unreadMessage: {
    color: "#CBD5E1",
    fontWeight: "600",
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,

    paddingHorizontal: 6,

    backgroundColor: "#3B82F6",

    justifyContent: "center",
    alignItems: "center",
  },

  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 35,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 15,

    textAlign: "center",

    lineHeight: 22,

    marginTop: 8,
  },

  startButton: {
    marginTop: 24,

    backgroundColor: "#3B82F6",

    paddingHorizontal: 22,
    paddingVertical: 13,

    borderRadius: 12,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  errorText: {
    color: "#94A3B8",
    fontSize: 14,

    textAlign: "center",

    marginTop: 10,
  },

  retryButton: {
    marginTop: 22,

    backgroundColor: "#3B82F6",

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});