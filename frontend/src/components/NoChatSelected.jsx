import { MessageSquare, Users } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex-1 flex items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
            <MessageSquare className="w-8 h-8 text-primary" />
            <Users className="w-8 h-8 text-secondary absolute opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-base-content">Welcome to Chatty!</h2>
        <p className="text-base-content/60">
          Select a conversation or group from the sidebar to start chatting.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;