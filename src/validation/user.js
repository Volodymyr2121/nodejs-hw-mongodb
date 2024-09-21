import Joi from "joi";
import { emailRegexp } from "../constant/user.js";

export const userSignUpSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least 3 characters',
        'string.max': 'Username should have at most 20 characters',
        'any.required': 'Username is required',
    }),
    email: Joi.string().pattern(emailRegexp).required().messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(20).required().messages({
        'string.min': 'Password should have at least 6 characters',
        'string.max': 'Password should have at most 20 characters',
        'any.required': 'Password is required'
    })
});

export const userSignInSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(20).required().messages({
        'string.min': 'Password should have at least 6 characters',
        'string.max': 'Password should have at most 20 characters',
        'any.required': 'Password is required'
    })
});
