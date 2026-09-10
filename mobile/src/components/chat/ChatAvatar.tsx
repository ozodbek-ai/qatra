import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ChatAvatarProps = {
  fullName?: string | null;

  avatarUrl?: string | null;

  size?: number;

  style?: StyleProp<ViewStyle>;
};

export default function ChatAvatar({
  fullName,
  avatarUrl,
  size = 52,
  style,
}: ChatAvatarProps) {
  const initials =
    fullName
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const fontSize =
    Math.max(12, size * 0.32);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      {avatarUrl ? (
        <Image
          source={{
            uri: avatarUrl,
          }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              fontSize,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E293B",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  image: {
    resizeMode: "cover",
  },

  initials: {
    color: "#60A5FA",
    fontWeight: "700",
  },
});