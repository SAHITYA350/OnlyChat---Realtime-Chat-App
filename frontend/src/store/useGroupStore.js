// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";

// const useGroupStore = create((set, get) => ({
//   groups: [],
//   selectedGroup: null,
//   groupMessages: [],
//   availableUsers: [],
//   isGroupsLoading: false,
//   isGroupMessagesLoading: false,
//   mobileView: 'list', // 'list' | 'chat' | 'info'
//   messageInputHeight: 60, // Default height for mobile

//   // Mobile view controls
//   setMobileView: (view) => set({ mobileView: view }),
//   setMessageInputHeight: (height) => set({ messageInputHeight: height }),

//   // Get all groups for the current user (mobile optimized)
//   getGroups: async () => {
//     set({ isGroupsLoading: true });
//     try {
//       const { data } = await axiosInstance.get("/groups");
//       const sortedGroups = data.sort((a, b) => 
//         new Date(b.lastMessage?.createdAt || b.createdAt) - 
//         new Date(a.lastMessage?.createdAt || a.createdAt)
//       );
//       set({ 
//         groups: sortedGroups,
//         isGroupsLoading: false,
//         mobileView: window.innerWidth < 768 ? 'list' : get().mobileView
//       });
//     } catch (error) {
//       console.error("Failed to fetch groups:", error);
//       set({ isGroupsLoading: false });
//     }
//   },

//   // Get messages for a specific group (mobile optimized)
//   getGroupMessages: async (groupId) => {
//     set({ isGroupMessagesLoading: true });
//     try {
//       const { data } = await axiosInstance.get(`/groups/${groupId}/messages`);
//       set({ 
//         groupMessages: data,
//         isGroupMessagesLoading: false,
//         mobileView: window.innerWidth < 768 ? 'chat' : get().mobileView
//       });
      
//       // Auto-scroll to bottom for mobile
//       if (window.innerWidth < 768) {
//         setTimeout(() => {
//           const messagesContainer = document.getElementById('group-messages-container');
//           if (messagesContainer) {
//             messagesContainer.scrollTop = messagesContainer.scrollHeight;
//           }
//         }, 100);
//       }
//     } catch (error) {
//       console.error("Failed to fetch group messages:", error);
//       set({ isGroupMessagesLoading: false });
//     }
//   },

//   // Create a new group (mobile optimized)
//   createGroup: async ({ name, members }) => {
//     try {
//       const { data } = await axiosInstance.post("/groups", { 
//         name, 
//         members,
//         lastActive: new Date().toISOString() // For mobile sorting
//       });
      
//       set(state => ({
//         groups: [data, ...state.groups],
//         selectedGroup: data,
//         mobileView: window.innerWidth < 768 ? 'chat' : 'list'
//       }));
      
//       return data;
//     } catch (error) {
//       console.error("Failed to create group:", error);
//       throw error;
//     }
//   },

//   // Enhanced send message with mobile optimizations
//   sendGroupMessage: async ({ text, image, groupId }) => {
//     try {
//       const { data } = await axiosInstance.post(`/groups/${groupId}/messages`, { 
//         text, 
//         image,
//         optimizedForMobile: window.innerWidth < 768 // Flag for mobile-optimized content
//       });
      
//       set(state => ({
//         groupMessages: [...state.groupMessages, data],
//         groups: state.groups.map(group => 
//           group._id === groupId ? { 
//             ...group, 
//             lastMessage: data,
//             lastActive: new Date().toISOString()
//           } : group
//         )
//       }));
      
//       // Auto-scroll for mobile
//       if (window.innerWidth < 768) {
//         setTimeout(() => {
//           const container = document.getElementById('group-messages-container');
//           if (container) {
//             container.scrollTop = container.scrollHeight;
//           }
//         }, 50);
//       }
      
//       return data;
//     } catch (error) {
//       console.error("Failed to send group message:", error);
//       throw error;
//     }
//   },

