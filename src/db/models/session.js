import { Schema, model } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require:true,
    },
    accesToken: {
        type: String,
        require:true,
    },
    refreshToken: {
        type: String,
        require: true,
    }, 
    accesTokenValidUnit: {
        type: Date,
        require:true,
    },
    refreshTokenValidUnit: {
        type: Date,
        require: true,
    }
}, { versionKey: false, timestamps: true });

export const SessionCollection = model("session", sessionSchema);