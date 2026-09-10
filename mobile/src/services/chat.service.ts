import { API_URL } from "@/constants/api";
import { getAccessToken } from "@/services/storage.service";

export type ChatUser = {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string | null;
  role?: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  reelId?: string | null;
  createdAt: string;
  updatedAt?: string;

  sender?: ChatUser;

  reel?: {
    id: string;
    title?: string;
    thumbnailUrl?: string | null;
  } | null;
};

export type ChatConversation = {
  id: string;
  createdAt: string;
  updatedAt: string;

  otherUser?: ChatUser | null;

  lastMessage?: ChatMessage | null;

  unreadCount?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function getHeaders() {
  const token = await getAccessToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

export async function getChatUsers(
  search = ""
): Promise<ApiResponse<ChatUser[]>> {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  const response = await fetch(
    `${API_URL}/chat/users${query}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Foydalanuvchilarni olishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| CONVERSATIONS
|--------------------------------------------------------------------------
*/

export async function getChatConversations(): Promise<
  ApiResponse<ChatConversation[]>
> {
  const response = await fetch(
    `${API_URL}/chat/conversations`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Suhbatlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}

export async function createChatConversation(
  otherUserId: string
): Promise<ApiResponse<ChatConversation>> {
  const response = await fetch(
    `${API_URL}/chat/conversations`,
    {
      method: "POST",
      headers: await getHeaders(),

      body: JSON.stringify({
        otherUserId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Suhbat yaratishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| MESSAGES
|--------------------------------------------------------------------------
*/

export async function getChatMessages(
  conversationId: string
): Promise<ApiResponse<ChatMessage[]>> {
  const response = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Xabarlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}

export async function sendChatMessage(
  conversationId: string,
  text: string
): Promise<ApiResponse<ChatMessage>> {
  const response = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: await getHeaders(),

      body: JSON.stringify({
        text,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Xabar yuborishda xatolik yuz berdi."
    );
  }

  return result;
}

/*
|--------------------------------------------------------------------------
| READ STATUS
|--------------------------------------------------------------------------
*/

export async function markConversationAsRead(
  conversationId: string
): Promise<ApiResponse<unknown>> {
  const response = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/read`,
    {
      method: "POST",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Suhbatni o'qilgan deb belgilashda xatolik yuz berdi."
    );
  }

  return result;
}