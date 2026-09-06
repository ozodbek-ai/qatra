export type NotificationType =
  | "CHAT_MESSAGE"
  | "CHALLENGE_RECEIVED"
  | "CHALLENGE_ACCEPTED"
  | "CHALLENGE_DECLINED"
  | "CHALLENGE_COMPLETED"
  | "COURSE_ENROLLED"
  | "COURSE_COMPLETED"
  | "CERTIFICATE_ISSUED"
  | "SYSTEM";

export interface Notification {
  id: string;

  userId: string;

  type: NotificationType;

  title: string;

  message: string;

  link: string | null;

  metadata: unknown;

  isRead: boolean;

  readAt: string | null;

  createdAt: string;
}