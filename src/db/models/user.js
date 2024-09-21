import { model, Schema } from "mongoose";
import { emailRegexp } from "../../constant/user.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: emailRegexp,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,
});

export const UserCollections = model("user", userSchema);