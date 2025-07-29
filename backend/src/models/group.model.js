import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupPic: {
      type: String,
      default: "",
    },
    settings: {
      onlyAdminCanSend: {
        type: Boolean,
        default: false,
      },
      onlyAdminCanAddMembers: {
        type: Boolean,
        default: true,
      },
      allowMembersToLeave: {
        type: Boolean,
        default: true,
      },
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for better query performance
groupSchema.index({ members: 1 });
groupSchema.index({ admin: 1 });
groupSchema.index({ createdAt: -1 });

// Update lastActivity when group is modified
groupSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

const Group = mongoose.model("Group", groupSchema);
export default Group;