import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Sparkles, Shield, Globe, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [floatingMessages, setFloatingMessages] = useState([]);

  // Generate floating chat messages
  useEffect(() => {
    const messages = [
      "Welcome to your portal!",
      "Connect with the world...",
      "Your digital identity",
      "Chat without boundaries",
      "Secure & private",
      "Join the conversation"
    ];
    
    const interval = setInterval(() => {
      setFloatingMessages(prev => {
        const newMessage = {
          id: Date.now(),
          text: messages[Math.floor(Math.random() * messages.length)],
          x: Math.random() * 80 + 10,
          speed: Math.random() * 3 + 1
        };
        return [...prev.slice(-4), newMessage];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="h-100 pt-20 relative overflow-hidden">
      {/* Floating chat messages with glassmorphism */}
      <AnimatePresence>
        {floatingMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ 
              y: `-${message.speed * 100}%`,
              opacity: 1,
              x: `${message.x}%`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: message.speed * 10 }}
            className="absolute text-xs md:text-sm px-3 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
            style={{ left: `${message.x}%`, bottom: 0 }}
          >
            <MessageSquare className="inline mr-1 w-3 h-3" />
            {message.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Animated gate elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8 relative z-10">
        {/* Gate-inspired header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center mb-4">
            <Sparkles className="text-white mr-2" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-zinc-50">
              Your Profile
            </h1>
            <Sparkles className="text-white ml-2" />
          </div>
          <p className="text-zinc-300 mt-2 max-w-md mx-auto">
            Step through your personal gateway to seamless communication
          </p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 space-y-8 border border-white/10 shadow-2xl shadow-blue-900/20">
          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent hover:border-blue-400/30 transition-all duration-300 pointer-events-none"></div>
              </div>
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute -bottom-2 -right-2 
                  bg-gradient-to-br to-zinc-50 hover: hover:to-blue-400  from-blue-600
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200 shadow-md
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-black" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </motion.div>
            <p className="text-sm text-zinc-300">
              {isUpdatingProfile ? (
                <span className="flex items-center">
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2"
                  >
                    ⚡
                  </motion.span>
                  Crafting your digital identity...
                </span>
              ) : (
                "Your face is the key to your chat world"
              )}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Full Name
              </div>
              <div className="px-4 py-2.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm flex items-center justify-between">
                <span>{authUser?.fullName}</span>
                <Shield className="w-4 h-4 text-green-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email Address
              </div>
              <div className="px-4 py-2.5 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm flex items-center justify-between">
                <span>{authUser?.email}</span>
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Enhanced account info section */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-6 bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10 shadow-inner"
          >
            <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Sparkles className="text-white w-5 h-5" />
              Digital Passport
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-zinc-300 font-semibold">Member Since</span>
                <span className="font-extrabold text-xl text-gray-50">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-300 font-smallbold">Account Status</span>
                <span className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-green-400 font-medium">Active</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Gate decoration elements */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="h-1 w-1/4 bg-gradient-to-r from-blue-500/50 to-transparent rounded-full"></div>
            <div className="text-xs text-zinc-400 px-2">WELCOME TO YOUR OnlyChat Profile</div>
            <div className="h-1 w-1/4 bg-gradient-to-l from-white/50 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ProfilePage;