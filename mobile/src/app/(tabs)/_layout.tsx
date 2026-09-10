import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopColor: "#1E293B",
          borderTopWidth: 1,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#94A3B8",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Bosh sahifa",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="courses"
        options={{
          title: "Darslar",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reels"
        options={{
          title: "Reels",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "play-circle" : "play-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",

          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}