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

import { useRouter } from "expo-router";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "@/services/notification.service";

import {
  useNotifications,
} from "@/context/NotificationContext";


export default function NotificationsScreen() {
  const router = useRouter();

  const {
  refreshUnreadCount,
  decreaseUnreadCount,
  resetUnreadCount,
} = useNotifications();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  const loadNotifications =
    useCallback(async () => {
      try {
        setError(null);

        const response =
          await getNotifications();

        setNotifications(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Notificationlarni yuklashda xatolik yuz berdi."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, []);


  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);


  const handleRefresh = () => {
    setRefreshing(true);

    loadNotifications();
  };


  const handleNotificationPress =
    async (notification: Notification) => {
      try {
        if (!notification.isRead) {
          await markNotificationAsRead(
            notification.id
          );

          setNotifications((current) =>
            current.map((item) =>
              item.id === notification.id
                ? {
                    ...item,
                    isRead: true,
                  }
                : item
            )
          );
        }

        if (notification.link) {
          router.push(
            notification.link as never
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Notificationni ochishda xatolik yuz berdi."
        );
      }
    };


  const handleMarkAllAsRead =
    async () => {
      try {
        setMarkingAll(true);

        await markAllNotificationsAsRead();

        setNotifications((current) =>
          current.map((item) => ({
            ...item,
            isRead: true,
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Notificationlarni yangilashda xatolik yuz berdi."
        );
      } finally {
        setMarkingAll(false);
      }
    };


  const formatDate = (
    dateString: string
  ) => {
    const date = new Date(dateString);

    return date.toLocaleString();
  };


  const renderNotification = ({
    item,
  }: {
    item: Notification;
  }) => {
    return (
      <Pressable
        style={[
          styles.notification,

          !item.isRead &&
            styles.unreadNotification,
        ]}
        onPress={() =>
          handleNotificationPress(item)
        }
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {item.type === "CHAT_MESSAGE"
              ? "💬"
              : "🔔"}
          </Text>
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text
              style={styles.notificationTitle}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {!item.isRead ? (
              <View style={styles.unreadDot} />
            ) : null}
          </View>

          <Text
            style={styles.message}
            numberOfLines={2}
          >
            {item.message}
          </Text>

          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };


  const unreadCount =
    notifications.filter(
      (item) => !item.isRead
    ).length;


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#3B82F6"
        />

        <Text style={styles.loadingText}>
          Notificationlar yuklanmoqda...
        </Text>
      </View>
    );
  }


  if (error && notifications.length === 0) {
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
            loadNotifications();
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
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Notificationlar
          </Text>

          {unreadCount > 0 ? (
            <Text style={styles.subtitle}>
              {unreadCount} ta o'qilmagan
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Hammasi o'qilgan
            </Text>
          )}
        </View>

        <Pressable
          style={[
            styles.readAllButton,
            unreadCount === 0 &&
              styles.readAllDisabled,
          ]}
          disabled={
            unreadCount === 0 ||
            markingAll
          }
          onPress={handleMarkAllAsRead}
        >
          {markingAll ? (
            <ActivityIndicator
              size="small"
              color="#60A5FA"
            />
          ) : (
            <Text style={styles.readAllText}>
              Barchasi
            </Text>
          )}
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          notifications.length === 0
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
              🔔
            </Text>

            <Text style={styles.emptyTitle}>
              Notificationlar yo'q
            </Text>

            <Text style={styles.emptyText}>
              Yangi notificationlar shu yerda
              ko'rinadi.
            </Text>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  backButton: {
    width: 42,
    height: 42,

    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "300",
    marginTop: -5,
  },

  headerContent: {
    flex: 1,
    marginLeft: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 3,
  },

  readAllButton: {
    minWidth: 70,
    height: 40,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 10,
  },

  readAllDisabled: {
    opacity: 0.4,
  },

  readAllText: {
    color: "#60A5FA",
    fontSize: 13,
    fontWeight: "700",
  },

  list: {
    paddingBottom: 24,
  },

  notification: {
    flexDirection: "row",

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
  },

  unreadNotification: {
    backgroundColor: "#071426",
  },

  iconContainer: {
    width: 46,
    height: 46,

    borderRadius: 23,

    backgroundColor: "#1E293B",

    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 21,
  },

  notificationContent: {
    flex: 1,
    marginLeft: 13,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,

    color: "#F8FAFC",

    fontSize: 15,
    fontWeight: "700",

    marginRight: 8,
  },

  unreadDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#3B82F6",
  },

  message: {
    color: "#94A3B8",

    fontSize: 14,

    lineHeight: 20,

    marginTop: 4,
  },

  date: {
    color: "#475569",

    fontSize: 12,

    marginTop: 7,
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
    fontSize: 48,
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 14,

    textAlign: "center",

    lineHeight: 21,

    marginTop: 8,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  errorText: {
    color: "#F87171",

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