const mongoose = require("mongoose");

const therapiesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },

    type: {
      type: String,
      default: null,
      enum: ["infusion", "addons", "injections"],
      trim: true,
    },

    imageName: {
      type: String,
      default: null,
      trim: true,
    },

    price: {
      type: Number,
      default: null,
      trim: true,
    },

    description: {
      type: String,
      default: null,
      trim: true,
    },

    duration: {
      type: String,
      default: null,
      required: false,
    },
    benefits: {
      type: String,
      default: null,
      required: false,
    },
    ingredients: {
      type: String,
      default: null,
      required: false,
    },
    addedby: {
      type: String,
      default: "Admin",
      required: false,
    },
    therapyid: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      required: false,
    },

    therapists: {
      type: [],
      default: null,
      required: false,
    },
    ratings: {
      type: [],
      default: null,
    },
    ratedby: {
      type: [],
      default: null,
    },

    therapist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: false,
      default: null,
    },

    averagerating: {
      type: Number,
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Therapies = mongoose.model("Therapies", therapiesSchema);

module.exports = Therapies;