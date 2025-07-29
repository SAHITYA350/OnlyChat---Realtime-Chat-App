import { useState, useEffect, useRef } from "react";
import useGroupStore from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import GroupHeader from "./GroupHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import GroupMembersModal from "./GroupMembersModal";

const GroupChatContainer = () => {
  const {
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    selectedGroup,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
    sendGroupMessage,
    deleteGroupMessage,
  } = useGroupStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id);
      subscribeToGroupMessages();
    }
    return () => unsubscribeFromGroupMessages();
  }, [selectedGroup?._id, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  const handleDelete = async (deleteForEveryone) => {
    if (!messageToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteGroupMessage(messageToDelete._id, deleteForEveryone);
      setMessageToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMessage = async ({ text, image }) => {
    if (!text.trim() && !image) return;
    await sendGroupMessage({
      text: text.trim(),
      image,
      groupId: selectedGroup._id
    });
  };

  if (isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupHeader onShowMembers={() => setShowMembersModal(true)} />
        <MessageSkeleton />
        <MessageInput onSend={handleSendMessage} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <GroupHeader onShowMembers={() => setShowMembersModal(true)} />
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-black/5 to-transparent backdrop-blur-sm">
        <div className="space-y-4">
          <AnimatePresence>
            {groupMessages
              .filter(msg => !msg.isDeletedForUser)
              .map((message) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative ${
                    message.senderId === authUser._id 
                      ? "flex justify-end" 
                      : "flex justify-start"
                  }`}
                  ref={messageEndRef}
                >
                  {/* Message bubble */}
                  <div className={`relative max-w-[80%] rounded-2xl p-4 ${
                    message.senderId === authUser._id 
                      ? "bg-primary/90 text-primary-content shadow-md" 
                      : "bg-white/10 backdrop-blur-sm text-white shadow-sm"
                  }`}>
                    {message.senderId !== authUser._id && (
                      <div className="text-xs font-medium mb-1">
                        {selectedGroup.members.find(m => m._id === message.senderId)?.fullName}
                      </div>
                    )}
                    
                    {message.image && (
                      <motion.img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-lg mb-2 max-w-full max-h-60 object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                    {message.text && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {message.text}
                      </motion.p>
                    )}
                    
                    <div className={`text-xs mt-1 ${
                      message.senderId === authUser._id 
                        ? "text-primary-content/70" 
                        : "text-white/50"
                    }`}>
                      {formatMessageTime(message.createdAt)}
                    </div>
                    
                    {(message.senderId === authUser._id || selectedGroup.admin === authUser._id) && (
                      <motion.button
                        onClick={() => setMessageToDelete(message)}
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 
                        transition-opacity btn btn-circle btn-xs btn-error shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <MessageInput onSend={handleSendMessage} />

      {/* Delete Message Modal */}
      <AnimatePresence>
        {messageToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-base-200 rounded-xl p-6 w-full max-w-md border border-base-300 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Trash2 className="text-error" size={20} />
                  <h3 className="text-lg font-bold">Delete Message</h3>
                </div>
                <button 
                  onClick={() => setMessageToDelete(null)}
                  className="btn btn-sm btn-circle btn-ghost"
                  disabled={isDeleting}
                >
                  <X size={16} />
                </button>
              </div>

              <p className="mb-6">This message will be permanently deleted.</p>

              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => handleDelete(true)}
                  className="btn btn-error btn-block gap-2"
                  disabled={isDeleting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete for everyone
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => handleDelete(false)}
                  className="btn btn-outline btn-block"
                  disabled={isDeleting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Delete just for me"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Group Members Modal */}
      <GroupMembersModal 
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
      />
    </div>
  );
};

export default GroupChatContainer;