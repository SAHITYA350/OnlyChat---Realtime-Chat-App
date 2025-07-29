import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  // Floating message animation
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Create floating messages
    const messageContents = [
      "Welcome back!",
      "Ready to chat?",
      "Your conversations await",
      "Connect with friends",
      "New messages waiting"
    ];
    
    const interval = setInterval(() => {
      if (messages.length < 5) {
        const newMessage = {
          id: Date.now(),
          content: messageContents[Math.floor(Math.random() * messageContents.length)],
          x: Math.random() * 80 + 10, // 10-90%
          y: Math.random() * 80 + 10,
          opacity: 0,
          scale: 0.8
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Animate in
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === newMessage.id ? {...msg, opacity: 1, scale: 1} : msg
          ));
        }, 50);
        
        // Animate out after delay
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
        }, 5000);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 relative overflow-hidden">
      {/* Floating animated messages */}
      {messages.map((message) => (
        <div
          key={message.id}
          className="absolute hidden lg:block pointer-events-none"
          style={{
            left: `${message.x}%`,
            top: `${message.y}%`,
            opacity: message.opacity,
            transform: `scale(${message.scale})`,
            transition: 'all 0.5s ease-out',
          }}
        >
          <div className="glass-morphism bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/80 text-sm font-medium shadow-lg">
            {message.content}
          </div>
        </div>
      ))}

      {/* Left Side - Form */}
<div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 ">

        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black/40 backdrop: blur-xl">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-glow blur-[2px] opacity-60"
        style={{
          width: `${6 + Math.random() * 10}px`,
          height: `${6 + Math.random() * 10}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: `hsla(${Math.random() * 360}, 70%, 80%, 0.8)`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${8 + Math.random() * 12}s`,
        }}
      />
    ))}
  </div>


        <div className="w-full max-w-md space-y-8 relative">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
                transition-all duration-300 transform group-hover:scale-110 border border-primary/20 shadow-lg"
              >
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-clip-text text-transparent bg-blue-600 from-primary to-secondary">
                Welcome Back
              </h1>
              <p className="text-base-content/60 text-lg">Enter the chat onlychat universe</p>
            </div>
          </div>

          {/* Form with glassmorphism */}
          <div className="glass-morphism bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-lg">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 rounded-xl border-white focus:border-primary/50 focus:ring-1 focus:ring-primary/30`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-lg">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10  border-white rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/30`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex  items-center hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-base-content/60 hover:text-primary" />
                    ) : (
                      <Eye className="h-5 w-5 text-base-content/60 hover:text-primary" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full h-12 text-lg font-medium shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.01]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="ml-2">Entering chat...</span>
                  </>
                ) : (
                  <>
                    <span>Unlock Messages</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-base-content/60 text-lg">
                New to the chatverse?{" "}
                <Link to="/signup" className="link link-primary font-medium hover:text-secondary transition-colors">
                  Create new account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;