//   // Mobile-optimized message deletion
//   deleteGroupMessage: async (messageId, deleteForEveryone) => {
//     try {
//       await axiosInstance.delete(
//         `/messages/${messageId}?deleteType=${deleteForEveryone ? "everyone" : "me"}&isMobile=${window.innerWidth < 768}`
//       );
      
//       set(state => ({
//         groupMessages: state.groupMessages.filter(msg => msg._id !== messageId)
//       }));
      
//       // Show mobile toast notification
//       if (window.innerWidth < 768) {
//         // Implement your mobile toast here
//         console.log("Message deleted");
//       }
//     } catch (error) {
//       console.error("Failed to delete group message:", error);
//       throw error;
//     }
//   },

//   // Mobile-optimized group management
//   addGroupMembers: async (groupId, members) => {
//   try {
//     const { data } = await axiosInstance.put(`/groups/${groupId}/members`, {
//       memberIds: members, // ✅ change key if needed by backend
//       isMobile: window.innerWidth < 768
//     });

//     set(state => ({
//       groups: state.groups.map(group =>
//         group._id === groupId ? data : group
//       ),
//       selectedGroup: data,
//       mobileView: window.innerWidth < 768 ? 'info' : get().mobileView
//     }));
//   } catch (error) {
//     console.error("❌ Failed to add group members:", error.response?.data || error.message);
//     throw error;
//   }
// },

//   removeGroupMember: async (groupId, memberId) => {
//     try {
//       const { data } = await axiosInstance.delete(`/groups/${groupId}/members`, { 
//         data: { 
//           memberId,
//           isMobile: window.innerWidth < 768 
//         } 
//       });
      
//       set(state => ({
//         groups: state.groups.map(group => 
//           group._id === groupId ? data : group
//         ),
//         selectedGroup: data
//       }));
//     } catch (error) {
//       console.error("Failed to remove group member:", error);
//       throw error;
//     }
//   },

//   // Enhanced socket handling for mobile
//   subscribeToGroupMessages: () => {
//     const socket = get().socket;
//     if (socket) {
//       const groupId = get().selectedGroup?._id;
//       socket.emit("joinGroups", [groupId]);
      
//       socket.on("newGroupMessage", (message) => {
//         if (message.groupId === groupId) {
//           set(state => ({
//             groupMessages: [...state.groupMessages, message],
//             groups: state.groups.map(group => 
//               group._id === groupId ? { 
//                 ...group, 
//                 lastMessage: message,
//                 lastActive: new Date().toISOString()
//               } : group
//             )
//           }));
          
//           // Mobile-specific handling
//           if (window.innerWidth < 768) {
//             // Vibrate on new message if not in chat view
//             if (get().mobileView !== 'chat' && 'vibrate' in navigator) {
//               navigator.vibrate(200);
//             }
            
//             // Auto-scroll if in chat view
//             if (get().mobileView === 'chat') {
//               setTimeout(() => {
//                 const container = document.getElementById('group-messages-container');
//                 if (container) {
//                   container.scrollTop = container.scrollHeight;
//                 }
//               }, 50);
//             }
//           }
//         }
//       });
//     }
//   },

//   unsubscribeFromGroupMessages: () => {
//     const socket = get().socket;
//     if (socket) {
//       socket.emit("leaveGroups", [get().selectedGroup?._id]);
//       socket.off("newGroupMessage");
//     }
//   },

//   // Enhanced group selection for mobile
//   setSelectedGroup: (group) => {
//     set({ 
//       selectedGroup: group,
//       mobileView: window.innerWidth < 768 ? 'chat' : get().mobileView
//     });
//     if (group) {
//       get().getGroupMessages(group._id);
//     }
//   },

//   // Mobile-specific group info toggle
//   toggleGroupInfo: () => {
//     if (window.innerWidth < 768) {
//       set(state => ({
//         mobileView: state.mobileView === 'info' ? 'chat' : 'info'
//       }));
//     }
//   }
// }));

// export default useGroupStore;