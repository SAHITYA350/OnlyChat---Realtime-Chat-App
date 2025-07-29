import { useEffect, useState } from "react";
import useGroupStore from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Plus } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import GroupSidebarSkeleton from "./skeletons/GroupSidebarSkeleton";

const GroupSidebar = () => {
  const { getGroups, groups, selectedGroup, setSelectedGroup, isGroupsLoading } = useGroupStore();
  const { onlineUsers } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  if (isGroupsLoading) return <GroupSidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Groups</span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-sm btn-circle btn-primary"
            title="Create new group"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Group List */}
      <div className="overflow-y-auto w-full py-3">
        {groups.map((group) => {
          const isSelected = selectedGroup?._id === group._id;
          const onlineCount = group.members.filter(member => 
            onlineUsers.includes(member._id)
          ).length;

          return (
            <button
              key={group._id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
            >
              {/* Group Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={group.groupPic || "/group-default.png"}
                  alt={group.name}
                  className="size-12 object-cover rounded-full"
                />
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-300" />
              </div>

              {/* Group Info (hidden on small screens) */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-sm text-zinc-400">
                  {onlineCount}/{group.members.length} online
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty State */}
        {groups.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No groups yet. Create one!
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </aside>
  );
};

export default GroupSidebar;