/* eslint-disable react/no-unknown-property */

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [floatingMessages, setFloatingMessages] = useState([]);
  const { signup, isSigningUp } = useAuthStore();

  // Generate floating chat messages
  useEffect(() => {
    const messages = [
      "Welcome to the chatverse!",
      "Connect with friends",
      "Share your moments",
      "Join the conversation",
      "Your story starts here",
      "Be part of something big"
    ];
    
    const generateMessage = () => {
      const message = messages[Math.floor(Math.random() * messages.length)];
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      
      return {
        id: Date.now() + Math.random(),
        text: message,
        size,
        duration,
        delay,
        x,
        y
      };
    };
    
    // Initial messages
    setFloatingMessages(Array.from({ length: 8 }, generateMessage));
    
    // Add new message every few seconds
    const interval = setInterval(() => {
      setFloatingMessages(prev => {
        if (prev.length >= 15) return prev;
        return [...prev, generateMessage()].slice(-15);
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="max-h-screen pt-5 grid lg:grid-cols-2 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 relative overflow-hidden">
      {/* Floating chat messages */}
      {floatingMessages.map((msg) => (
        <div
          key={msg.id}
          className="absolute pointer-events-none z-0"
          style={{
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            fontSize: `${msg.size}px`,
            animation: `float ${msg.duration}s ease-in-out ${msg.delay}s infinite`,
            opacity: 0.7
          }}
        >
          <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/50 shadow-lg">
            {msg.text}
          </div>
        </div>
      ))}

      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 pb-0 mt-2 pt-6">
        <div className="w-full max-w-md space-y-2 bg-black/70 rounded-2xl p-8 border border-white/30 shadow-xl">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-16 rounded-xl bg-blue-600 from-primary to-secondary flex items-center justify-center 
                group-hover:from-primary/90 group-hover:to-secondary/90 transition-all shadow-lg"
              >
                <MessageSquare className="size-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-blue-600 from-primary to-secondary bg-clip-text text-transparent">
                Enter the Chatverse
              </h1>
              <p className="text-base-content/70 text-lg">Your gateway to seamless connections</p>
              <div className="flex items-center gap-1 mt-2 text-yellow-500">
                <Sparkles className="size-4" />
                <span className="text-sm font-medium">Join 10,000+ users worldwide</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80 text-white">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/60" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered rounded-xl text-white border-white w-full pl-10 bg-black/70 backdrop-blur-sm border-base-content/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all`}
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80 text-white">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/60" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered rounded-xl text-white border-white w-full pl-10 bg-black/70 backdrop-blur-sm border-base-content/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80 text-white">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered rounded-xl text-white border-white w-full pl-10 bg-black/70 backdrop-blur-sm border-base-content/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/20 rounded-md p-1 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/60" />
                  ) : (
                    <Eye className="size-5 text-base-content/60" />
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn w-full bg-blue-600 from-primary to-secondary border-none text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span className="ml-2">Opening the Gateway...</span>
                </>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="size-4 mr-2" />
                  Begin Your Journey
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-base-content/70">
              Already part of our world?{" "}
              <Link 
                to="/login" 
                className="link text-primary hover:text-secondary font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome to the Chatverse"
        subtitle="Where every connection begins a new story. Join our growing community today."
      />

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(5deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;