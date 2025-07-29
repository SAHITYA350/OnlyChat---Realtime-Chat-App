import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // Get all users for sidebar
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get messages for a specific user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a new message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Delete a message (for self or everyone)
  deleteMessage: async (messageId, deleteForEveryone) => {
    const { messages } = get();
    const currentUserId = useAuthStore.getState().authUser._id;

    // Backup in case revert is needed
    const originalMessages = [...messages];

    const updatedMessages = deleteForEveryone
      ? messages.filter(msg => msg._id !== messageId)
      : messages.map(msg =>
          msg._id === messageId
            ? {
                ...msg,
                deletedFor: msg.deletedFor?.includes(currentUserId)
                  ? msg.deletedFor
                  : [...(msg.deletedFor || []), currentUserId]
              }
            : msg
        );

    set({ messages: updatedMessages });

    try {
      await axiosInstance.delete(`/messages/${messageId}`, {
        params: { deleteType: deleteForEveryone ? 'everyone' : 'me' },
        withCredentials: true
      });
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
      // Revert to original on failure
      set({ messages: originalMessages });
    }
  },

  // Socket.io subscriptions
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    // New message event
    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (isFromSelectedUser) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    // Message deleted event
    socket.on("messageDeleted", (payload) => {
      const { messageId, deleteType } = payload;
      const currentUserId = useAuthStore.getState().authUser._id;

      set((state) => ({
        messages:
          deleteType === "everyone"
            ? state.messages.filter((msg) => msg._id !== messageId)
            : state.messages.map((msg) =>
                msg._id === messageId
                  ? {
                      ...msg,
                      deletedFor: msg.deletedFor?.includes(currentUserId)
                        ? msg.deletedFor
                        : [...(msg.deletedFor || []), currentUserId],
                    }
                  : msg
              ),
      }));
    });
  },

  // Clean up socket listeners
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
  },

  // Set the currently selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Clear all messages
  clearMessages: () => set({ messages: [] }),
}));
