import { z } from "zod";

export const PinSchema = z.object({
    id: z.string(),
    userId: z.string(),

    width: z.number(),
    height: z.number(),
    ratio: z.number(),
    dominantColor: z.string().default("#000000"),

    title: z.string(),
    imageUrl: z.string(),
    description: z.string(),
    blurhash: z.string().optional(),
    tags: z.array(z.string()).default([]),

    stats: z
        .object({
            likes: z.number().default(0),
            views: z.number().default(0),
            clicks: z.number().default(0),
            score: z.number().default(0),
        })
        .default({}),

    createdAt: z.any().optional(),
});

export type Pin = z.infer<typeof PinSchema>;
