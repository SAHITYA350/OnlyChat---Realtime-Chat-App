import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import useGroupStore from "../store/useGroupStore";
import Sidebar from "../components/Sidebar";
import GroupSidebar from "../components/GroupSidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import GroupChatContainer from "../components/GroupChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' or 'groups'

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar with tabs */}
            <div className="flex flex-col border-r border-base-300">
              <div className="tabs tabs-boxed bg-base-200 p-1">
                <button
                  className={`tab flex-1 ${activeTab === "chats" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("chats")}
                >
                  Chats
                </button> 
                <button
                  className={`tab flex-1 ${activeTab === "groups" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("groups")}
                >
                  Groups
                </button>
              </div>
              {activeTab === "chats" ? <Sidebar /> : <GroupSidebar />}
            </div>

            {/* Main content area */}
            {activeTab === "chats" ? (
              !selectedUser ? <NoChatSelected /> : <ChatContainer />
            ) : (
              !selectedGroup ? <NoChatSelected /> : <GroupChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;