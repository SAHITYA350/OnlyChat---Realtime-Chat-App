import { useState } from "react";
import useGroupStore from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import { X, Check, Users } from "lucide-react";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { users } = useChatStore();
  const { createGroup } = useGroupStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMemberSelection = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0) return;
    
    await createGroup({
      name: groupName,
      members: selectedMembers
    });
    
    // Reset and close
    setGroupName("");
    setSelectedMembers([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-100 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} />
            Create New Group
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Group Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter group name"
              className="input input-bordered w-full"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Members</span>
            </label>
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {users.map(user => (
                <div 
                  key={user._id}
                  className="flex items-center justify-between p-3 hover:bg-base-200 cursor-pointer"
                  onClick={() => toggleMemberSelection(user._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img src={user.profilePic || "/avatar.png"} alt={user.fullName} />
                      </div>
                    </div>
                    <span>{user.fullName}</span>
                  </div>
                  {selectedMembers.includes(user._id) && (
                    <Check className="text-success" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!groupName.trim() || selectedMembers.length === 0}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;