import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Frown } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter by online and search
  const filteredUsers = users.filter((user) => {
    const isOnline = onlineUsers.includes(user._id);
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    if (showOnlineOnly) {
      return isOnline && matchesSearch;
    }
    return matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-16 sm:w-20 md:w-64 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-2 sm:p-3 lg:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Users className="size-5 sm:size-6" />
            <span className="font-medium hidden md:block">Contacts</span>
          </div>

          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="btn btn-ghost btn-xs sm:btn-sm lg:hidden"
          >
            <Search className="size-4 sm:size-5" />
          </button>
        </div>

        {/* Mobile Search Bar - appears when toggled */}
        {showMobileSearch && (
          <div className="mt-2 lg:hidden">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-xs sm:input-sm input-bordered w-full"
              autoFocus
            />
          </div>
        )}

        {/* Desktop Controls */}
        <div className="mt-2 sm:mt-3 hidden lg:block space-y-2">
          {/* Online Toggle */}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs sm:checkbox-sm"
              />
              <span className="text-xs sm:text-sm">Online only</span>
            </label>
            <span className="text-xs text-zinc-500">
              ({Math.max(onlineUsers.length - 1, 0)})
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-xs sm:input-sm input-bordered w-full pl-9"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-1 sm:py-3">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-1 sm:p-2 md:p-3 flex items-center gap-1 sm:gap-2 md:gap-3 hover:bg-base-300 transition-colors ${
                isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
            >
              {/* Avatar with online badge */}
              <div className="relative mx-auto md:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-8 sm:size-10 md:size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-2 sm:size-3 bg-green-500 rounded-full ring-1 sm:ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User Info - hidden on smallest screens */}
              <div className="hidden sm:block md:text-left min-w-0 truncate">
                <div className="text-xs sm:text-sm md:text-base font-medium truncate">
                  {user.fullName}
                </div>
                <div className="text-xs text-zinc-400 hidden md:block">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-4 px-2">
            <Frown className="size-6 mb-2" />
            <span className="text-xs sm:text-sm">No matching users found</span>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-xs text-primary mt-1 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;