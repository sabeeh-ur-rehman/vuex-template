import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantCode: z.string().min(2)
})

export const SelfRegisterSchema = z.object({
  tenantCode: z.string().min(2),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})
