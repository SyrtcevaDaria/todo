export type Priority = 'low' | 'medium' | 'high'
export const PriorityThemesMap = {
  low: 'info',
  medium: 'warn',
  high: 'danger',
} as const
export const PriorityLabelMap = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
} as const
export type Task = {
  id: string
  name: string
  description: string
  tags: string[]
  deadline: Date | undefined
  priority: Priority | undefined
  isDone: boolean
}
