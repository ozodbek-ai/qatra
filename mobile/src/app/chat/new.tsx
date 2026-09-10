import {
  ActivityIndicator,
  FlatList,
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
  useState,
} from "react";

import { useRouter } from "expo-router";

import {
  ChatUser,
  createChatConversation,
  getChatUsers,
} from "@/services/chat.service";

import ChatAvatar from "@/components/chat/ChatAvatar";


export default function NewChatScreen() {
  const router = useRouter();

  const [users, setUsers] =
    useState<ChatUser[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [creatingUserId, setCreatingUserId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  const loadUsers =
    useCallback(
      async (searchValue = "") => {
        try {
          setError(null);

          const response =
            await getChatUsers(searchValue);

          setUsers(response.data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Foydalanuvchilarni yuklashda xatolik yuz berdi."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );


useEffect(() => {
  if (!search.trim()) {
    loadUsers("");
    return;
  }

  const timeout = setTimeout(() => {
    loadUsers(search.trim());
  }, 400);

  return () => {
    clearTimeout(timeout);
  };
}, [search, loadUsers]);


  const handleRefresh = () => {
    setRefreshing(true);

    loadUsers(search);
  };


  const handleSelectUser =
    async (user: ChatUser) => {
      if (creatingUserId) {
        return;
      }

      try {
        setCreatingUserId(user.id);
        setError(null);

        const response =
          await createChatConversation(
            user.id
          );

        const conversation =
          response.data;

        router.replace({
          pathname: "/chat/[id]",
          params: {
            id: conversation.id,
          },
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Suhbat yaratishda xatolik yuz berdi."
        );
      } finally {
        setCreatingUserId(null);
      }
    };


  const renderUser = ({
    item,
  }: {
    item: ChatUser;
  }) => {
    const isCreating =
      creatingUserId === item.id;

    return (
      <Pressable
        style={[
          styles.userItem,
          isCreating && styles.userItemDisabled,
        ]}
        disabled={creatingUserId !== null}
        onPress={() =>
          handleSelectUser(item)
        }
      >
        <ChatAvatar
  fullName={item.fullName}
  avatarUrl={item.avatarUrl}
  size={52}
/>

        <View style={styles.userInfo}>
          <Text
            style={styles.fullName}
            numberOfLines={1}
          >
            {item.fullName}
          </Text>

          {item.email ? (
            <Text
              style={styles.email}
              numberOfLines={1}
            >
              {item.email}
            </Text>
          ) : null}
        </View>

        {isCreating ? (
          <ActivityIndicator
            size="small"
            color="#3B82F6"
          />
        ) : (
          <Text style={styles.arrow}>
            ›
          </Text>
        )}
      </Pressable>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Yangi suhbat
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Foydalanuvchini qidiring..."
          placeholderTextColor="#64748B"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadUsers(search);
            }}
          >
            <Text style={styles.retryText}>
              Qayta urinish
            </Text>
          </Pressable>
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text style={styles.loadingText}>
            Foydalanuvchilar yuklanmoqda...
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            users.length === 0
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
                👥
              </Text>

              <Text style={styles.emptyTitle}>
                Foydalanuvchi topilmadi
              </Text>

              <Text style={styles.emptyText}>
                Qidiruv so‘zini o‘zgartirib,
                qayta urinib ko‘ring.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

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

  title: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  headerSpace: {
    width: 40,
  },

  searchContainer: {
    padding: 16,
  },

  searchInput: {
    height: 48,
    backgroundColor: "#0F172A",

    borderWidth: 1,
    borderColor: "#1E293B",

    borderRadius: 12,
    paddingHorizontal: 16,

    color: "#FFFFFF",
    fontSize: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#64748B",
    marginTop: 14,
    fontSize: 14,
  },

  list: {
    paddingBottom: 30,
  },

  userItem: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
  },

  userItemDisabled: {
    opacity: 0.6,
  },

  userInfo: {
    flex: 1,
    marginLeft: 14,
  },

  fullName: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },

  email: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 4,
  },

  arrow: {
    color: "#64748B",
    fontSize: 28,
    fontWeight: "300",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  errorText: {
    color: "#F87171",
    textAlign: "center",
    fontSize: 14,
  },

  retryButton: {
    marginTop: 20,

    paddingHorizontal: 20,
    paddingVertical: 12,

    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});