function definePhrase(count: number): string {
  const lastNumber = count % 10
  const twoLastNumbers = count % 100
  if (lastNumber === 1 && twoLastNumbers !== 11) {
    return 'день'
  }
  if (lastNumber >= 2 && lastNumber <= 4 && (twoLastNumbers < 10 || twoLastNumbers >= 20)) {
    return 'дня'
  }
  return 'дней'
}
export const useDestructiveDate = (date: Date) => {
  const addLeadingZero = (num: number) => (num < 10 ? `0${num}` : '' + num)
  const day = addLeadingZero(date.getDate())
  const month = addLeadingZero(date.getMonth() + 1)
  const year = date.getFullYear().toString()
  return { day, month, year }
}

export const getStartDay = (dateVal: Date) => {
  const copy = new Date(dateVal)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function formatDateWithDetails(date: Date): string {
  const deadline = getStartDay(new Date(date))
  const today = getStartDay(new Date())
  if (deadline.getTime() === today.getTime()) {
    return 'Дедлайн сегодня'
  }
  const daysDiff = Math.round((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const { day, month, year } = useDestructiveDate(deadline)
  if (daysDiff < 0) {
    return `Просрочено на ${Math.abs(daysDiff)} ${definePhrase(Math.abs(daysDiff))}`
  } else {
    return `Дедлайн через ${daysDiff} ${definePhrase(daysDiff)} - ${day}.${month}.${year}`
  }
}
