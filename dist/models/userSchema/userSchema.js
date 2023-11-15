import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
export default mongoose.model("User", userSchema);
