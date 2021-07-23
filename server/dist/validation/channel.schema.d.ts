import * as yup from 'yup';
export declare const ChannelSchema: yup.ObjectSchema<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, Record<string, any>, string[], string[]>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, Record<string, any>, string[], string[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, yup.AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, Record<string, any>, string[], string[]>;
}>>>;
