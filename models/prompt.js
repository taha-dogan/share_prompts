import { Schema, model, models } from "mongoose";

const promptSchema = new Schema({
  creator: {
    type: Schema.ObjectId,
    ref: "User", // for one to many relationship
  },

  prompt: {
    type: String,
    required: [true, "Please provide a prompt"],
  },

  tag: {
    type: String,
    required: [true, "Please provide a tag"],
  },
});

const Prompt = models.Prompt || model("Prompt", promptSchema);
export default Prompt;
