"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordSchema = exports.ChangePasswordSchema = exports.ResetPasswordSchema = exports.UserSchema = exports.RegisterSchema = void 0;
const yup = require("yup");
exports.RegisterSchema = yup.object().shape({
    username: yup.string().min(3).max(30).required(),
    email: yup.string().email().required(),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(150)
        .required(),
});
exports.UserSchema = yup.object().shape({
    email: yup
        .string()
        .email()
        .lowercase()
        .required('Email is required')
        .defined(),
    username: yup
        .string()
        .min(3)
        .max(30)
        .trim()
        .required('Username is required')
        .defined(),
});
exports.ResetPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(150)
        .required('New Password is required')
        .defined(),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
        .required('Confirm New Password is required')
        .defined(),
});
exports.ChangePasswordSchema = yup.object().shape({
    currentPassword: yup.string().required('Old Password is required').defined(),
    newPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(150)
        .required('New Password is required')
        .defined(),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), undefined], 'Passwords do not match')
        .required('Confirm New Password is required')
        .defined(),
});
exports.ForgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email()
        .lowercase()
        .required('Email is required')
        .defined(),
});
//# sourceMappingURL=user.schema.js.map