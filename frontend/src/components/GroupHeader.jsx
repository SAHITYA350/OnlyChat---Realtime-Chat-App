// import { useState } from "react";
// import { Users } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import useGroupStore from "../store/useGroupStore";
// import GroupMembersModal from "./GroupMembersModal";

// const GroupHeader = () => {
//   const { selectedGroup } = useGroupStore();
//   const { onlineUsers } = useAuthStore();
//   const [showMembersModal, setShowMembersModal] = useState(false);

//   if (!selectedGroup) return null;

//   const onlineCount = selectedGroup.members.filter(member =>
//     onlineUsers.includes(member._id)
//   ).length;

//   return (
//     <div className="p-4 border-b border-base-300 bg-base-100 shadow-sm">
//       <div className="flex items-center justify-between">
//         {/* Group Info */}
//         <div className="flex items-center gap-4">
//           <div className="avatar">
//             <div className="w-11 h-11 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
//               <img
//                 src={selectedGroup.groupPic || "/group-default.png"}
//                 alt={selectedGroup.name}
//                 className="object-cover"
//               />
//             </div>
//           </div>

//           <div className="text-sm">
//             <h3 className="font-semibold text-base-content">{selectedGroup.name}</h3>
//             <p className="text-xs text-base-content/60">
//               {onlineCount}/{selectedGroup.members.length} online
//             </p>
//           </div>
//         </div>

//         {/* Members Button */}
//         <button
//           onClick={() => setShowMembersModal(true)}
//           className="btn btn-ghost btn-sm hover:bg-base-200 transition"
//           title="View group members"
//         >
//           <Users size={18} />
//         </button>
//       </div>

//       {/* Modal */}
//       <GroupMembersModal
//         isOpen={showMembersModal}
//         onClose={() => setShowMembersModal(false)}
//         group={selectedGroup}
//       />
//     </div>
//   );
// };

// export default GroupHeader;
