import zod, { string } from 'zod'

export const postValidation = zod.object({
    title: zod.string().min(1),
    content: zod.string().min(1),
})

export type postType = zod.infer<typeof postValidation> & {
    date: Date
}
