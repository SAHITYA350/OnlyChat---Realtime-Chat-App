
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, MessageSquare, Zap, Crown, Check } from "lucide-react";
import { useState } from "react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
  { id: 3, content: "Check out these new theme options!", isSent: true },
  { id: 4, content: "Wow, they look amazing! 😍", isSent: false },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("themes");
  const [subscriptionPlan, setSubscriptionPlan] = useState("pro"); // 'free', 'pro', 'premium'

  return (
    <div className="h-full container relative mx-auto px-4 pb-10 max-w-6xl pt-12 bg-fixed">
      <div className="flex flex-col lg:flex-row gap-6 h-full pt-5">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-4 sticky mt-4 top-6">
            <h1 className="text-xl font-bold mb-6 flex items-center gap-2 pt-2 mt-2">
              <Palette className="text-primary" /> Settings
            </h1>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("themes")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "themes" ? "bg-primary/10 text-primary font-medium" : "hover:bg-base-200"}`}
              >
                <Palette size={18} />
                <span>Theme Customization</span>
                {activeTab === "themes" && <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>}
              </button>
              
              <button
                onClick={() => setActiveTab("premium")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "premium" ? "bg-primary/10 text-primary font-medium" : "hover:bg-base-200"}`}
              >
                <Crown size={18} className="text-amber-500" />
                <span>Premium Features</span>
                {activeTab === "premium" && <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>}
              </button>
              
              <button
                onClick={() => setActiveTab("chat")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "chat" ? "bg-primary/10 text-primary font-medium" : "hover:bg-base-200"}`}
              >
                <MessageSquare size={18} />
                <span>Chat Settings</span>
                {activeTab === "chat" && <span className="ml-auto w-2 h-2 bg-primary rounded-full"></span>}
              </button>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-base-300">
              <div className="flex items-center gap-2 text-sm">
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${subscriptionPlan === "premium" ? "bg-amber-500/20 text-amber-500" : subscriptionPlan === "pro" ? "bg-purple-500/20 text-purple-500" : "bg-base-300"}`}>
                  {subscriptionPlan === "premium" ? "Premium" : subscriptionPlan === "pro" ? "Pro" : "Free"}
                </div>
                <span className="text-base-content/70">
                  {subscriptionPlan === "premium" ? "Unlocked all features" : subscriptionPlan === "pro" ? "Pro features active" : "Basic plan"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "themes" && (
            <div className="space-y-6">
              <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
                <div className="flex flex-col gap-1 mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Palette size={20} /> Theme Customization
                  </h2>
                  <p className="text-sm text-base-content/70">
                    Choose a theme that matches your style and personality
                  </p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t}
                      className={`
                        group flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                        ${theme === t ? "ring-2 ring-primary ring-offset-2" : "hover:bg-base-200/50"}
                      `}
                      onClick={() => setTheme(t)}
                    >
                      <div  className="relative h-10 w-full rounded-lg overflow-hidden shadow-sm" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5">
                          <div className="rounded bg-primary"></div>
                          <div className="rounded bg-secondary"></div>
                          <div className="rounded bg-accent"></div>
                          <div className="rounded bg-neutral"></div>
                        </div>
                        {theme === t && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <Check className="size-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium truncate w-full text-center">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                <div className="p-5 border-b border-base-300">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare size={18} /> Live Preview
                  </h3>
                </div>
                <div className="p-4 md:p-6">
                  <div className="max-w-lg mx-auto">
                    {/* Mock Chat UI */}
                    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden border border-base-300">
                      {/* Chat Header */}
                      <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                            J
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">John Doe</h3>
                            <p className="text-xs text-base-content/70">Online</p>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                          Pro User
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-4 min-h-[250px] max-h-[250px] overflow-y-auto bg-base-100">
                        {PREVIEW_MESSAGES.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`
                                max-w-[80%] rounded-xl p-3 shadow-sm relative
                                ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                                ${message.isSent && subscriptionPlan === "premium" ? "bg-gradient-to-br from-primary to-primary/80" : ""}
                              `}
                            >
                              {subscriptionPlan === "premium" && message.isSent && (
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-0.5">
                                  <Zap className="size-3" />
                                </div>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <p
                                  className={`
                                    text-[10px]
                                    ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                                  `}
                                >
                                  12:00 PM
                                </p>
                                {message.isSent && (
                                  <span className="text-[10px]">
                                    {subscriptionPlan === "premium" ? "✨ Delivered" : "Delivered"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-base-300 bg-base-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered flex-1 text-sm h-10"
                            placeholder="Type a message..."
                            value="This is a preview"
                            readOnly
                          />
                          <button className={`btn h-10 min-h-0 ${subscriptionPlan === "premium" ? "bg-gradient-to-r from-primary to-purple-600 text-white" : "btn-primary"}`}>
                            <Send size={18} />
                          </button>
                        </div>
                        {subscriptionPlan === "premium" && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-primary">
                            <Zap className="size-3" />
                            <span>Premium: Your messages get special effects</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "premium" && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Crown className="text-amber-500" /> Upgrade to Premium
                </h2>
                <p className="text-sm text-base-content/70">
                  Unlock exclusive features and customization options
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {/* Free Plan */}
                <div className="border border-base-300 rounded-xl p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Free</h3>
                    <p className="text-sm text-base-content/70">Basic features</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold">$0</span>
                    <span className="text-sm text-base-content/70">/month</span>
                  </div>
                  <button 
                    onClick={() => setSubscriptionPlan("free")}
                    className={`btn btn-block ${subscriptionPlan === "free" ? "btn-primary" : "btn-ghost"}`}
                  >
                    {subscriptionPlan === "free" ? "Current Plan" : "Select"}
                  </button>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>Basic themes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                      <Check className="size-4 text-base-content/30" />
                      <span>No premium badges</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                      <Check className="size-4 text-base-content/30" />
                      <span>Standard messaging</span>
                    </div>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className="border border-primary/30 rounded-xl p-5 bg-primary/5 relative">
                  {subscriptionPlan === "pro" && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-content text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      Current
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Pro</h3>
                    <p className="text-sm text-base-content/70">For power users</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold">$4.99</span>
                    <span className="text-sm text-base-content/70">/month</span>
                  </div>
                  <button 
                    onClick={() => setSubscriptionPlan("pro")}
                    className={`btn btn-block ${subscriptionPlan === "pro" ? "btn-primary" : "btn-outline"}`}
                  >
                    {subscriptionPlan === "pro" ? "Current Plan" : "Upgrade"}
                  </button>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>All themes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>Pro badge</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/50">
                      <Check className="size-4 text-base-content/30" />
                      <span>No special effects</span>
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-amber-500/30 rounded-xl p-5 bg-amber-500/5 relative">
                  <div className="absolute top-3 -left-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-r-lg shadow-sm">
                    Popular
                  </div>
                  {subscriptionPlan === "premium" && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      Current
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-1">
                      <Crown className="text-amber-500" /> Premium
                    </h3>
                    <p className="text-sm text-base-content/70">Ultimate experience</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-2xl font-bold">$9.99</span>
                    <span className="text-sm text-base-content/70">/month</span>
                  </div>
                  <button 
                    onClick={() => setSubscriptionPlan("premium")}
                    className={`btn btn-block ${subscriptionPlan === "premium" ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"}`}
                  >
                    {subscriptionPlan === "premium" ? "Current Plan" : "Get Premium"}
                  </button>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>All themes + customization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>Premium badge & effects</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-500" />
                      <span>Special message effects</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-base-200/50 rounded-xl p-5 border border-base-300">
                <h3 className="font-bold text-lg mb-3">Premium Features</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Special Effects</h4>
                      <p className="text-sm text-base-content/70">Your messages stand out with unique visual effects</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Palette className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Advanced Themes</h4>
                      <p className="text-sm text-base-content/70">Access exclusive color schemes and customization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <Crown className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Premium Badge</h4>
                      <p className="text-sm text-base-content/70">Show off your status with a special profile badge</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      <MessageSquare className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Priority Support</h4>
                      <p className="text-sm text-base-content/70">Get faster responses from our support team</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare size={20} /> Chat Settings
                </h2>
                <p className="text-sm text-base-content/70">
                  Customize your chat experience
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Message Sounds</h3>
                      <p className="text-sm text-base-content/70">Play sound when receiving new messages</p>
                    </div>
                    <label className="cursor-pointer">
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Read Receipts</h3>
                      <p className="text-sm text-base-content/70">Show when others have read your messages</p>
                    </div>
                    <label className="cursor-pointer">
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-base-content/70">Switch between light and dark themes</p>
                    </div>
                    <label className="cursor-pointer">
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>

                  {subscriptionPlan === "premium" && (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center gap-1">
                          <Zap className="size-4 text-amber-500" /> Premium Effects
                        </h3>
                        <p className="text-sm text-base-content/70">Enable special message effects</p>
                      </div>
                      <label className="cursor-pointer">
                        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                      </label>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-base-300">
                  <h3 className="font-medium mb-3">Chat Density</h3>
                  <div className="flex gap-3">
                    <button className="btn btn-sm btn-outline">Compact</button>
                    <button className="btn btn-sm btn-primary">Default</button>
                    <button className="btn btn-sm btn-outline">Comfortable</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;