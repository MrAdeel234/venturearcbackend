import mongoose from "mongoose";
import Entrepreneur from "./EntrepreneurModel.js";

const IdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [10, "Title cannot be less than 10 characters"],
      maxlength: [150, "Title cannot be more than 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description cannot be less than 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technology", "Health", "Food Chain", "Education", "Clothing", "Sports", "Others"],
    },
    estimatedInvestment: {
      type: Number,
      required: [true, "Estimated investment is required"],
      min: [0, "Investment cannot be negative"],
    },
    equity: {
      type: Number,
      min: [0, "Equity cannot be negative"],
      default: 0,
    },
    isPatent: {
      type: String,
      required: [true, "Patent status is required"],
    },
    patentId: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    businessStage: {
      type: String,
      required: [true, "Business stage is required"],
      enum: [
        "New Idea",
        "Running Business",
      ],
    },
    Entrepreneur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Entrepreneur,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

IdeaSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const IdeaModel = mongoose.model("Idea", IdeaSchema);
export default IdeaModel;
