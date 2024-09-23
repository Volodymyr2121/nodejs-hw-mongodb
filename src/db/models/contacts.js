import { model, Schema } from "mongoose";
import { contactTypeList } from "../../constant/contacts.js";

const contactsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
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
        enum: contactTypeList,
        default: "personal",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true,
    }
},
    {
        timestamps: true,
    versionKey: false,
});

export const ContactCollection = model("contacts", contactsSchema);