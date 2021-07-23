import * as yup from 'yup';
export declare const RegisterSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    username: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    email: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    password: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    username: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    email: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    password: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    username: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    email: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    password: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
}>>>;
export declare const UserSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    username: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    username: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    username: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>>;
export declare const ResetPasswordSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>>;
export declare const ChangePasswordSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    currentPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    currentPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    currentPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    newPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
    confirmNewPassword: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>>;
export declare const ForgotPasswordSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    email: import("yup/lib/string").DefinedStringSchema<string, Record<string, any>>;
}>>>;
