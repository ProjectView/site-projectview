// Messages are stored in Firestore (collection: "messages").
// Re-exports from firestore-messages.ts for backward compatibility with all existing imports.
export {
  type Message,
  getAllMessages,
  getUnreadCount,
  getMessageById,
  createMessage,
  markMessageAsRead,
  markMessageAsUnread,
  deleteMessage,
} from '@/lib/firestore-messages';
