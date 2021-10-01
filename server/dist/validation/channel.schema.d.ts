import * as yup from 'yup';
export declare const ChannelSchema: yup.ObjectSchema<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, import("yup/lib/types").AnyObject, string[], string[]>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, import("yup/lib/types").AnyObject, string[], string[]>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<import("yup/lib/object").ObjectShape, {
    name: import("yup/lib/string").RequiredStringSchema<string, Record<string, any>>;
    isPublic: yup.BooleanSchema<boolean, Record<string, any>, boolean>;
    members: yup.ArraySchema<yup.StringSchema<string, Record<string, any>, string>, import("yup/lib/types").AnyObject, string[], string[]>;
}>>>;
