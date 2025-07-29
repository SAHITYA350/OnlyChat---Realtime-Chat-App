/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic, Smile } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPickerButton from "./EmojiPickerButton";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      removeImage();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
  };

  return (
    <div className="w-full p-2 sm:p-4 bg-black/10 backdrop-blur-sm border-t border-white/10 fixed bottom-0 left-0 right-0 z-50">
      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-40 sm:max-h-60 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 btn btn-circle btn-xs sm:btn-sm btn-error"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />

        {/* Emoji Picker Button */}
        <EmojiPickerButton onEmojiClick={handleEmojiClick}>
          <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
        </EmojiPickerButton>

        {/* Upload Image Button */}
        <label
          htmlFor="image-upload"
          className={`btn btn-circle btn-xs sm:btn-sm ${
            imagePreview ? "btn-success" : "btn-ghost"
          }`}
        >
          <Image className="w-4 h-4 sm:w-5 sm:h-5" />
        </label>

        {/* Voice (disabled) */}
        <button
          type="button"
          className="btn btn-circle btn-xs sm:btn-sm btn-ghost sm:hidden"
          onClick={() => toast("Voice messages coming soon!")}
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 input input-sm sm:input-md input-bordered bg-white/10 border-white/20 text-white placeholder-white/50 overflow-y-auto mt-[-12px]"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="btn btn-circle btn-xs sm:btn-sm btn-primary"
        >
          <Send className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
