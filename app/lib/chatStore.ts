import { create } from 'zustand';

export type Message = {
  id: string;
  chatId: string;
  text: string;
  sender: 'me' | 'them';
  ts: number; // epoch ms
};

export type Chat = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
};

type ChatState = {
  chats: Record<string, Chat>;

  // send a message as “me”
  send: (chatId: string, text: string) => void;

  // simulate an incoming message from “them”
  receive: (chatId: string, text: string) => void;

  // reset unread counter when user opens the chat 
  markRead: (chatId: string) => void;

  // create empty chat if it does not exist
  createChat: (chatId: string, peer: { name: string, avatar: string }) => void;
};

/* ---------- helper: simple “time ago” ---------- */
export const ago = (ts: number) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

/* ---------- store ---------- */
export const useChatStore = create<ChatState>((set) => ({
  /* seed data */
  chats: {
    '1': {
      id: '1',
      name: 'Sarah Martinez',
      avatar: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg',
      isOnline: true,
      messages: [
        {
          id: 'm1',
          chatId: '1',
          text: 'Sure! I have a session at 3 PM',
          sender: 'them',
          ts: Date.now() - 120_000,
        },
      ],
      lastMessage: 'Sure! I have a session at 3 PM',
      timestamp: ago(Date.now() - 120_000),
      unreadCount: 0,
    },
    '2': {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
      isOnline: false,
      messages: [
        {
            id: 'm1',
            chatId: '2',
            text: 'Great run today!',
            sender: 'them',
            ts: Date.now(),
        },
        {
            id: 'm2',
            chatId: '2',
            text: 'Same time tomorrow?',
            sender: 'them',
            ts: Date.now(),
        }
      ],
      lastMessage: 'Same time tomorrow?',
      timestamp: ago(Date.now()),
      unreadCount: 2,
    },
  },

  /* -------- actions -------- */
  send: (chatId, text) =>
    set((state) => {
      const chat = state.chats[chatId];
      if (!chat) return state;

      const now = Date.now();

      const msg: Message = {
        id: Math.random().toString(36).slice(2),
        chatId,
        text,
        sender: 'me',
        ts: Date.now(),
      };

      const updated: Chat = {
        ...chat,
        messages: [...chat.messages, msg],
        lastMessage: text,
        timestamp: ago(now),
        // receiver hasn’t read it yet → unread stays as-is
      };

      return { chats: { ...state.chats, [chatId]: updated } };
    }),

  receive: (chatId, text) =>
    set((state) => {
      const chat = state.chats[chatId];
      if (!chat) return state;

      const now = Date.now();

      const msg: Message = {
        id: Math.random().toString(36).slice(2),
        chatId,
        text,
        sender: 'them',
        ts: Date.now(),
      };

      const updated: Chat = {
        ...chat,
        messages: [...chat.messages, msg],
        lastMessage: text,
        timestamp: ago(now),
        unreadCount: chat.unreadCount + 1,
      };

      return { chats: { ...state.chats, [chatId]: updated } };
    }),

  markRead: (chatId) =>
    set((state) => {
      const chat = state.chats[chatId];
      if (!chat || chat.unreadCount === 0) return state;
      return {
        chats: {
          ...state.chats,
          [chatId]: { ...chat, unreadCount: 0 },
        },
      };
    }),

    createChat: (chatId, peer) =>
    set((state) => {
      if (state.chats[chatId]) return state;            // already there
      const empty: Chat = {
        id: chatId,
        name: peer.name,
        avatar: peer.avatar,
        isOnline: false,
        lastMessage: '',
        timestamp: '',
        unreadCount: 0,
        messages: [],
      };
      return { chats: { ...state.chats, [chatId]: empty } };
    }),
}));

