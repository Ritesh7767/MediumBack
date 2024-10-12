import zod, { string } from 'zod'

export const postValidation = zod.object({
    title: zod.string().min(1),
    subtitle: zod.string().optional(),
    content: zod.string().min(1),
    image: zod.string().optional(),
})

export type postType = zod.infer<typeof postValidation> & {
    date: Date
}
