
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerButton = ({ onEmojiClick, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      {/* Emoji Trigger Button */}
      <button
        type="button"
        className="btn btn-circle btn-xs sm:btn-sm btn-ghost"
        onClick={() => setShow((prev) => !prev)}
      >
        {children}
      </button>

      {/* Emoji Picker Dropdown */}
      {show && (
        <div className="absolute bottom-full mb-2 z-50 bg-white rounded-md shadow-lg">
          {/* ❌ Close Button */}
          <div className="flex justify-end px-2 pt-2">
            <button
              onClick={() => setShow(false)}
              className="text-gray-500 hover:text-red-600 text-sm font-semibold bg-red-200"
            >
              ❌
            </button>
          </div>

          {/* Emoji Picker */}
          <EmojiPicker
            height={350}
            width={250}
            onEmojiClick={(e) => {
              onEmojiClick(e.emoji);
              setShow(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
