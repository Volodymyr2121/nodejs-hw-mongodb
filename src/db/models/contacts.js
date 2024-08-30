import { model, Schema } from "mongoose";

const contactsSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        required: true,
        enum: ["work", "home", "personal"],
        default: "personal",
    }
},
{timestamps: true,});

export const ContactCollection = model("contacts", contactsSchema);