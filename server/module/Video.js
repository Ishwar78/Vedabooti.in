import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },
    tag: {
      type: String,
      default: "100% NATURAL",
      trim: true,
    },
    videoSrc: {
      type: String,
      required: [true, "Video file or URL is required"],
      trim: true,
    },
    link: {
      type: String,
      default: "/shop",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
    order: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
