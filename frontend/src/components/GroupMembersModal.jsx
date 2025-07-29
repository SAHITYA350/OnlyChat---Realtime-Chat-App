
import { useState } from "react"; // ✅ FIX: Added this line
import useGroupStore from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, UserPlus, UserMinus, Crown } from "lucide-react";
const GroupMembersModal = ({ isOpen, onClose }) => {
  const { selectedGroup, addGroupMembers, removeGroupMember } = useGroupStore();
  const { authUser } = useAuthStore();
  const [newMembers, setNewMembers] = useState([]);

  const handleAddMembers = async () => {
    if (newMembers.length === 0) return;
    await addGroupMembers(selectedGroup._id, newMembers);
    setNewMembers([]);
  };

  const handleRemoveMember = async (memberId) => {
    await removeGroupMember(selectedGroup._id, memberId);
  };

  if (!isOpen || !selectedGroup) return null;

  const isAdmin = selectedGroup.admin === authUser._id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-base-200 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Group Members</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Current Members */}
          <div className="max-h-60 overflow-y-auto border rounded-lg divide-y divide-base-300">
            {selectedGroup.members.map(member => (
              <div key={member._id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-8 h-8 rounded-full">
                      <img src={member.profilePic || "/avatar.png"} alt={member.fullName} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{member.fullName}</span>
                      {member._id === selectedGroup.admin && (
                        <Crown className="text-yellow-500" size={14} />
                      )}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {member._id === selectedGroup.admin ? "Admin" : "Member"}
                    </div>
                  </div>
                </div>

                {isAdmin && member._id !== selectedGroup.admin && (
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="btn btn-xs btn-error btn-circle"
                    title="Remove member"
                  >
                    <UserMinus size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Members (only for admin) */}
          {isAdmin && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Add New Members</h4>
              <div className="flex gap-2">
                <select
                  className="select select-bordered flex-1"
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !newMembers.includes(e.target.value)) {
                      setNewMembers([...newMembers, e.target.value]);
                    }
                  }}
                >
                  <option value="">Select user</option>
                  {useGroupStore.getState().availableUsers
                    .filter(user => 
                      !selectedGroup.members.some(m => m._id === user._id) &&
                      user._id !== authUser._id
                    )
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.fullName}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddMembers}
                  disabled={newMembers.length === 0}
                  className="btn btn-primary"
                >
                  <UserPlus size={16} />
                </button>
              </div>

              {/* Selected new members */}
              {newMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newMembers.map(memberId => {
                    const user = useGroupStore.getState().availableUsers.find(u => u._id === memberId);
                    return (
                      <div key={memberId} className="badge badge-primary gap-1">
                        {user?.fullName}
                        <button 
                          onClick={() => setNewMembers(newMembers.filter(id => id !== memberId))}
                          className="text-xs"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupMembersModal;
