export interface ChatUser {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl?: string | null;
  role?: string;
}

export interface ConversationMember {
  id: string;
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;

  user: ChatUser;
}

export interface ChatReel {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  isPublished: boolean;
}

export interface ChatMessageSender {
  id: string;
  fullName: string;
  email?: string;
  avatarUrl: string | null;
}

export interface ChatMessage {
  id: string;

  conversationId: string;

  senderId: string;

  text?: string | null;

  reelId?: string | null;

  createdAt: string;

  updatedAt?: string;

  sender?: ChatUser;

  reel?: ReelMessageData | null;
}


export interface Conversation {
  id: string;

  otherUser: ChatUser | null;

  lastMessage: ChatMessage | null;

  unreadCount: number;

  lastReadAt: string | null;

  createdAt: string;

  updatedAt: string;

  members: ConversationMember[];
}

export interface ReelMessageData {
  id: string;
  title: string;
  description?: string | null;
  videoUrl: string;
  thumbnailUrl?: string | null;
  isPublished: boolean;
}