import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const DeleteMessageModal = ({ message, onClose }) => {
  const { deleteMessage } = useChatStore();

  const handleDelete = (deleteForEveryone) => {
    deleteMessage(message._id, deleteForEveryone);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-transparent shadow-none overflow-visible">
        <div className="relative">
          {/* Glassmorphism container */}
          <div className="backdrop-blur-lg bg-black/30 rounded-xl p-6 border border-white/10">
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 btn btn-circle btn-sm btn-error"
            >
              <X size={16} />
            </button>
            
            <h3 className="font-bold text-lg text-white mb-2">Delete Message</h3>
            <p className="text-white/80 mb-6">Choose how you want to delete this message</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDelete(true)}
                className="btn btn-block bg-red-600 hover:bg-red-700 border-red-700 text-white"
              >
                Delete for everyone
              </button>
              <button
                onClick={() => handleDelete(false)}
                className="btn btn-block bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                Delete just for me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;