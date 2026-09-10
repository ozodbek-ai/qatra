import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useCallback, useEffect, useRef, useState } from "react";

import { VideoView, useVideoPlayer } from "expo-video";

import {
  createReelComment,
  getReelComments,
  getReels,
  toggleReelLike,
  type Reel,
  type ReelComment,
} from "@/services/reel.service";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function ReelVideo({
  reel,
  isActive,
}: {
  reel: Reel;
  isActive: boolean;
}) {
  const player = useVideoPlayer(reel.videoUrl, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls={false}
      contentFit="cover"
    />
  );
}

export default function ReelsScreen() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [comments, setComments] = useState<ReelComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const flatListRef = useRef<FlatList<Reel>>(null);

  const loadReels = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await getReels();

      setReels(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Reels yuklashda xatolik yuz berdi."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  const handleLike = async (reel: Reel) => {
    try {
      const response = await toggleReelLike(reel.id);

      setReels((currentReels) =>
        currentReels.map((item) => {
          if (item.id !== reel.id) {
            return item;
          }

          return {
            ...item,
            likedByMe: response.data.liked,
            likeCount: response.data.likeCount,
          };
        })
      );

      setSelectedReel((currentReel) => {
        if (!currentReel || currentReel.id !== reel.id) {
          return currentReel;
        }

        return {
          ...currentReel,
          likedByMe: response.data.liked,
          likeCount: response.data.likeCount,
        };
      });
    } catch (err) {
      console.log("Like xatosi:", err);
    }
  };

  const handleShare = async (reel: Reel) => {
    try {
      const title = reel.title || "Qatra Reels";
      const description = reel.description || "";

      await Share.share({
        title,
        message: `${title}\n\n${description}`,
      });
    } catch (error) {
      console.log("Share xatosi:", error);
    }
  };

  const openComments = async (reel: Reel) => {
    try {
      setSelectedReel(reel);
      setComments([]);
      setCommentsLoading(true);

      const response = await getReelComments(reel.id);

      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Kommentlarni olishda xatolik:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const closeComments = () => {
    setSelectedReel(null);
    setComments([]);
    setCommentText("");
  };

  const handleCreateComment = async () => {
    if (!selectedReel) {
      return;
    }

    const text = commentText.trim();

    if (!text) {
      return;
    }

    try {
      setSendingComment(true);

      const response = await createReelComment(selectedReel.id, text);

      setComments((currentComments) => [
        response.data,
        ...currentComments,
      ]);

      setCommentText("");

      setReels((currentReels) =>
        currentReels.map((item) => {
          if (item.id !== selectedReel.id) {
            return item;
          }

          return {
            ...item,
            commentCount: (item.commentCount ?? 0) + 1,
          };
        })
      );

      setSelectedReel((currentReel) => {
        if (!currentReel) {
          return null;
        }

        return {
          ...currentReel,
          commentCount: (currentReel.commentCount ?? 0) + 1,
        };
      });
    } catch (err) {
      console.log("Komment yozishda xatolik:", err);
    } finally {
      setSendingComment(false);
    }
  };

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{
        index: number | null;
      }>;
    }) => {
      if (
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFFFFF" />

        <Text style={styles.loadingText}>
          Reels yuklanmoqda...
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

        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => loadReels()}
        >
          <Text style={styles.retryText}>
            Qayta urinish
          </Text>
        </Pressable>
      </View>
    );
  }

  if (reels.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>🎬</Text>

        <Text style={styles.emptyTitle}>
          Hozircha Reels yo'q
        </Text>

        <Text style={styles.emptyText}>
          Tez orada yangi videolar qo'shiladi.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadReels(true)}
            tintColor="#FFFFFF"
          />
        }
        renderItem={({ item, index }) => {
          const likes = item.likeCount ?? 0;
          const commentsCount = item.commentCount ?? 0;

          return (
            <View style={styles.reelContainer}>
              <ReelVideo
                reel={item}
                isActive={activeIndex === index}
              />

              <View style={styles.overlay}>
                <View style={styles.info}>
                  <Text
                    style={styles.title}
                    numberOfLines={2}
                  >
                    {item.title || "Qatra Reels"}
                  </Text>

                  {item.description ? (
                    <Text
                      style={styles.description}
                      numberOfLines={3}
                    >
                      {item.description}
                    </Text>
                  ) : null}

                  {item.category ? (
                    <View style={styles.category}>
                      <Text style={styles.categoryText}>
                        {item.category.name}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={styles.action}
                    onPress={() => handleLike(item)}
                  >
                    <Text
                      style={[
                        styles.actionIcon,
                        item.likedByMe && styles.liked,
                      ]}
                    >
                      ♥
                    </Text>

                    <Text style={styles.actionText}>
                      {likes}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.action}
                    onPress={() => openComments(item)}
                  >
                    <Text style={styles.actionIcon}>
                      💬
                    </Text>

                    <Text style={styles.actionText}>
                      {commentsCount}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.action}
                    onPress={() => handleShare(item)}
                  >
                    <Text style={styles.actionIcon}>
                      ↗
                    </Text>

                    <Text style={styles.actionText}>
                      Ulashish
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
        }}
      />

      <Modal
        visible={selectedReel !== null}
        transparent
        animationType="slide"
        onRequestClose={closeComments}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeComments}
          />

          <KeyboardAvoidingView
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : undefined
            }
            style={styles.commentsSheet}
          >
            <View style={styles.commentsHeader}>
              <View>
                <Text style={styles.commentsTitle}>
                  Kommentariyalar
                </Text>

                <Text style={styles.commentsSubtitle}>
                  {comments.length} ta komment
                </Text>
              </View>

              <Pressable
                onPress={closeComments}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>
                  ✕
                </Text>
              </Pressable>
            </View>

            {commentsLoading ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator
                  size="large"
                  color="#2563EB"
                />
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.noComments}>
                <Text style={styles.noCommentsEmoji}>
                  💬
                </Text>

                <Text style={styles.noCommentsTitle}>
                  Hozircha komment yo'q
                </Text>

                <Text style={styles.noCommentsText}>
                  Birinchi bo'lib fikringizni yozing.
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.commentsList}
                contentContainerStyle={styles.commentsContent}
                showsVerticalScrollIndicator={false}
              >
                {comments.map((comment) => {
                  const authorName =
                    comment.user?.fullName || "Foydalanuvchi";

                  return (
                    <View
                      key={comment.id}
                      style={styles.commentItem}
                    >
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {authorName.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.commentBody}>
                        <Text style={styles.commentAuthor}>
                          {authorName}
                        </Text>

                        <Text style={styles.commentContent}>
                          {comment.text}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.commentInputContainer}>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Komment yozing..."
                placeholderTextColor="#64748B"
                style={styles.commentInput}
                multiline
                maxLength={500}
              />

              <Pressable
                style={[
                  styles.sendButton,
                  (!commentText.trim() || sendingComment) &&
                    styles.sendButtonDisabled,
                ]}
                disabled={
                  !commentText.trim() || sendingComment
                }
                onPress={handleCreateComment}
              >
                {sendingComment ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.sendText}>
                    Yuborish
                  </Text>
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  reelContainer: {
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#000000",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  info: {
    flex: 1,
    justifyContent: "flex-end",
    paddingRight: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  description: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  category: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 12,
  },

  categoryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  actions: {
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },

  action: {
    alignItems: "center",
  },

  actionIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
  },

  liked: {
    color: "#EF4444",
  },

  actionText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  center: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    color: "#CBD5E1",
    marginTop: 14,
    fontSize: 15,
  },

  emptyEmoji: {
    fontSize: 52,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 14,
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },

  errorText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  commentsSheet: {
    height: "72%",
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  commentsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  commentsSubtitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  commentsLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  commentsList: {
    flex: 1,
  },

  commentsContent: {
    padding: 20,
    paddingBottom: 30,
  },

  commentItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  commentBody: {
    flex: 1,
  },

  commentAuthor: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  commentContent: {
    color: "#CBD5E1",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },

  noComments: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  noCommentsEmoji: {
    fontSize: 44,
  },

  noCommentsTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },

  noCommentsText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
  },

  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    backgroundColor: "#0F172A",
  },

  commentInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
  },

  sendButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});