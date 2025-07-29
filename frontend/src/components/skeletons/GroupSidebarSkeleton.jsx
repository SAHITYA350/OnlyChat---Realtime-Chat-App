// frontend/src/components/skeletons/GroupSidebarSkeleton.jsx
const GroupSidebarSkeleton = () => {
  return (
    <div className="p-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4" />
      <div className="h-10 bg-gray-200 rounded mb-2" />
      <div className="h-10 bg-gray-200 rounded mb-2" />
      <div className="h-10 bg-gray-200 rounded mb-2" />
    </div>
  );
};

export default GroupSidebarSkeleton;
