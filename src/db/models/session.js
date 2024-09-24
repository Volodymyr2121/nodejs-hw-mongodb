import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require:true,
    },
    accessToken: {
        type: String,
        require:true,
    },
    refreshToken: {
        type: String,
        require: true,
    }, 
    accessTokenValidUnit: {
        type: Date,
        require:true,
    },
    refreshTokenValidUnit: {
        type: Date,
        require: true,
    }
}, { versionKey: false, timestamps: true });

export const SessionCollection = model("session", sessionSchema);