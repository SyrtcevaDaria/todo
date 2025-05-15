export type Priority = 'low' | 'medium' | 'high'
export type PeriodExecution = 'overdue' | 'today' | 'future'
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

export const PeriodExecutionLabelMap = {
  overdue: 'Просроченные',
  today: 'Сегодняшние',
  future: 'Предстоящие',
} as const

export type FilterRules = {
  searchNameString: string
  searchDescriptionString: string
  tags: string[]
  periodExecution: PeriodExecution | null
  priority: Priority | null
}
export type Task = {
  id: string
  name: string
  description: string
  tags: string[]
  deadline: Date | null
  priority: Priority | null
  isDone: boolean
}
