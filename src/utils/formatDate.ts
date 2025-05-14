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

export function formatDateWithDetails(date: Date): string {
  const deadline = new Date(date)
  const daysDiff = Math.round((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    return 'Дедлайн сегодня'
  } else if (daysDiff < 0) {
    return `Просрочено на ${Math.abs(daysDiff)} ${definePhrase(Math.abs(daysDiff))}`
  } else {
    const { day, month, year } = useDestructiveDate(date)
    return `Дедлайн через ${daysDiff} ${definePhrase(daysDiff)} - ${day}.${month}.${year}`
  }
}
