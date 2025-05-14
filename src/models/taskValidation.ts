import { z } from 'zod'

export const taskValidationSchema = z.object({
  priority: z.unknown(),
  description: z.unknown(),
  deadline: z.unknown(),
  name: z.string().min(1, 'Название обязательно'),
  tags: z.array(z.string()).min(1, 'Укажите хотя бы один тег').default([]),
})
