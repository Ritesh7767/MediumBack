import * as zod from 'zod'

export const userRegister = zod.object({
    username : zod.string().min(1),
    email: zod.string().email(),
    password: zod.string().min(1),
    image: zod.string().optional()
})

export const userLogin = userRegister.pick({
    email: true,
    password: true
})

export type userInterface = zod.infer<typeof userRegister>