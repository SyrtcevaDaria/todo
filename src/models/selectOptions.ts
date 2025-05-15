import {
  type PeriodExecution,
  PeriodExecutionLabelMap,
  type Priority,
  PriorityLabelMap,
  PriorityThemesMap,
} from '@/types.ts'

export const priorityList: {
  label: (typeof PriorityLabelMap)[keyof typeof PriorityLabelMap]
  value: Priority
  theme: (typeof PriorityThemesMap)[keyof typeof PriorityThemesMap]
}[] = [
  {
    theme: PriorityThemesMap['low'],
    value: 'low',
    label: PriorityLabelMap['low'],
  },
  { value: 'medium', label: PriorityLabelMap['medium'], theme: PriorityThemesMap['medium'] },
  { value: 'high', label: PriorityLabelMap['high'], theme: PriorityThemesMap['high'] },
]

export const periodExecutionList: {
  label: (typeof PeriodExecutionLabelMap)[keyof typeof PeriodExecutionLabelMap]
  value: PeriodExecution
}[] = [
  {
    value: 'overdue',
    label: PeriodExecutionLabelMap['overdue'],
  },
  { value: 'today', label: PeriodExecutionLabelMap['today'] },
  { value: 'future', label: PeriodExecutionLabelMap['future'] },
]
