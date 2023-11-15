import mongoose, { Schema } from "mongoose";
const savedPasswordSchema = new Schema({
    appName: String,
    userName: String,
    password: String,
});
const passwordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    savedPassword: [savedPasswordSchema],
});
export default mongoose.model("Password", passwordSchema);
