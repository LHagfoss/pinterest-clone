import { z } from "zod";

export const UserSchema = z.object({
    uid: z.string(),
    email: z.string(),
    displayName: z.string().nullable().optional(),
    photoURL: z.string().nullable().optional(),
    bio: z.string().optional(),
    website: z.string().optional().or(z.literal("")),
    username: z.string().optional(),

    tagAffinity: z.record(z.string(), z.number()).default({}),
    seenPinIds: z.array(z.string()).default([]),

    createdAt: z.any().optional(),
});

export type UserProfile = z.infer<typeof UserSchema>;
