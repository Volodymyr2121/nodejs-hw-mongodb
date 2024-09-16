import Joi from "joi";
import { contactTypeList } from "../constant/contacts.js";

export const contactsAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    'any.required': 'Username is required',
    }),
    phoneNumber: Joi.string().min(8).max(12).required().messages({
        'string.min': 'Phone number should have at least 8 characters',
        'string.max': 'Phone number have at most 12 characters',
        'any.required': 'Phone number is required'
    }),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList).required(),
});

export const contactsPatchSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least 3 characters',
    'string.max': 'Username should have at most 20 characters',
    }),
    phoneNumber: Joi.string().min(3).max(12).messages({
        'string.min': 'Phone number should have at least 8 characters',
        'string.max': 'Phone number have at most 12 characters',
    }),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactTypeList),
});